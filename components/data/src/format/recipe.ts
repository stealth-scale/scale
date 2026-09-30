/**
 * Recipe for a formatted figure: a number or a size written the way a locale writes it.
 *
 * @remarks
 *   Numerals are tabular, so a column of figures lines up and a figure that updates in place keeps
 *   its width. A figure does not wrap, so a currency symbol or a unit stays on the line of its
 *   number. The recipe has no axis: a figure takes its size and ink from the text around it.
 */

import { defineRecipe } from "@stealthscale/theme/authoring";

/**
 * Class name of the recipe.
 */
export const CLASS = "format";

/**
 * Defines the format recipe.
 */
export const recipe = defineRecipe({
  base: { fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" },
  className: CLASS,
  jsx: [/^Format\.\w+$/u],
});
