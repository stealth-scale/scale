/**
 * Defines the styles a status matrix adds to the table it is drawn as.
 *
 * @remarks
 *   Eleven parts, and every one of them sits on a part of the table. A matrix is a table, so the
 *   rules, the bands and the room round a cell are the table's and this only says what a grid of
 *   marks needs on top of them.
 *   The mark's own colour is the data. The cell behind it stays the page's own background, the
 *   crosshair lights a row and a column in the quietest fill there is, and nothing else in the grid
 *   is tinted. A fill per state would draw a patchwork a reader has to look past before they can
 *   read a single mark, and it puts the tone twice on the same square.
 *   The matrix takes the width of its own contents rather than the width of the page. Four regions
 *   of icons stretched across a screen is four columns a reader's eye has to travel, and the pair a
 *   crosshair is for cannot both be in view. Where the contents do not fit, the table overflows the
 *   box and the box scrolls, which is what it already does for a wide table.
 *   A column's name is drawn inside a block of its own rather than by aligning the cell. The table
 *   states where a column name sits, and two recipes writing the same property onto one element are
 *   settled by which sheet was built last.
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
 * The steps a matrix is read at, which are the table's own.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Lights the row and the column under the pointer.
 *
 * @remarks
 *   The shallowest fill the theme has, and no palette. The marks in the lit row are the only
 *   coloured thing in the grid, and a tinted crossing under them reads as a state of its own.
 *   One step under the panel rather than two. A crosshair follows the pointer, so it is read as
 *   movement rather than as a state, and it only has to be enough to find the pair by. The heavier
 *   fill is the table's stripe, and a crosshair drawn in it reads as a row that is striped.
 */
const LIT = { "&[data-lit]": { background: "bg.subtle" } };

/**
 * Points the palette at the tone a state states, for the mark to read.
 */
const TONES = {
  "&[data-tone=error]": { colorPalette: "error" },
  "&[data-tone=info]": { colorPalette: "info" },
  "&[data-tone=neutral]": { colorPalette: "neutral" },
  "&[data-tone=success]": { colorPalette: "success" },
  "&[data-tone=warning]": { colorPalette: "warning" },
};

/**
 * Draws a matrix at the middle size until a caller says otherwise.
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
