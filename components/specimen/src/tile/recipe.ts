/**
 * States what a tile is: a block that stands in for content, so a specimen of a layout has
 * something to arrange.
 *
 * @remarks
 *   A stack, a grid or a group draws nothing of its own, and a page of them holding bare words
 *   shows the gaps but not the boxes the gaps sit between. A tile is one box: the neutral palette
 *   on the quiet surface with its edge, rounded at the first level, an inset either way, and the
 *   word in the middle, so what a layout does to it can be read off the page.
 */

import { defineRecipe, dense } from "@stealthscale/theme/authoring";

/**
 * Draws a tile.
 */
export const recipe = defineRecipe({
  base: {
    borderRadius: "l1",
    colorPalette: "neutral",
    layerStyle: "flat.surface",
    paddingBlock: dense("{spacing.gap.sm}"),
    paddingInline: dense("{spacing.gap.md}"),
    textAlign: "center",
  },
  className: "tile",
  jsx: [/^Tile$/u],
});
