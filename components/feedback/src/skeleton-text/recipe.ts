/**
 * Declares the recipe the placeholder paragraph's column is styled from.
 *
 * @remarks
 *   Every length is expressed in `lh`, the line box of the text the bars replace. A bar takes a
 *   line and a half with half a line of that cut out of it by `content-box` clipping, so what a
 *   reader sees is a bar a line tall with half a line of page between it and the next. Nothing
 *   here declares an absolute size, which is what lets a caller drop the placeholder anywhere text
 *   is set and have it come out at that text's size. The last bar of several is capped at 80%,
 *   because a paragraph rarely fills its final line and a stack of equal bars reads as a table
 *   rather than as prose.
 *   The cut was a seventh of a line at either end, which at a body line height is under four
 *   pixels. Six bars at that spacing read as one grey slab rather than as six lines, so the cut is
 *   a quarter of a line now and the bars are the distance apart the description has always
 *   claimed.
 */

import { defineRecipe } from "@stealthscale/theme/authoring";

/**
 * Styles the column, giving every child a one line box and capping the final bar's width.
 */
export const recipe = defineRecipe({
  base: {
    "& > *": {
      backgroundClip: "content-box",
      blockSize: "1.5lh",
      paddingBlock: "0.25lh",
    },
    "& > *:last-child:not(:only-child)": { maxWidth: "80%" },
    display: "flex",
    flexDirection: "column",
    width: "full",
  },
  className: "skeleton-text",
  jsx: [/^SkeletonText$/u],
});
