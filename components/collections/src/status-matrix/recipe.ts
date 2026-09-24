/**
 * Recipe for the status matrix: the styles the matrix adds to the table's parts.
 *
 * @remarks
 *   The table's recipe styles the rules, the bands and the cell padding. The mark's tone is the
 *   data, so no cell takes a fill per state, and the crosshair fills with `bg.subtle` and no
 *   palette. The recipe has no `palette` axis for the same reason, and no `effect` axis, because a
 *   glow around a cell overlaps the rules beside it. The root takes the width of its content up to
 *   the full width, and the scroller scrolls a wider grid. A column's name renders in a block of
 *   its own, because the table's recipe sets the header cell's alignment.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  interactive,
  onSlots,
  sizeVariants,
} from "@stealthscale/theme/authoring";

/**
 * Sizes the matrix offers, which are the table's.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Styles a cell or a header the crosshair fills.
 *
 * @remarks
 *   `bg.subtle` is one step under the panel. The table's stripe is `bg.muted`, so a lit row does
 *   not read as a striped one.
 */
const LIT = { "&[data-lit]": { background: "bg.subtle" } };

/**
 * Maps each `data-tone` value to the palette the mark reads.
 */
const TONES = {
  "&[data-tone=error]": { colorPalette: "error" },
  "&[data-tone=info]": { colorPalette: "info" },
  "&[data-tone=neutral]": { colorPalette: "neutral" },
  "&[data-tone=success]": { colorPalette: "success" },
  "&[data-tone=warning]": { colorPalette: "warning" },
};

/**
 * Defines the status matrix recipe at size `md` by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    cell: { ...LIT },
    columnHeading: { ...LIT },
    columnLabel: { display: "block", textAlign: "center" },
    dot: { background: "colorPalette.solid", borderRadius: "full" },
    legend: {
      alignItems: "center",
      color: "fg.muted",
      display: "flex",
      flexWrap: "wrap",
      listStyle: "none",
      margin: "0",
      padding: "0",
    },
    legendItem: { alignItems: "center", display: "flex" },
    mark: {
      ...TONES,
      alignItems: "center",
      color: "colorPalette.fg",
      display: "flex",
      justifyContent: "center",
    },
    name: { srOnly: true },
    picker: {
      ...interactive(),
      _focusVisible: { focusVisibleRing: "inside" },
      appearance: "none",
      background: "transparent",
      borderStyle: "none",
      color: "inherit",
      display: "block",
      font: "inherit",
      inlineSize: "full",
      padding: "0",
    },
    root: {
      alignItems: "stretch",
      display: "flex",
      flexDirection: "column",
      inlineSize: "fit-content",
      maxInlineSize: "full",
    },
    rowHeading: { ...LIT, whiteSpace: "nowrap" },
  },
  className: "status-matrix",
  defaultVariants: { size: "md" },
  jsx: [/^StatusMatrix(\.\w+)?$/u],
  slots: [
    "root",
    "columnHeading",
    "columnLabel",
    "rowHeading",
    "cell",
    "picker",
    "mark",
    "dot",
    "name",
    "legend",
    "legendItem",
  ],
  variants: {
    /**
     * Size of the marks and the legend. A mark takes the icon size of the step, and the dot and
     * the legend's text take one step smaller.
     */
    size: onSlots({
      dot: sizeVariants((size) => ({ boxSize: dense(`{sizes.icon.${below(size)}}`) }), SIZES),
      legend: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${size}}`),
          paddingBlock: dense(`{spacing.gap.${size}}`),
          paddingInline: dense(`{spacing.inset.${size}}`),
          textStyle: `label.${below(size)}`,
        }),
        SIZES,
      ),
      legendItem: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${below(size)}}`) }), SIZES),
      mark: sizeVariants(
        (size) => ({ "& > svg": { boxSize: dense(`{sizes.icon.${size}}`) } }),
        SIZES,
      ),
    }),
  },
});
