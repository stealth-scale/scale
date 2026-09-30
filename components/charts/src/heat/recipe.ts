/**
 * Styles a heat grid, a table whose cells take a color from their values: the frame, the grid, its
 * headings and cells, the readout over a cell, and the key under the grid.
 *
 * @remarks
 *   The cells are 2px apart on the panel, so each reads as one block of color. A cell takes its
 *   fill from `--heat-fill`, which the component sets from the value, and keeps it under forced
 *   colors, where neither engine would otherwise keep a background color. A value printed in a
 *   cell is black or white, whichever `contrast-color()` picks against the fill, which measured at
 *   least 4.56:1 on every fill of the ten themes in both modes and both engines. A cell without a
 *   value has no fill and a dashed edge, and a cell without a reading in a sparse grid has neither.
 *   The cell the readout shows takes an outline in the ink, inside its edge, and a cell with focus
 *   takes the focus ring outside it, over the gap. The headings of the row and the column the
 *   readout shows fill with the neutral palette's `subtle`. The row headings are sticky at the
 *   grid's start while it scrolls sideways, and their words and the corner's align to their end,
 *   beside the cells. Next to squares the row headings take no height of their own, so the rows are
 *   as far apart as the columns. A group's words start at its first column and are placed out of
 *   the table's layout, so a group never widens its columns, and they are transparent with
 *   `data-overflow`. The readout is placed above its cell at `--heat-x` and `--heat-y`, or below it
 *   with `data-side="bottom"`, and takes no pointer. The key aligns to the grid's end, and its bar
 *   runs the scale's colors from `--heat-ramp` from the reading start. The recipe has no `palette`
 *   or `effect` axis, because the values set the colors and a grid is not a control.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  onSlots,
  sizeVariants,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * Sizes the grid offers.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Attribute the cell the readout shows writes, which the recipe outlines.
 */
export const SHOWN = "data-readout";

/**
 * Custom property of a cell's fill.
 */
export const FILL = "--heat-fill";

/**
 * Custom property of the colors of the key's bar, from its start to its end.
 */
export const RAMP = "--heat-ramp";

/**
 * Custom property of the readout's horizontal middle, from the frame's start.
 */
export const READOUT_X = "--heat-x";

/**
 * Custom property of the edge of the cell the readout is placed against, from the frame's top.
 */
export const READOUT_Y = "--heat-y";

/**
 * Attribute a heading writes while the readout shows a cell in its row or its column.
 */
export const LIT = "data-lit";

/**
 * Attribute the readout writes while its cell is out of the scroll area's view, which hides it.
 */
export const CLIPPED = "data-clipped";

/**
 * Attribute a group's words write while they are wider than the group, which hides them from sight.
 */
export const OVERFLOW = "data-overflow";

/**
 * Room between two cells, which the table also leaves around its outer cells.
 */
const SPACING = "{spacing.0.5}";

/**
 * Custom property of a block cell's height and least width, which the size sets.
 */
const BLOCK = "--heat-block";

/**
 * Custom property of a square cell's side, which the size sets.
 */
const SQUARE = "--heat-square";

/**
 * Maps each size to the grid step of a block cell's height and least width.
 */
const BLOCKS: Readonly<Record<(typeof SIZES)[number], string>> = { lg: "11", md: "8", sm: "6" };

/**
 * Maps each size to the grid step of a square cell's side.
 */
const SQUARES: Readonly<Record<(typeof SIZES)[number], string>> = {
  lg: "6",
  md: "3.5",
  sm: "2.5",
};

/**
 * Styles every cell: a fill from the value, a transparent edge a missing value dashes, the outline
 * of the cell the readout shows and the focus ring.
 */
const CELL: SystemStyleObject = {
  _focusVisible: { outlineOffset: "0" },
  _highContrast: {
    "&[data-state=missing]": { borderColor: "GrayText" },
    [`&[${SHOWN}]`]: { outlineColor: "CanvasText" },
    focusRingColor: "Highlight",
  },
  "&[data-state=missing]": { borderColor: "border", borderStyle: "dashed" },
  [`&[${SHOWN}]:not(:focus-visible)`]: {
    outlineColor: "fg",
    outlineOffset: "calc({borderWidths.indicator} * -1)",
    outlineStyle: "solid",
    outlineWidth: "indicator",
  },
  backgroundColor: `var(${FILL}, transparent)`,
  borderColor: "transparent",
  borderStyle: "solid",
  borderWidth: "hairline",
  focusRingColor: "border.focus",
  focusVisibleRing: "outside",
  forcedColorAdjust: "none",
  padding: "0",
};

/**
 * Styles a heading the readout lights: the neutral palette's `subtle` fill and the full ink.
 */
const LIGHT: SystemStyleObject = {
  [`&[${LIT}]`]: {
    _highContrast: { background: "Highlight", color: "HighlightText", forcedColorAdjust: "none" },
    background: "neutral.subtle",
    color: "fg",
  },
};

/**
 * Defines the heat recipe: a grid of block cells 2px apart at size `md` by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    bar: {
      _rtl: { backgroundImage: `linear-gradient(to left, var(${RAMP}))` },
      backgroundImage: `linear-gradient(to right, var(${RAMP}))`,
      blockSize: "2",
      borderColor: "border",
      borderRadius: "l1",
      borderStyle: "solid",
      borderWidth: "hairline",
      forcedColorAdjust: "none",
    },
    cell: { ...CELL, textAlign: "center", verticalAlign: "middle", whiteSpace: "nowrap" },
    columnHeading: {
      ...LIGHT,
      "&:first-child": {
        background: "bg.panel",
        insetInlineStart: "0",
        position: "sticky",
        textAlign: "end",
        zIndex: "1",
      },
      color: "fg.muted",
      fontWeight: "normal",
      paddingBlock: "0",
      paddingInline: dense("{spacing.gap.xs}"),
      textAlign: "center",
      verticalAlign: "bottom",
      whiteSpace: "nowrap",
    },
    frame: {
      display: "flex",
      flexDirection: "column",
      gap: dense("{spacing.gap.sm}"),
      inlineSize: "fit",
      maxInlineSize: "full",
      minInlineSize: "0",
      position: "relative",
    },
    grid: { borderCollapse: "separate", borderSpacing: SPACING },
    group: {
      blockSize: "1lh",
      color: "fg.muted",
      fontWeight: "normal",
      padding: "0",
      position: "relative",
      verticalAlign: "bottom",
    },
    groupLabel: {
      [`&[${OVERFLOW}]`]: { opacity: "0" },
      insetBlockEnd: "0",
      insetInlineStart: "0",
      pointerEvents: "none",
      position: "absolute",
      whiteSpace: "nowrap",
    },
    key: {
      alignItems: "center",
      alignSelf: "end",
      color: "fg.muted",
      columnGap: dense("{spacing.gap.sm}"),
      display: "grid",
      fontVariantNumeric: "tabular-nums",
      gridTemplateColumns: "auto auto {sizes.40} auto",
      inlineSize: "fit",
      marginInlineEnd: SPACING,
      rowGap: dense("{spacing.gap.xs}"),
      textStyle: "body.xs",
    },
    keyLabel: { color: "fg", paddingInlineEnd: dense("{spacing.gap.xs}") },
    midpoint: { gridColumn: "3", gridRow: "2", justifySelf: "center" },
    name: { srOnly: true },
    readout: {
      "&[data-side=bottom]": { translate: "-50% {spacing.gap.xs}" },
      [`&[${CLIPPED}]`]: { visibility: "hidden" },
      left: `var(${READOUT_X})`,
      maxInlineSize: "full",
      pointerEvents: "none",
      position: "absolute",
      top: `var(${READOUT_Y})`,
      translate: "-50% calc(-100% - {spacing.gap.xs})",
      zIndex: "docked",
    },
    rowHeading: {
      ...LIGHT,
      background: "bg.panel",
      color: "fg.muted",
      fontWeight: "normal",
      insetInlineStart: "0",
      paddingBlock: "0",
      paddingInline: dense("{spacing.gap.xs}"),
      position: "sticky",
      textAlign: "end",
      whiteSpace: "nowrap",
      zIndex: "1",
    },
    value: {
      color: `contrast-color(var(${FILL}))`,
      fontVariantNumeric: "tabular-nums",
      paddingInline: dense("{spacing.gap.xs}"),
    },
  },
  className: "heat",
  compoundVariants: [
    { css: { rowHeading: { lineHeight: "0" } }, name: "squared", shape: "square" },
  ],
  defaultVariants: { shape: "block", size: "md" },
  jsx: [/^Heatmap$/u],
  slots: [
    "frame",
    "grid",
    "group",
    "groupLabel",
    "columnHeading",
    "rowHeading",
    "cell",
    "value",
    "name",
    "readout",
    "key",
    "keyLabel",
    "bar",
    "midpoint",
  ],
  variants: {
    /**
     * Shape of the cells: a block at least as wide as it is tall, which widens to a printed value,
     * or a square with a 2px corner in every theme.
     */
    shape: {
      block: { cell: { blockSize: `var(${BLOCK})`, minInlineSize: `var(${BLOCK})` } },
      square: {
        cell: { borderRadius: "xs", boxSize: `var(${SQUARE})`, minInlineSize: `var(${SQUARE})` },
      },
    },
    /**
     * Size of the cells and of the words in the grid: a block 24, 32 or 44px tall, a square 10, 14
     * or 24px, and the headings and values one text size smaller than the size. A large square is a
     * pointer target of the 24px WCAG 2.5.8 asks for.
     */
    size: onSlots({
      cell: sizeVariants(
        (size) => ({
          [BLOCK]: dense(`{sizes.${BLOCKS[size]}}`),
          [SQUARE]: dense(`{sizes.${SQUARES[size]}}`),
        }),
        SIZES,
      ),
      columnHeading: sizeVariants((size) => ({ textStyle: `label.${below(size)}` }), SIZES),
      group: sizeVariants((size) => ({ textStyle: `label.${below(size)}` }), SIZES),
      rowHeading: sizeVariants((size) => ({ textStyle: `label.${below(size)}` }), SIZES),
      value: sizeVariants((size) => ({ textStyle: `body.${below(size)}` }), SIZES),
    }),
  },
});
