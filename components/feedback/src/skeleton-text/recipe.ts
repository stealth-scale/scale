/**
 * States what a paragraph of skeleton is: a column of bars standing in for lines of text that have
 * not arrived.
 *
 * @remarks
 *   Every length here is read off the line the bars stand in for. A bar is one line tall and the
 *   space between two is half a line, so a column of stand-ins occupies what the real paragraph
 *   will occupy and the page does not jump when the words land. Nothing states a size of its own,
 *   which is what lets a caller drop a paragraph of stand-ins wherever text is read and have it
 *   come out the size of that text.
 *   The last bar of several is short. A paragraph rarely fills its final line, and a block of bars
 *   all the same width reads as a table rather than as prose.
 */

import { defineRecipe } from "@stealthscale/theme/authoring";

/**
 * Draws a column of bars, each the height of the line it stands in for.
 */
export const recipe = defineRecipe({
  base: {
    "& > *": {
      backgroundClip: "content-box",
      blockSize: "1lh",
      paddingBlock: "0.15lh",
    },
    "& > *:last-child:not(:only-child)": { maxWidth: "80%" },
    display: "flex",
    flexDirection: "column",
    width: "full",
  },
  className: "skeleton-text",
  jsx: [/^SkeletonText$/u],
});
