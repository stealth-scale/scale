/**
 * Declares the recipe the placeholder paragraph's column is styled from.
 *
 * @remarks
 *   Every length is expressed in `lh`, the line box of the text the bars replace. A bar is one
 *   line tall with the padding cut out of it by `content-box` clipping, so the column occupies
 *   exactly what the real paragraph will and the page does not reflow when the text lands. Nothing
 *   here declares an absolute size, which is what lets a caller drop the placeholder anywhere text
 *   is set and have it come out at that text's size. The last bar of several is capped at 80%,
 *   because a paragraph rarely fills its final line and a stack of equal bars reads as a table
 *   rather than as prose.
 */

import { defineRecipe } from "@stealthscale/theme/authoring";

/**
 * Styles the column, giving every child a one line box and capping the final bar's width.
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
