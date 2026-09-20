/**
 * Reads the values an axis of a recipe offers, so a specimen turns every one of them and misses
 * none when a theme adds one.
 */

import { SCALE } from "@stealthscale/theme/authoring";

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
 * The axis whose values are steps of the scale.
 */
const SIZE = "size";

/**
 * The steps of the scale in order, read as words so a value of any axis can be looked up.
 */
const STEPS: readonly string[] = SCALE;

/**
 * Orders the values of the size axis by the scale, keeping any value the scale does not name after
 * the steps in the order the recipe states.
 */
function scaled<Value extends string>(values: readonly Value[]): Value[] {
  const steps = values.filter((value) => STEPS.includes(value));
  const others = values.filter((value) => !STEPS.includes(value));

  steps.sort((first, second) => STEPS.indexOf(first) - STEPS.indexOf(second));

  return steps.concat(others);
}

/**
 * Returns the values one axis of a recipe offers, in the order the recipe states them, except the
 * steps of the size axis, which come in the order of the scale.
 *
 * @remarks
 *   Read off the recipe rather than written out, so a page draws every value the theme can move
 *   and a value added later reaches the page without the specimen changing. The values come back
 *   typed as the recipe's own literals, which is what the component's prop takes. A boolean axis
 *   is keyed `true`, which the prop takes as a boolean rather than a word, so a specimen turning
 *   one writes `[false, true]` itself.
 *   The size axis is the one axis whose order a recipe cannot state: the lint sorts the keys of
 *   an object written by hand, so a recipe writing its own steps offers `lg, md, sm, xl, xs`, and
 *   a page drawing them in that order read as a scale out of order. The steps are put in the
 *   scale's order here, and a value the scale does not name, such as a width, keeps its place
 *   after them.
 * @param recipe - The recipe, as `defineRecipe` or `defineSlotRecipe` returned it.
 * @param axis - The axis to read.
 * @returns The values, in the recipe's own order, or the scale's for the size axis.
 */
export function valuesOf<Axes extends object, Axis extends keyof Axes & string>(
  recipe: Axed<Axes>,
  axis: Axis,
): ReadonlyArray<ValueOf<Axes, Axis>> {
  const offered: unknown = recipe.variants?.[axis];

  if (typeof offered !== "object" || offered === null) return [];

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the keys of an axis are the values its type names
  const values = Object.keys(offered) as Array<ValueOf<Axes, Axis>>;

  return axis === SIZE ? scaled(values) : values;
}
