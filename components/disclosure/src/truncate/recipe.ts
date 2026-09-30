/**
 * Recipe for text clipped to a number of lines, with an ellipsis where it is cut.
 *
 * @remarks
 *   The clamp is the `lineClamp` utility at `--truncate-lines`, which the component writes from
 *   `lines`. `minInlineSize: 0` lets a flex row shrink the text below its content, so the text
 *   clips in place of pushing its siblings out. `overflowWrap: anywhere` breaks a word longer than
 *   the line, so a long address clips with an ellipsis as well. The focus ring of clipped text with
 *   a tab stop is outside its box.
 */

import { defineRecipe } from "@stealthscale/theme/authoring";

/**
 * Class name of the recipe.
 */
export const CLASS = "truncate";

/**
 * Defines the truncate recipe.
 */
export const recipe = defineRecipe({
  base: {
    focusVisibleRing: "outside",
    lineClamp: "var(--truncate-lines, 1)",
    minInlineSize: "0",
    overflowWrap: "anywhere",
  },
  className: CLASS,
  jsx: ["Truncate"],
});
