/**
 * Checks every flag's kind, type, date and variants and the values the product sets, and resolves
 * every flag with one kill switch per installed plugin.
 *
 * @remarks
 *   A kill switch is an ops flag of the host, `host/plugin.<plugin id>`, on by default, whose
 *   description is the host's `flags.killSwitch`. A product may set a kill switch's value like any
 *   other flag's.
 */

import { HOST } from "#identifiers.ts";
import { type Declaration, pathOf, type ResolveContext } from "#resolve/context.ts";
import { declarationsOf, type Declared } from "#resolve/declared.ts";
import { killSwitchOf } from "#resolve/plugins.ts";
import { type Report } from "#resolve/problem.ts";
import { type ResolvedFlag } from "#resolve/resolved.ts";

/**
 * Describes a declared flag.
 */
type FlagDeclaration = Declaration<Declared<"featureFlag">>;

/**
 * Returns the current day in the form `2026-12-31`, in UTC.
 */
function todayOf(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * The word a message uses for each kind of flag.
 */
const KINDS = { experiment: "an experiment", ops: "an ops flag", release: "a release flag" };

/**
 * Checks a flag's type against its kind, and its default against its type.
 *
 * @param declaration - The declared flag.
 * @param report - The report the faults go into.
 */
function checkType(declaration: FlagDeclaration, report: Report): void {
  const { default: fallback, flagKind, type } = declaration.reference;
  const typed = flagKind === "experiment" ? "string" : "boolean";
  const at = pathOf(declaration);

  if (type !== typed)
    report.problem(`${at}.type`, `is ${type}, and ${KINDS[flagKind]} is ${typed}`);

  if (typeof fallback !== type)
    report.problem(`${at}.default`, `is not of the flag's type, ${type}`);
}

/**
 * Checks a flag's date: stated on a release flag and an experiment, and not past.
 *
 * @param declaration - The declared flag.
 * @param today - The day the build runs.
 * @param report - The report the faults go into.
 */
function checkDate(declaration: FlagDeclaration, today: string, report: Report): void {
  const { expires, flagKind } = declaration.reference;
  const at = `${pathOf(declaration)}.expires`;

  if (expires === undefined && flagKind !== "ops") {
    report.problem(at, `is required on ${KINDS[flagKind]}`);
  } else if (expires !== undefined && expires < today) {
    report.warning(at, `is ${expires}, and the flag is past it`);
  }
}

/**
 * Checks an experiment's variants: two or more, the default among them.
 *
 * @param declaration - The declared experiment.
 * @param report - The report the faults go into.
 */
function checkVariants(declaration: FlagDeclaration, report: Report): void {
  const { default: fallback, variants = [] } = declaration.reference;
  const at = pathOf(declaration);

  if (variants.length < 2) report.problem(`${at}.variants`, "lists fewer than two variants");
  else if (!variants.includes(fallback))
    report.problem(`${at}.default`, "is not one of the variants");
}

/**
 * Checks the values the product sets: each for a declared flag, and one the flag takes.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param flags - Every flag, the kill switches included, by qualified id.
 * @param report - The report the faults go into.
 */
function checkProduct(
  context: ResolveContext,
  flags: ReadonlyMap<string, ResolvedFlag>,
  report: Report,
): void {
  for (const [index, { flag, value }] of (context.definition.featureFlags ?? []).entries()) {
    const at = `product.featureFlags.${String(index)}`;
    const declared = flags.get(flag);
    const takes =
      declared?.type === "string"
        ? (declared.variants ?? []).includes(String(value)) && typeof value === "string"
        : typeof value === "boolean";

    if (declared === undefined) {
      report.problem(`${at}.flag`, `names the flag ${flag}, which no installed plugin declares`);
    } else if (!takes) {
      report.problem(`${at}.value`, `is ${JSON.stringify(value)}, which ${flag} does not take`);
    }
  }
}

/**
 * Checks every flag and the product's values, and resolves every flag, a kill switch per installed
 * plugin included.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param report - The report the faults go into.
 * @returns Every flag the contracts declare, the host's kill switches after them.
 */
export function resolveFlags(context: ResolveContext, report: Report): readonly ResolvedFlag[] {
  const today = context.options.today ?? todayOf();
  const values = new Map(
    (context.definition.featureFlags ?? []).map(({ flag, value }) => [flag, value]),
  );
  const declared = declarationsOf(context, "featureFlag");

  for (const declaration of declared) {
    checkType(declaration, report);
    checkDate(declaration, today, report);

    if (declaration.reference.flagKind === "experiment") checkVariants(declaration, report);
  }

  const flags: readonly ResolvedFlag[] = [
    ...declared.map(({ plugin, reference }) => ({
      default: reference.default,
      deprecated: reference.deprecated,
      description: reference.description,
      expires: reference.expires,
      id: reference.id,
      kind: reference.flagKind,
      plugin,
      product: values.get(reference.id),
      type: reference.type,
      variants: reference.variants?.map(String),
    })),
    ...[...context.installed.keys()].map((pluginId) => ({
      default: true,
      description: "flags.killSwitch",
      id: killSwitchOf(pluginId),
      kind: "ops" as const,
      plugin: HOST,
      product: values.get(killSwitchOf(pluginId)),
      type: "boolean" as const,
    })),
  ];

  checkProduct(context, new Map(flags.map((flag) => [flag.id, flag])), report);

  return flags;
}
