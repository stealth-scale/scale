/**
 * Checks every extension and the product's placements, and resolves each extension with its target
 * key and each slot with the extensions placed in it, in order.
 *
 * @remarks
 *   A slot lists the extensions whose own target it is, takes out the ones the product removes,
 *   puts in the ones the product adds, and leaves out the ones the product disables everywhere. It
 *   sorts them by the product's order, then by each extension's own rank, then in install order.
 *   The product adds to regions alone: host slots a frame renders without props, so an extension
 *   moves between regions without a props mismatch.
 */

import { WORDS } from "#assemble.ts";
import { hostContract } from "#host.ts";
import { pluginOf } from "#identifiers.ts";
import { type Reference } from "#reference.ts";
import { type Declaration, isInstalled, pathOf, type ResolveContext } from "#resolve/context.ts";
import { declarationOf, declarationsOf, type Declared } from "#resolve/declared.ts";
import { type Report } from "#resolve/problem.ts";
import { type ResolvedExtension, type ResolvedSlot } from "#resolve/resolved.ts";
import { isEvery, targetKeyOf } from "#slot.ts";

/**
 * Describes a declared extension.
 */
type ExtensionDeclaration = Declaration<Declared<"extension">>;

/**
 * Qualified ids of the host's regions: the slots a frame renders without props.
 */
const REGIONS = new Set<string>(
  [
    hostContract.slots.aside,
    hostContract.slots.brand,
    hostContract.slots.footer,
    hostContract.slots.header,
    hostContract.slots.navigation,
    hostContract.slots.status,
    hostContract.slots.toolbar,
    hostContract.slots.userMenu,
  ].map((slot) => slot.id),
);

/**
 * Reports a name the product states whose plugin is not installed.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param reference - The name.
 * @param path - Its dotted path.
 * @param report - The report the faults go into.
 */
function refuseUninstalled(
  context: ResolveContext,
  reference: Reference,
  path: string,
  report: Report,
): void {
  if (!isInstalled(context, pluginOf(reference.id))) {
    report.problem(
      path,
      `names the ${WORDS[reference.kind]} ${reference.id}, whose plugin is not installed`,
    );
  }
}

/**
 * Checks an extension's `match` against the keyed slot it targets, or against a target that is not
 * a slot.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param declaration - The declared extension, whose target is a reference.
 * @param target - The slot, route or extension the extension attaches to.
 * @param report - The report the faults go into.
 */
function checkMatch(
  context: ResolveContext,
  declaration: ExtensionDeclaration,
  target: Reference,
  report: Report,
): void {
  const { match } = declaration.reference;
  const slot = declarationOf(context, "slot", target.id);
  const keyed = slot?.reference.keyed === true;
  const at = `${pathOf(declaration)}.match`;

  if (target.kind !== "slot") {
    if (match !== undefined) report.problem(at, "is refused on a target that is not a slot");
  } else if (slot !== undefined && keyed && match === undefined) {
    report.problem(at, `is required on the keyed slot ${target.id}`);
  } else if (slot !== undefined && !keyed && match !== undefined) {
    report.problem(at, `is refused on the slot ${target.id}, which is not keyed`);
  }
}

/**
 * Checks an extension's target: its position on every member of a kind, its plugin, and its
 * `match`.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param declaration - The declared extension.
 * @param report - The report the faults go into.
 */
function checkTarget(
  context: ResolveContext,
  declaration: ExtensionDeclaration,
  report: Report,
): void {
  const { match, position, required, target } = declaration.reference;
  const at = pathOf(declaration);

  if (isEvery(target)) {
    if (position !== "wrap") {
      report.problem(
        `${at}.position`,
        `is ${position}, and every ${target.every} takes wrap alone`,
      );
    }

    if (match !== undefined)
      report.problem(`${at}.match`, "is refused on a target that is not a slot");
  } else if (isInstalled(context, pluginOf(target.id))) {
    checkMatch(context, declaration, target, report);
  } else {
    const reason = `names the ${WORDS[target.kind]} ${target.id}, whose plugin is not installed`;

    if (required === true) report.problem(`${at}.target`, `${reason}, and it is required`);
    else report.warning(`${at}.target`, reason);
  }
}

/**
 * Checks the names the product's placements and its disabled extensions state, and refuses an
 * extension the product adds to a slot that is not a region.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param report - The report the faults go into.
 */
function checkPlacements(context: ResolveContext, report: Report): void {
  const { extensions, slots = [] } = context.definition;

  for (const [index, filled] of slots.entries()) {
    const at = `product.slots.${String(index)}`;
    const named = (["add", "order", "remove"] as const).flatMap((member) =>
      (filled[member] ?? []).map(
        (one, place) => [one, `${at}.${member}.${String(place)}`] as const,
      ),
    );

    refuseUninstalled(context, filled.slot, `${at}.slot`, report);

    for (const [one, path] of named) refuseUninstalled(context, one, path, report);

    if ((filled.add ?? []).length > 0 && !REGIONS.has(filled.slot.id)) {
      report.problem(`${at}.add`, `adds to the slot ${filled.slot.id}, which is not a region`);
    }
  }

  for (const [index, one] of (extensions?.disabled ?? []).entries()) {
    refuseUninstalled(context, one, `product.extensions.disabled.${String(index)}`, report);
  }
}

/**
 * Resolves one extension.
 *
 * @param declaration - The declared extension.
 * @param disabled - Qualified ids of the extensions the product disables everywhere.
 */
function resolveExtension(
  declaration: ExtensionDeclaration,
  disabled: ReadonlySet<string>,
): ResolvedExtension {
  const { id, match, order, position, required, target, when } = declaration.reference;

  return {
    disabled: disabled.has(id),
    fallback: declaration.code.extensions?.[declaration.name]?.fallback !== undefined,
    id,
    match,
    order,
    plugin: declaration.plugin,
    position,
    required,
    target: targetKeyOf(target),
    when,
  };
}

/**
 * Returns the extensions placed in a slot, in order.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param id - Qualified id of the slot.
 * @param extensions - Every extension, in install order.
 */
function placedIn(
  context: ResolveContext,
  id: string,
  extensions: readonly ResolvedExtension[],
): readonly ResolvedExtension[] {
  const stated = (context.definition.slots ?? []).filter((one) => one.slot.id === id);

  /**
   * Lists the extensions the product's placements of the slot state under one member.
   *
   * @param member - `add`, `order` or `remove`.
   */
  const idsOf = (member: "add" | "order" | "remove"): readonly string[] =>
    stated.flatMap((one) => (one[member] ?? []).map((extension) => extension.id));
  const [added, listed, removed] = [idsOf("add"), idsOf("order"), idsOf("remove")];

  /**
   * Ranks an extension by its place in the product's order, after every listed one where absent.
   *
   * @param extension - An extension placed in the slot.
   */
  const rank = (extension: ResolvedExtension): number =>
    listed.includes(extension.id) ? listed.indexOf(extension.id) : listed.length;

  return extensions
    .filter(
      (one) =>
        !one.disabled &&
        (added.includes(one.id) || (one.target === `slot:${id}` && !removed.includes(one.id))),
    )
    .toSorted(
      (one, other) =>
        rank(one) - rank(other) ||
        (one.order ?? Number.MAX_SAFE_INTEGER) - (other.order ?? Number.MAX_SAFE_INTEGER),
    );
}

/**
 * Warns where a slot of arity one has more than one extension placed in it, per value where it is
 * keyed.
 *
 * @param path - The slot's dotted path.
 * @param keyed - True where the slot is keyed.
 * @param placed - The extensions placed in the slot, in order.
 * @param report - The report the faults go into.
 */
function checkArity(
  path: string,
  keyed: boolean,
  placed: readonly ResolvedExtension[],
  report: Report,
): void {
  const values = new Map<string, string[]>();

  for (const one of placed) {
    const value = keyed ? String(one.match) : "";

    values.set(value, [...(values.get(value) ?? []), one.id]);
  }

  for (const [value, ids] of values) {
    const scope = keyed ? ` for ${value}` : "";

    if (ids.length > 1) {
      report.warning(
        path,
        `renders one extension${scope}, and ${String(ids.length)} are placed: ${ids.join(", ")}`,
      );
    }
  }
}

/**
 * Describes the extensions and the slots the build resolved.
 */
export interface Placed {
  /**
   * Every extension, in install order.
   */
  readonly extensions: readonly ResolvedExtension[];

  /**
   * Every slot, the host's included, by qualified id.
   */
  readonly slots: Readonly<Record<string, ResolvedSlot>>;
}

/**
 * Checks every extension and the product's placements, and resolves every extension and slot.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param report - The report the faults go into.
 */
export function resolveSlots(context: ResolveContext, report: Report): Placed {
  const disabled = new Set((context.definition.extensions?.disabled ?? []).map((one) => one.id));
  const declared = declarationsOf(context, "extension");
  const extensions = declared.map((declaration) => resolveExtension(declaration, disabled));
  const slots: Record<string, ResolvedSlot> = {};

  for (const declaration of declared) checkTarget(context, declaration, report);

  checkPlacements(context, report);

  for (const declaration of declarationsOf(context, "slot")) {
    const { arity, id, keyed, record } = declaration.reference;
    const placed = placedIn(context, id, extensions);

    if (arity === "one") checkArity(pathOf(declaration), keyed === true, placed, report);

    slots[id] = {
      arity,
      extensions: placed.map((one) => one.id),
      id,
      keyed,
      plugin: declaration.plugin,
      record: record?.id,
      region: REGIONS.has(id),
    };
  }

  return { extensions, slots };
}
