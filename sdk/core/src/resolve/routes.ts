/**
 * Checks every route's path, parent, condition, parameters and menu, and resolves each route with
 * its condition joined with the product's.
 *
 * @remarks
 *   The router reads `home`, `/home` and `home/` as one path, so two routes conflict where their
 *   trimmed paths match under one parent. The host compiles each settings page as a child of
 *   `host/settings` at `<plugin id>/<name>`, so a route under `host/settings` conflicts with those
 *   too. The host evaluates a route's condition, and the product's condition joined into it, before
 *   the route matches, so neither states `route`.
 */

import { type When } from "#condition.ts";
import { hostContract } from "#host.ts";
import { pluginOf } from "#identifiers.ts";
import {
  conditionsIn,
  type Declaration,
  isInstalled,
  pathOf,
  type ResolveContext,
} from "#resolve/context.ts";
import { declarationsOf, type Declared } from "#resolve/declared.ts";
import { type Report } from "#resolve/problem.ts";
import { cycleOf } from "#resolve/requirements.ts";
import { type ResolvedRoute } from "#resolve/resolved.ts";
import { type Placed } from "#resolve/slots.ts";

/**
 * Describes a declared route.
 */
type RouteDeclaration = Declaration<Declared<"route">>;

/**
 * Matches a path segment in the `:name` form, which the router reads as text.
 */
const COLON = /(?:^|\/):[A-Za-z_]/u;

/**
 * Writes a path the one way the router reads it: the slashes around it trimmed, then one leading
 * slash.
 *
 * @param path - The path as the marker states it.
 */
export function normalised(path: string): string {
  return `/${path.replaceAll(/^\/+|\/+$/gu, "")}`;
}

/**
 * Joins the product's condition with a route's own.
 *
 * @param product - The product's condition.
 * @param own - The route's condition.
 * @returns Both, either or none.
 */
function joined(product: undefined | When, own: undefined | When): undefined | When {
  if (product === undefined) return own;

  return own === undefined ? product : { allOf: [product, own] };
}

/**
 * Reports each `route` member a condition nests.
 *
 * @param when - The condition.
 * @param path - Its dotted path.
 * @param report - The report the faults go into.
 */
function refuseRoutes(when: undefined | When, path: string, report: Report): void {
  for (const nested of conditionsIn(when, path)) {
    if (nested.when.route !== undefined) {
      report.problem(`${nested.path}.route`, "is refused where the condition runs before a match");
    }
  }
}

/**
 * Checks the paths every route serves under its parent, the settings pages included.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param report - The report the faults go into.
 */
function checkConflicts(context: ResolveContext, report: Report): void {
  const served = new Map<string, string>();
  const settings = hostContract.routes.settings.id;

  for (const { name, plugin } of declarationsOf(context, "settingsPage")) {
    served.set(`${settings} /${plugin}/${name}`, `${settings}/${plugin}/${name}`);
  }

  for (const declaration of declarationsOf(context, "route")) {
    const { id, parent, path } = declaration.reference;
    const under = parent?.id ?? "the root";
    const key = `${under} ${normalised(path)}`;
    const other = served.get(key);

    if (other === undefined) {
      served.set(key, id);
    } else {
      report.problem(
        `${pathOf(declaration)}.path`,
        `serves ${normalised(path)} under ${under}, as ${other} does`,
      );
    }
  }
}

/**
 * Checks the parents every route nests under, for a ring.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param report - The report the faults go into.
 */
function checkCycles(context: ResolveContext, report: Report): void {
  const graph = new Map(
    declarationsOf(context, "route").map(({ reference }) => [
      reference.id,
      reference.parent === undefined ? [] : [reference.parent.id],
    ]),
  );
  const cycle = cycleOf(graph);

  if (cycle !== undefined) {
    const plugin = pluginOf(cycle.from);
    const name = cycle.from.slice(plugin.length + 1);

    report.problem(
      `${plugin}.routes.${name}.parent`,
      `forms a cycle: ${cycle.through.join(" → ")}`,
    );
  }
}

/**
 * Checks one route's path, condition and parameters.
 *
 * @param declaration - The declared route.
 * @param report - The report the faults go into.
 */
function checkPath(declaration: RouteDeclaration, report: Report): void {
  const { navigation, path, sample, when } = declaration.reference;
  const at = pathOf(declaration);
  const parameters = path.includes("$");

  if (COLON.test(path)) report.problem(`${at}.path`, "uses :name, and the router reads $name");

  refuseRoutes(when, `${at}.when`, report);

  if (parameters && navigation !== undefined) {
    report.problem(`${at}.navigation`, "is refused on a path with parameters");
  }

  if (parameters && sample === undefined) {
    report.problem(`${at}.sample`, "is required on a path with parameters");
  }
}

/**
 * Checks the plugins of the route's parent and of its menu are installed.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param declaration - The declared route.
 * @param report - The report the faults go into.
 */
function checkLinks(context: ResolveContext, declaration: RouteDeclaration, report: Report): void {
  const { navigation, parent } = declaration.reference;
  const at = pathOf(declaration);

  if (parent !== undefined && !isInstalled(context, pluginOf(parent.id))) {
    report.problem(`${at}.parent`, `names the route ${parent.id}, whose plugin is not installed`);
  }

  if (navigation?.menu !== undefined && !isInstalled(context, pluginOf(navigation.menu.id))) {
    report.warning(
      `${at}.navigation.menu`,
      `names the menu ${navigation.menu.id}, whose plugin is not installed`,
    );
  }
}

/**
 * Returns the plugins whose chunks load with a route: those with an extension placed in a slot the
 * route's plugin declares, or targeting the route itself.
 *
 * @param declaration - The declared route.
 * @param placed - Every extension and slot.
 */
function loadsOf(declaration: RouteDeclaration, placed: Placed): readonly string[] {
  const { id } = declaration.reference;
  const plugins = new Set([
    ...Object.values(placed.slots)
      .filter((slot) => slot.plugin === declaration.plugin)
      .flatMap((slot) => slot.extensions.map((one) => pluginOf(one))),
    ...placed.extensions
      .filter((one) => !one.disabled && one.target === `route:${id}`)
      .map((one) => one.plugin),
  ]);

  plugins.delete(declaration.plugin);

  return [...plugins];
}

/**
 * Resolves one route, with the product's condition joined into its own.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param declaration - The declared route.
 * @param placed - Every extension and slot.
 */
function resolveRoute(
  context: ResolveContext,
  declaration: RouteDeclaration,
  placed: Placed,
): ResolvedRoute {
  const { data = [], id, navigation, parent, path, sample, when } = declaration.reference;
  const { signIn, when: product } = context.definition;

  return {
    data: data.map((one) => ({ query: one.query.id, variables: one.variables ?? [] })),
    id,
    loads: loadsOf(declaration, placed),
    navigation:
      navigation === undefined
        ? undefined
        : {
            label: navigation.label,
            menu: (navigation.menu ?? hostContract.menus.main).id,
            order: navigation.order,
          },
    parent: parent?.id,
    path,
    plugin: declaration.plugin,
    sample,
    when: id === signIn?.id ? when : joined(product, when),
  };
}

/**
 * Checks every route and the product's condition.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param report - The report the faults go into.
 */
export function checkRoutes(context: ResolveContext, report: Report): void {
  refuseRoutes(context.definition.when, "product.when", report);
  checkConflicts(context, report);
  checkCycles(context, report);

  for (const declaration of declarationsOf(context, "route")) {
    checkPath(declaration, report);
    checkLinks(context, declaration, report);
  }
}

/**
 * Resolves every route, the host's included.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param placed - Every extension and slot, which decide the plugins whose chunks load with a
 *   route.
 * @returns Every route, the host's first.
 */
export function resolveRoutes(context: ResolveContext, placed: Placed): readonly ResolvedRoute[] {
  return declarationsOf(context, "route").map((declaration) =>
    resolveRoute(context, declaration, placed),
  );
}
