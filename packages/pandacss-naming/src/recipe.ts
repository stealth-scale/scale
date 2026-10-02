/**
 * Builds the class names a recipe applies for a slot, a variant and a compound.
 *
 * @remarks
 *   The compiler writes a variant class as the recipe class, two hyphens, the axis, the separator
 *   and then the value. This scheme drops the axis for a string value, keeps the axis alone for
 *   `true`, and emits nothing for `false`: an element carries `button--lg` and `button--loading`,
 *   and a state that is off leaves no class behind. Dropping the axis is only unambiguous because
 *   the gate already rejects a recipe whose values repeat across axes, or whose compound name
 *   collides with an axis or a value. This module assumes both hold.
 */

import { kebab, sanitise } from "#sanitise.ts";

/**
 * The parts of a recipe the naming scheme reads.
 */
export interface Recipe {
  /**
   * The axes the recipe declares its variants under.
   */
  axes: readonly string[];
  /**
   * The class the recipe's base rules are written under.
   */
  className: string;
  /**
   * The slots of a slot recipe, each written as `<class>__<slot>`.
   */
  slots?: readonly string[] | undefined;
}

/**
 * The separators the compiler accepts between an axis and its value.
 */
export type Separator = "_" | "-" | "=";

/**
 * The parts of the compiler's config the scheme needs to recognise a compiled class.
 */
export interface CompilerConfig {
  /**
   * Every recipe the stylesheet was compiled with, slot recipes included.
   */
  recipes: readonly Recipe[];
  /**
   * The separator the compiler was configured with.
   */
  separator: Separator;
}

/**
 * Writes the class a variant is applied under, or nothing for a boolean axis at `false`.
 *
 * @remarks
 *   The value arrives as a real boolean from a recipe function and as the string `true` or `false`
 *   from a stylesheet, so both spellings are handled.
 * @returns `<class>--<value>` for a string or a number, `<class>--<axis>` for `true`, and an empty
 *   string for `false`.
 */
export function variantClass(
  className: string,
  axis: string,
  value: boolean | number | string,
): string {
  const written = String(value);

  if (written === "true") return `${className}--${sanitise(kebab(axis))}`;
  if (written === "false") return "";

  return `${className}--${sanitise(kebab(written))}`;
}

/**
 * Writes the class a slot recipe applies to one of its slots.
 */
export function slotClass(className: string, slot: string): string {
  return `${className}__${kebab(slot)}`;
}

/**
 * Writes the class a compound is applied under, from the name the recipe gave it.
 */
export function compoundClass(className: string, name: string): string {
  return `${className}--${sanitise(kebab(name))}`;
}
