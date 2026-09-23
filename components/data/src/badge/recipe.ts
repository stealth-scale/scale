/**
 * Styles every element bound to the badge recipe.
 *
 * @remarks
 *   Each declared value resolves to a token, so a theme can shift all of them at once. The looks
 *   are flat rather than filled because a badge is read and not pressed: a filled look repaints
 *   under the pointer, which reads as a control that turns out not to be one, and a badge inside a
 *   hoverable row sits under the pointer whenever the row does. Numerals are tabular, since a badge
 *   usually carries a count and a column of counts that changes width as it updates is hard to
 *   scan. The text neither wraps nor shrinks, so a long label widens its line instead of folding
 *   onto a second one and doubling the row height. The `status` axis adds `neutral` for a label
 *   stating a category rather than a condition, and every status value is listed under `staticCss`
 *   so that a page setting the status from data still finds a rule.
 *   A mark a caller puts in is drawn at the badge's own words: one em square, and never shrunk by
 *   the row the badge is in. Left at whatever it was, a mark from an icon set came in at its own
 *   sixteen or twenty-four pixels and a small badge was a square with a word beside it.
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
 * Declares the badge's base styles and its four variant axes, defaulting to the subtle look at the
 * md size with the l2 corner on the primary palette.
 */
export const recipe = defineRecipe({
  base: {
    "& > svg": { blockSize: "1em", flexShrink: "0", inlineSize: "1em" },
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
