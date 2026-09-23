/**
 * Declares the recipe of the skeleton text column: one bar per line, spaced by half a line.
 *
 * @remarks
 *   Every length is in `lh`, the line height of the text the bars replace, so the placeholder
 *   takes the size of the text around it without an absolute length. Each bar is `1lh` tall and
 *   the column's gap is `0.5lh`. The gap is on the column and not a clipped inset on the bar,
 *   because the skeleton's `loading` variant sets `background` and `background-clip: padding-box`
 *   in the variants layer, which overrides any clip this base sets on a bar. With two or more bars
 *   the last is capped at 80% width, so the stack reads as a paragraph and not as a table.
 */

import { defineRecipe } from "@stealthscale/theme/authoring";

/**
 * Skeleton text recipe: a full-width flex column of line-height bars.
 */
export const recipe = defineRecipe({
  base: {
    "& > *": { blockSize: "1lh" },
    "& > *:last-child:not(:only-child)": { maxWidth: "80%" },
    display: "flex",
    flexDirection: "column",
    gap: "0.5lh",
    width: "full",
  },
  className: "skeleton-text",
  jsx: [/^SkeletonText$/u],
});
