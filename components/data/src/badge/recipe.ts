/**
 * States what a badge is: a short label set off from what it labels, drawn in a look, a size, a
 * corner and the palette of its status.
 *
 * @remarks
 *   Every value is a flat layer style, a semantic tag height, a semantic corner or a palette, so a
 *   theme moves all of them. The looks are flat rather than filled: a badge is read rather than
 *   pressed, and one drawn in a fill repaints whenever a pointer crosses it, which reads as a
 *   control a reader can press and then cannot. A badge inside a row that hovers is under the
 *   pointer whenever the row is, so the difference shows up wherever badges are most used.
 *   The numbers are tabular, because a badge nearly always holds a count and a column of counts
 *   that shifts width as it changes is hard to read down. Nothing wraps, and the badge does not
 *   shrink, so a long label pushes the line rather than folding to two and doubling the row's
 *   height. The `status` axis offers `neutral` beside the four statuses, for a label that states a
 *   fact rather than a state, such as the group a page is filed under, and it is listed under
 *   `staticCss` beside them so a page that sets it from data reaches a rule.
 */

import {
  cornerVariants,
  defineRecipe,
  flatVariants,
  statusEmitted,
  statusVariants,
  tagSizes,
} from "@stealthscale/theme/authoring";

/**
 * Draws a badge on the primary palette in the subtle look at the middle size until a caller says
 * otherwise, set inline so it sits in a line of words.
 */
export const recipe = defineRecipe({
  base: {
    alignItems: "center",
    colorPalette: "primary",
    display: "inline-flex",
    flexShrink: "0",
    fontVariantNumeric: "tabular-nums",
    fontWeight: "medium",
    justifyContent: "center",
    userSelect: "none",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  },
  className: "badge",
  defaultVariants: { radius: "l2", size: "md", variant: "subtle" },
  jsx: [/Badge$/u],
  staticCss: [statusEmitted(), { status: ["neutral"] }],
  variants: {
    radius: cornerVariants(),
    size: tagSizes(),
    status: { ...statusVariants(), neutral: { colorPalette: "neutral" } },
    variant: flatVariants(),
  },
});
