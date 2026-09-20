/**
 * Reads the width a stage is held to off the width the viewport states.
 */

import { type Size } from "@stealthscale/provider-viewport";

import { valuesOf } from "#matrix/values.ts";
import { recipe } from "#stage/recipe.ts";

/**
 * Selects one of the widths a stage can be held to.
 */
export type StageWidth = keyof NonNullable<typeof recipe.variants>["width"];

/**
 * The widths the stage's axis names, read off the recipe once.
 */
const WIDTHS: readonly string[] = valuesOf(recipe, "width");

/**
 * A phone, which no breakpoint names: the smallest measure, at the engine's root size.
 *
 * @remarks
 *   The theme's first breakpoint starts at 640 pixels and everything under it is one range, so a
 *   phone has to be stated. It is listed here so the switcher that offers it and the stage that
 *   holds a scene to it agree on the pixels.
 */
export const PHONE: Size = { min: 320, name: "phone" };

/**
 * Lists every width a scene can be shown at, narrowest first: the phone, then the theme's.
 *
 * @param sizes - The theme's breakpoints, as the viewport lists them.
 * @returns The phone, then each breakpoint's size.
 */
export function widthsOf(sizes: readonly Size[]): readonly Size[] {
  return [PHONE, ...sizes];
}

/**
 * Reports whether a name is one of the widths a stage can be held to.
 */
function isStageWidth(name: string): name is StageWidth {
  return WIDTHS.includes(name);
}

/**
 * Returns the width a stage is held to for the width the viewport states, or nothing where the
 * window decides or where no size the stage knows starts at that width.
 *
 * @param width - The width in force, in pixels, or nothing for the window.
 * @param sizes - The theme's breakpoints, as the viewport lists them.
 * @returns The width's name on the stage's axis, or undefined.
 */
export function stageWidthOf(
  width: number | undefined,
  sizes: readonly Size[],
): StageWidth | undefined {
  const name = widthsOf(sizes).find((size) => size.min === width)?.name;

  return name !== undefined && isStageWidth(name) ? name : undefined;
}
