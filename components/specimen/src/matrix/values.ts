/**
 * Reads the values an axis of a recipe offers, so a specimen turns every one of them and misses
 * none when a theme adds one.
 */

/**
 * Describes what a recipe states about its axes: each one keyed by name, holding its values keyed
 * by name.
 *
 * @typeParam Axes - The axes, as the recipe's own type states them.
 */
interface Axed<Axes> {
  /**
   * The axes the recipe offers.
   */
  readonly variants?: Axes | undefined;
}

/**
 * Selects the values one axis offers, as the recipe's type names them.
 *
 * @typeParam Axes - The axes of the recipe.
 * @typeParam Axis - The axis read.
 */
export type ValueOf<Axes, Axis extends keyof Axes> = Extract<keyof Axes[Axis], string>;

/**
 * Returns the values one axis of a recipe offers, in the order the recipe states them.
 *
 * @remarks
 *   Read off the recipe rather than written out, so a page draws every value the theme can move
 *   and a value added later reaches the page without the specimen changing. The values come back
 *   typed as the recipe's own literals, which is what the component's prop takes. A boolean axis
 *   is keyed `true`, which the prop takes as a boolean rather than a word, so a specimen turning
 *   one writes `[false, true]` itself.
 * @param recipe - The recipe, as `defineRecipe` or `defineSlotRecipe` returned it.
 * @param axis - The axis to read.
 * @returns The values, in the recipe's own order.
 */
export function valuesOf<Axes extends object, Axis extends keyof Axes & string>(
  recipe: Axed<Axes>,
  axis: Axis,
): ReadonlyArray<ValueOf<Axes, Axis>> {
  const offered: unknown = recipe.variants?.[axis];

  if (typeof offered !== "object" || offered === null) return [];

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the keys of an axis are the values its type names
  return Object.keys(offered) as Array<ValueOf<Axes, Axis>>;
}
