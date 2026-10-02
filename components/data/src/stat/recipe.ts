/**
 * Declares the slot recipe of the stat, a figure with its label, its unit and a line of help text.
 *
 * @remarks
 *   The root is a description list: the label is its term, and the value and the help text are its
 *   details. The figure uses tabular numerals, so a value that updates in place keeps its width.
 *   The `palette` axis colors the indicator only, because the direction of a change and whether it
 *   is good are separate facts: a rise in open tickets is bad news. The stat has no box of its own,
 *   so it offers no `effect` axis.
 */

import {
  defineSlotRecipe,
  dense,
  onSlot,
  paletteVariants,
  sizeVariants,
} from "@stealthscale/theme/authoring";

/**
 * Maps each stat size to the heading text style of its figure.
 *
 * @remarks
 *   `heading.xl` measured 27.2px and `heading.2xl` 32.4px at the foundation's metrics. The step
 *   above, `heading.3xl`, measured 52px, too large a jump for the largest stat.
 */
const FIGURE: Readonly<Record<"lg" | "md" | "sm", string>> = {
  lg: "heading.2xl",
  md: "heading.xl",
  sm: "heading.lg",
};

/**
 * Styles a stat at the middle size, with the indicator in the neutral palette.
 */
export const recipe = defineSlotRecipe({
  base: {
    helpText: {
      alignItems: "center",
      color: "fg.muted",
      display: "flex",
      gap: "0.25em",
      margin: "0",
      textStyle: "body.sm",
    },
    indicator: {
      "& > svg": { blockSize: "1em", flexShrink: "0", inlineSize: "1em" },
      alignItems: "center",
      color: "colorPalette.fg",
      display: "inline-flex",
    },
    label: {
      alignItems: "center",
      color: "fg.muted",
      display: "flex",
      gap: "0.375em",
      textStyle: "label.sm",
    },
    root: {
      colorPalette: "neutral",
      display: "flex",
      flexDirection: "column",
      gap: dense("{spacing.gap.xs}"),
      margin: "0",
      minInlineSize: "0",
    },
    valueText: {
      alignItems: "baseline",
      display: "flex",
      fontVariantNumeric: "tabular-nums",
      gap: "0.25em",
      margin: "0",
    },
    valueUnit: { color: "fg.muted", textStyle: "label.sm" },
  },
  className: "stat",
  defaultVariants: { size: "md" },
  jsx: [/^Stat\.\w+$/u],
  slots: ["root", "label", "valueText", "valueUnit", "helpText", "indicator"],
  variants: {
    /**
     * The palette the indicator is drawn in, as the palette's text ink.
     */
    palette: onSlot("root", paletteVariants()),

    /**
     * The text style of the figure. The label, the unit and the help text keep their size.
     */
    size: onSlot(
      "valueText",
      sizeVariants((size) => ({ textStyle: FIGURE[size] }), ["sm", "md", "lg"]),
    ),
  },
});
