/**
 * Checks a recipe for the classes the runtime writes that no rule reaches: a value or a compound
 * that declares no styles, a default naming a value no axis offers, a compound matched on such a
 * value, and a tag pattern that misses the component's name.
 *
 * @remarks
 *   The runtime writes a class for every value it is passed, and the compiler emits a rule only
 *   for a value that declares styles, so each of these leaves a class on the page with no rule
 *   behind it. The pattern check runs the other way: a tag the patterns miss leaves the
 *   component's variants out of an application's sheet.
 */

import { type Declared } from "#recipe.ts";

/**
 * Keys of a compound that select nothing, so a match check skips them.
 */
const UNMATCHED = new Set(["className", "classNames", "css", "name"]);

/**
 * Reports whether a value is a plain object, which an axis's values and a compound both are.
 */
function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Returns each axis of a recipe with the values it offers and the styles declared under each.
 */
function axesOf(
  recipe: Declared,
): ReadonlyArray<readonly [axis: string, values: Readonly<Record<string, unknown>>]> {
  return Object.entries(recipe.variants ?? {}).map(([axis, values]) => [
    axis,
    isRecord(values) ? values : {},
  ]);
}

/**
 * Reports whether a style object declares nothing, in which case the compiler emits no rule.
 */
function isEmpty(styles: unknown): boolean {
  return !isRecord(styles) || Object.keys(styles).length === 0;
}

/**
 * Reports whether a slot recipe's value, base or compound declares styles on one named slot.
 */
export function slotStyled(slotted: unknown, slot: string): boolean {
  return isRecord(slotted) && !isEmpty(slotted[slot]);
}

/**
 * Reports whether styles reach the element a recipe styles, or any slot of a slot recipe.
 */
function reaches(recipe: Declared, styles: unknown): boolean {
  return recipe.slots === undefined
    ? !isEmpty(styles)
    : recipe.slots.some((slot) => slotStyled(styles, slot));
}

/**
 * Reports every value and compound that declares no styles, so the compiler emits no rule while
 * the runtime still writes the class.
 *
 * @remarks
 *   For a slot recipe a value counts as styled where any slot under it declares styles. A base
 *   that declares nothing is not reported: the recipe's class and each slot's class are written
 *   either way, and a theme extends the base through them.
 */
export function emptyViolations(recipe: Declared): readonly string[] {
  const values = axesOf(recipe).flatMap(([axis, offered]) =>
    Object.entries(offered)
      .filter(([, styles]) => !reaches(recipe, styles))
      .map(
        ([value]) =>
          `${recipe.className} offers ${axis} ${value} with no styles, so its class has no rule`,
      ),
  );
  const compounds = (recipe.compoundVariants ?? []).flatMap((compound, index) =>
    isRecord(compound) && !reaches(recipe, compound["css"])
      ? [`${recipe.className} declares compound ${String(index + 1)} with no styles`]
      : [],
  );

  return [...values, ...compounds];
}

/**
 * Reports every default set on an axis the recipe does not offer, or to a value that axis does not
 * offer.
 */
export function defaultViolations(recipe: Declared): readonly string[] {
  if (!isRecord(recipe.defaultVariants)) return [];

  const axes = new Map(axesOf(recipe));

  return Object.entries(recipe.defaultVariants).flatMap(([axis, value]) => {
    const values = axes.get(axis);
    const written = String(value);

    if (values === undefined) {
      return [`${recipe.className} defaults ${axis} to ${written}, and offers no such axis`];
    }

    return Object.hasOwn(values, written)
      ? []
      : [`${recipe.className} defaults ${axis} to ${written}, which the axis does not offer`];
  });
}

/**
 * Reports every compound matched on an axis the recipe does not offer, or on a value the axis
 * does not offer.
 */
export function selectionViolations(recipe: Declared): readonly string[] {
  const axes = new Map(axesOf(recipe));

  return (recipe.compoundVariants ?? []).flatMap((compound, index) => {
    if (!isRecord(compound)) return [];

    const ordinal = `compound ${String(index + 1)}`;

    return Object.entries(compound)
      .filter(([axis]) => !UNMATCHED.has(axis))
      .flatMap(([axis, selected]) => {
        const values = axes.get(axis);

        if (values === undefined) {
          return [
            `${recipe.className} matches ${ordinal} on ${axis}, which the recipe does not offer`,
          ];
        }

        const chosen: readonly unknown[] = Array.isArray(selected) ? selected : [selected];

        return chosen
          .filter((value) => !Object.hasOwn(values, String(value)))
          .map(
            (value) =>
              `${recipe.className} matches ${ordinal} on ${axis} ${String(value)}, which the axis does not offer`,
          );
      });
  });
}

/**
 * Reports whether a tag pattern matches a name a consumer writes.
 */
function tracks(pattern: RegExp | string, name: string): boolean {
  return typeof pattern === "string" ? pattern === name : pattern.test(name);
}

/**
 * Axis whose values an application reads from its data instead of writing at the call site.
 */
const MEASURED = "status";

/**
 * Reports whether a `staticCss` entry emits the values of an axis.
 *
 * @remarks
 *   The compiler acts on two forms: `*` for a whole recipe and a list of values for one axis.
 *   `true` is not one of them, although the compiler's types accept it for an axis, so a recipe
 *   written that way type-checks and emits nothing. Listing the values keeps the two in step, and
 *   a list built from the vocabulary's array cannot go stale.
 */
function emits(entry: unknown, axis: string): boolean {
  return entry === "*" || (isRecord(entry) && Array.isArray(entry[axis]));
}

/**
 * Reports a recipe that offers a status without listing it under `staticCss`.
 *
 * @remarks
 *   The compiler emits a rule for a value it reads from a literal in an application's source. A
 *   status is the one axis an application usually does not write: it passes what a record, a
 *   validator or a server returned, and the compiler sees a name it cannot follow. The class lands
 *   on the element with no rule behind it, and the component renders in its default palette while
 *   reporting an error. Listing the axis under `staticCss` emits every value whether an
 *   application writes one or not, measured at 0.19 kB over the wire for a four-value status.
 */
export function emittedViolations(recipe: Declared): readonly string[] {
  if (!isRecord(recipe.variants) || !Object.hasOwn(recipe.variants, MEASURED)) return [];

  return (recipe.staticCss ?? []).some((entry) => emits(entry, MEASURED))
    ? []
    : [`${recipe.className} offers ${MEASURED}, which staticCss does not emit`];
}

/**
 * Reports every name the recipe's tag patterns miss, and every pattern that matches no name.
 *
 * @remarks
 *   The compiler extracts a component's variants from the tags its patterns match, so a pattern
 *   that misses the name a consumer writes leaves that component's variants out of the sheet in
 *   an application that does not write every variant statically.
 */
export function jsxViolations(recipe: Declared, names: readonly string[]): readonly string[] {
  const patterns = recipe.jsx;

  if (patterns === undefined) {
    return names.length === 0 ? [] : [`${recipe.className} states no jsx patterns`];
  }

  const missed = names
    .filter((name) => !patterns.some((pattern) => tracks(pattern, name)))
    .map((name) => `${recipe.className} tracks no tag named ${name}`);
  const idle = patterns
    .filter((pattern) => !names.some((name) => tracks(pattern, name)))
    .map(
      (pattern) => `${recipe.className} tracks ${String(pattern)}, which matches no published name`,
    );

  return [...missed, ...idle];
}
