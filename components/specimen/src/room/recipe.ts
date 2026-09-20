/**
 * States what a room is: a box held to one of the page's measures, so a specimen can show what a
 * component does when it runs out of width.
 *
 * @remarks
 *   A row that wraps, a heading that is cut short and a field whose label sits beside it all read
 *   the same as their plain forms until the width runs out, and a cell of the catalogue is as wide
 *   as the page. A room is that width taken away: a block the full width of its cell, held to a
 *   measure, with nothing drawn of its own. The measures are the page's, so a theme that moves
 *   them moves every room.
 */

import { defineRecipe, widthSizes } from "@stealthscale/theme/authoring";

/**
 * Draws a room at the small measure until a caller says otherwise.
 */
export const recipe = defineRecipe({
  base: { inlineSize: "full" },
  className: "room",
  defaultVariants: { size: "sm" },
  jsx: [/^Room$/u],
  variants: { size: widthSizes() },
});
