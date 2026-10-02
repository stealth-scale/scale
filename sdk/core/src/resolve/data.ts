/**
 * Checks the queries' and mutations' operations and selectors, each route's data, and every
 * `field` condition, and resolves the queries and mutations.
 *
 * @remarks
 *   A route's data takes each variable from the route's parameters, then from its search. The
 *   router merges a parent's search into its children's, so a variable is checked against the
 *   parameters of the route's path and its parents' paths only where neither the route nor a
 *   parent states a search. A `field` condition reads the record a slot renders with, so it is
 *   allowed only in the condition of an extension whose target slot states `record`.
 */

import { type ChangeSelector, type RecordSelector } from "#data.ts";
import { pluginOf } from "#identifiers.ts";
import {
  conditionsIn,
  type Declaration,
  isInstalled,
  pathOf,
  type ResolveContext,
} from "#resolve/context.ts";
import { declarationOf, declarationsOf, type Declared } from "#resolve/declared.ts";
import { type Report } from "#resolve/problem.ts";
import { type ResolvedMutation, type ResolvedQuery } from "#resolve/resolved.ts";
import { isEvery } from "#slot.ts";

/**
 * Matches each parameter a path names: `$id`, `{$id}` or `{-$id}`.
 */
const PARAMETER = /\$([A-Za-z_]\w*)/gu;

/**
 * Describes the queries and mutations the build resolved.
 */
export interface Operated {
  /**
   * Every mutation, in install order.
   */
  readonly mutations: readonly ResolvedMutation[];

  /**
   * Every query, in install order.
   */
  readonly queries: readonly ResolvedQuery[];
}

/**
 * Lists the routes a route nests under, the nearest first, up to a ring or an undeclared parent.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param parent - Qualified id of the route's parent.
 */
function lineOf(
  context: ResolveContext,
  parent: string | undefined,
): ReadonlyArray<Declared<"route">> {
  const line: Array<Declared<"route">> = [];
  let next = parent;

  while (next !== undefined && !line.some(({ id }) => id === next)) {
    const route = declarationOf(context, "route", next)?.reference;

    if (route === undefined) break;

    line.push(route);
    next = route.parent?.id;
  }

  return line;
}

/**
 * Checks the variables each route's data names against the parameters of its paths, where neither
 * the route nor a parent states a search.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param report - The report the faults go into.
 */
function checkRouteData(context: ResolveContext, report: Report): void {
  for (const declaration of declarationsOf(context, "route")) {
    const { data = [], parent } = declaration.reference;
    const routes = [declaration.reference, ...lineOf(context, parent?.id)];
    const names = new Set(
      routes.flatMap(({ path }) => [...path.matchAll(PARAMETER)].map(([, name]) => name)),
    );
    const searched = routes.some(({ search }) => search !== undefined);

    for (const [index, { variables = [] }] of data.entries()) {
      for (const [place, variable] of variables.entries()) {
        if (!searched && !names.has(variable)) {
          report.problem(
            `${pathOf(declaration)}.data.${String(index)}.variables.${String(place)}`,
            `names ${variable}, which is no parameter of the path, and the route has no search`,
          );
        }
      }
    }
  }
}

/**
 * Returns why a decision's permission cannot decide on a query's records.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param id - Qualified id of the decision's permission.
 * @param kinds - Qualified ids of the resource kinds the query's records are of.
 * @returns The reason, or undefined where the permission is scoped to one of the kinds, or is a
 *   name the references check reports.
 */
function decisionFault(
  context: ResolveContext,
  id: string,
  kinds: ReadonlySet<string>,
): string | undefined {
  const declared = declarationOf(context, "permission", id);
  const resource = declared?.reference.resource?.id;

  if (!isInstalled(context, pluginOf(id)))
    return `names the permission ${id}, whose plugin is not installed`;

  if (declared === undefined) return undefined;

  if (resource === undefined) return `names ${id}, which is not scoped`;

  return kinds.has(resource)
    ? undefined
    : `is scoped to ${resource}, which none of the query's records are`;
}

/**
 * Checks each decision of a query: its permission installed, scoped, and scoped to a kind of the
 * query's records.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param declaration - The declared query.
 * @param report - The report the faults go into.
 */
function checkDecisions(
  context: ResolveContext,
  declaration: Declaration<Declared<"query">>,
  report: Report,
): void {
  const { decisions = [], records = [] } = declaration.reference;
  const kinds = new Set(records.map(({ type }) => type.id));

  for (const [index, { permission }] of decisions.entries()) {
    const fault = decisionFault(context, permission.id, kinds);

    if (fault !== undefined) {
      report.problem(`${pathOf(declaration)}.decisions.${String(index)}.permission`, fault);
    }
  }
}

/**
 * Reports the resource kinds selectors name whose plugin is not installed.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param path - The selectors' dotted path.
 * @param selectors - The selectors, each with its resource kind.
 * @param report - The report the faults go into.
 */
function checkKinds(
  context: ResolveContext,
  path: string,
  selectors: ReadonlyArray<ChangeSelector | RecordSelector>,
  report: Report,
): void {
  for (const [index, { type }] of selectors.entries()) {
    if (!isInstalled(context, pluginOf(type.id))) {
      report.problem(
        `${path}.${String(index)}.type`,
        `names the resource ${type.id}, whose plugin is not installed`,
      );
    }
  }
}

/**
 * Checks the operations every installed plugin declares: one id under one kind.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param report - The report the faults go into.
 */
function checkOperations(context: ResolveContext, report: Report): void {
  const seen = new Map<string, Readonly<Record<"kind" | "plugin", string>>>();
  const declared = [...declarationsOf(context, "query"), ...declarationsOf(context, "mutation")];

  for (const declaration of declared) {
    const { id, kind } = declaration.reference.operation;
    const other = seen.get(id);
    const at = `${pathOf(declaration)}.operation.id`;

    if (other === undefined) {
      seen.set(id, { kind, plugin: declaration.plugin });
    } else if (other.kind !== kind) {
      report.problem(at, `is ${id}, which ${other.plugin} declares as a ${other.kind}`);
    } else if (other.plugin !== declaration.plugin) {
      report.warning(at, `is ${id}, which ${other.plugin} declares too`);
    }
  }
}

/**
 * Returns true where an extension's target is a slot that states `record`.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param declaration - The declared extension.
 */
function readsRecord(
  context: ResolveContext,
  declaration: Declaration<Declared<"extension">>,
): boolean {
  const { target } = declaration.reference;

  return (
    !isEvery(target) &&
    target.kind === "slot" &&
    declarationOf(context, "slot", target.id)?.reference.record !== undefined
  );
}

/**
 * Checks every `field` condition: allowed only in an extension whose target slot states `record`.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param report - The report the faults go into.
 */
function checkFields(context: ResolveContext, report: Report): void {
  const declared = [
    ...declarationsOf(context, "command"),
    ...declarationsOf(context, "extension").filter((one) => !readsRecord(context, one)),
    ...declarationsOf(context, "route"),
    ...declarationsOf(context, "settingsPage"),
    ...declarationsOf(context, "settingsSection"),
  ];
  const conditions = [
    ...declared.flatMap((declaration) =>
      conditionsIn(declaration.reference.when, `${pathOf(declaration)}.when`),
    ),
    ...conditionsIn(context.definition.when, "product.when"),
    ...[...context.installed.values()].flatMap(({ options, pluginId }) =>
      conditionsIn(options.when, `product.plugins.${pluginId}.when`),
    ),
  ];

  for (const { path, when } of conditions) {
    if (when.field !== undefined) {
      report.problem(
        `${path}.field`,
        "is refused outside an extension of a slot that states record",
      );
    }
  }
}

/**
 * Checks every query, mutation, route's data and `field` condition, and resolves every query and
 * mutation.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param report - The report the faults go into.
 */
export function resolveData(context: ResolveContext, report: Report): Operated {
  const queries = declarationsOf(context, "query");
  const mutations = declarationsOf(context, "mutation");

  checkOperations(context, report);
  checkRouteData(context, report);
  checkFields(context, report);

  for (const declaration of queries) {
    checkKinds(
      context,
      `${pathOf(declaration)}.records`,
      declaration.reference.records ?? [],
      report,
    );
    checkDecisions(context, declaration, report);
  }

  for (const declaration of mutations) {
    checkKinds(
      context,
      `${pathOf(declaration)}.changes`,
      declaration.reference.changes ?? [],
      report,
    );
  }

  return {
    mutations: mutations.map(({ plugin, reference }) => ({
      changes: (reference.changes ?? []).map(({ action, id, type }) => ({
        action,
        id,
        type: type.id,
      })),
      id: reference.id,
      operation: reference.operation,
      plugin,
      sample: reference.sample,
    })),
    queries: queries.map(({ plugin, reference }) => ({
      decisions: (reference.decisions ?? []).map(({ at, field, id, permission }) => ({
        at,
        field,
        id,
        permission: permission.id,
      })),
      id: reference.id,
      operation: reference.operation,
      plugin,
      records: (reference.records ?? []).map(({ at, id, list, type }) => ({
        at,
        id,
        list,
        type: type.id,
      })),
      sample: reference.sample,
      staleTime: reference.staleTime,
    })),
  };
}
