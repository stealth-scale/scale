/**
 * Computes the class names a recipe emits, so a specification derives a name instead of repeating
 * a literal.
 *
 * @remarks
 *   The names follow the scheme the build plugin renames the compiler's output into: the class
 *   name alone for the base rules, `<class>--<value>` for a string variant, `<class>--<axis>` for a
 *   boolean axis at `true`, and an empty string at `false`. A slot recipe emits `<class>__<slot>`
 *   per slot, and a slot's variant classes extend that slot class. A unit test runs without the
 *   compiled stylesheet, so a check can assert only that the class the recipe emits reaches the
 *   element.
 */

import { compoundClass, slotClass, variantClass } from "@stealthscale/pandacss-naming";

export { compoundClass, slotClass, variantClass };

/**
 * Returns the class a recipe emits its base rules under, which is the recipe's class name
 * unchanged.
 */
export function recipeClass(className: string): string {
  return className;
}

/**
 * Returns the class a slot recipe emits for one axis value on one slot, which extends that slot's
 * own class.
 */
export function slotVariantClass(
  className: string,
  slot: string,
  axis: string,
  value: boolean | number | string,
): string {
  return variantClass(slotClass(className, slot), axis, value);
}
