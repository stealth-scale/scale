/**
 * Recipe for the parts a data table adds around the collections table: the column that stacks the
 * table and its controls, the row of a header's name and its column actions, the indicators in a
 * header and a row, the resize separator, the cells of a pinned column, the widths of a sized
 * table, and words that render only for assistive technology.
 *
 * @remarks
 *   The table's own look (its surface, rules, stripes and sizes) is the collections table's recipe,
 *   which `DataTable.Table` passes its axes to. The sort indicator is the caller's glyph, pointing
 *   up. It turns half a circle for a descending sort. On a sortable column that is not sorted it is
 *   transparent until the pointer is over the sort button or the button has keyboard focus. The
 *   expand indicator is the caller's glyph, pointing to the inline end, and turns a quarter while
 *   the row's detail is open. A pinned column's cells stick at `--pin-offset` from their region's
 *   edge on the panel under their row's fill, and the column at a region's edge rules its side next
 *   to the scrolling columns. A sized table is as wide as `--table-size`, each column as wide as
 *   its `--column-size`, and its scroller as wide as the table and never wider than its room. A
 *   header with column actions lays its name and the actions out in an inline row, which the header
 *   aligns as it aligns its name, so the actions follow the name, or precede it in a column of
 *   figures, where the header renders them first. The actions take a negative block margin of half
 *   the difference between an `xs` button and a line, so a header with actions is as tall as one
 *   without. A range filter lays its two fields out side by side, and a value filter writes each
 *   value's count in the muted ink with tabular figures. The column manager stacks its list over
 *   its reset button, which keeps its own width. The page size select follows its label in a row,
 *   the label in the muted ink at the small body size. A body row that ends a region of rows
 *   another region follows, such as the last row pinned to the top, rules its end at the indicator
 *   width. A cell whose rows span ends on the body's last row takes no rule before a footer, as the
 *   last row's cells do. The search field is at most `sizes.xs` wide. A resize separator is centred
 *   on its column's end, and the last column's is inside the table's end, so the table overflows
 *   nothing. Its line is transparent at rest and takes the palette's solid under the pointer, with
 *   keyboard focus and while it resizes, `Highlight` under forced colours. In a windowed table a
 *   group of pinned rows sticks on the panel over the rows that scroll: the top group under the
 *   header at `--table-head-size`, the bottom group at the viewport's end. A spacer row is as tall
 *   as `--spacer-size`, and its cell has no padding. A row with a tab stop, in a table with levels,
 *   rings its edge inside while it has keyboard focus. A cell that leads with a row's toggle lays
 *   the toggle and its content out in a row, indented `spacing.6` for each of `--row-depth` levels.
 *   A button in a body cell, a row's toggle, a detail button or a pin toggle, is in a box as wide
 *   as an `xs` button with the same negative block margin, so a row with a button is as tall as one
 *   without. A checkbox of the select column is in a box one line tall that centres it, so a row or
 *   a header with a checkbox is as tall as one without. A `Code` chip in a cell aligns to the
 *   bottom of the cell's text, so a small chip keeps its row's height. A grid's cells, the editor
 *   over a cell and the reason a value was refused take `GRIDDED`, `EDITOR` and `EDITOR_ERROR`, and
 *   an open editor's cell content is hidden under it.
 */

import { defineSlotRecipe, dense, type SystemStyleObject } from "@stealthscale/theme/authoring";

import { EDITOR, EDITOR_ERROR, GRIDDED } from "#data-table/gridded.ts";
import { ROW_FILL, RULE_INK, RULE_WIDTH } from "#data-table/properties.ts";

/**
 * Styles an indicator that turns: a box around the caller's glyph that turns at the press pace,
 * at once under reduced motion.
 */
const TURNING: SystemStyleObject = {
  _motionReduce: { transitionDuration: "0s" },
  alignItems: "center",
  display: "inline-flex",
  flexShrink: "0",
  transitionDuration: "press",
  transitionProperty: "opacity, rotate",
  transitionTimingFunction: "press",
};

/**
 * Styles the cells of a pinned column: sticky at the offset, the panel under the row's fill, and
 * a rule in the row's ink at the side of the region's edge.
 *
 * @remarks
 *   The row's fill is its stripe, its hover fill or its selected fill, so a pinned cell matches
 *   its row and hides the figures scrolled under it. Under forced colours a selected row's fill is
 *   `Highlight` and its ink `HighlightText`. A pinned cell paints `Canvas` under it, the row's own
 *   composite, because Chromium's `Highlight` is 80% opaque.
 */
const PINNED: SystemStyleObject = {
  "&[data-pinned]": {
    backgroundColor: "bg.panel",
    backgroundImage: `linear-gradient(var(${ROW_FILL}), var(${ROW_FILL}))`,
    position: "sticky",
    "tr[aria-selected=true] > &": { _highContrast: { backgroundColor: "Canvas" } },
    zIndex: "1",
  },
  "&[data-pinned=end]": { insetInlineEnd: "var(--pin-offset)" },
  "&[data-pinned=end][data-pinned-edge]": {
    borderInlineStartColor: `var(${RULE_INK}, {colors.border})`,
    borderInlineStartWidth: "indicator",
  },
  "&[data-pinned=start]": { insetInlineStart: "var(--pin-offset)" },
  "&[data-pinned=start][data-pinned-edge]": {
    borderInlineEndColor: `var(${RULE_INK}, {colors.border})`,
    borderInlineEndWidth: "indicator",
  },
};

/**
 * Styles the cells of a column that fits its content: as narrow as the content while the table
 * lays out its columns by their content, where a column declaration sizes a sized table's.
 */
const FIT: SystemStyleObject = { "&[data-fit]": { inlineSize: "0" } };

/**
 * Styles a cell whose rows span ends on the body's last row: before a footer it takes no rule, as
 * the collections table's last row does, because the footer rules its own start.
 */
const SPAN_END: SystemStyleObject = {
  "&[data-span-end]": { "tbody:has(+ tfoot) > tr > &": { [RULE_WIDTH]: "0" } },
};

/**
 * Aligns typography's `Code` chip in a cell to the bottom of the cell's text.
 *
 * @remarks
 *   A chip at `sm` then keeps its row at 41px, and its text's middle is within a third of a pixel
 *   of the next cell's text in Firefox and Chromium. A chip at `md` is as tall as the line and
 *   makes a 42px row.
 */
const CHIP: SystemStyleObject = { "& .code": { verticalAlign: "text-bottom" } };

/**
 * Height of the smallest button, which an action or a toggle in a line of text is.
 */
const BUTTON = dense("{sizes.control.xs}");

/**
 * Styles the box around a button in a line of text with a negative block margin of half the
 * difference between the button and the line, so the line keeps its height.
 */
const ONE_LINE: SystemStyleObject = { marginBlock: `calc((1lh - ${BUTTON}) / 2)` };

/**
 * Defines the data table recipe.
 */
export const recipe = defineSlotRecipe({
  base: {
    actions: { ...ONE_LINE, alignItems: "center", display: "flex", flexShrink: "0" },
    branch: {
      alignItems: "center",
      display: "flex",
      gap: dense("{spacing.gap.xs}"),
      paddingInlineStart: `calc(var(--row-depth, 0) * ${dense("{spacing.6}")})`,
    },
    cell: { ...PINNED, ...FIT, ...SPAN_END, ...CHIP, ...GRIDDED },
    column: { inlineSize: "var(--column-size)" },
    columnHeader: {
      ...PINNED,
      ...FIT,
      "&[data-resizable]:not([data-pinned])": { position: "relative" },
    },
    count: { color: "fg.muted", fontVariantNumeric: "tabular-nums" },
    covered: { visibility: "hidden" },
    editor: EDITOR,
    editorError: EDITOR_ERROR,
    expandIndicator: {
      ...TURNING,
      _open: { rotate: "90deg" },
      _rtl: { _open: { rotate: "90deg" }, rotate: "180deg" },
    },
    frame: { "&[data-sized]": { inlineSize: "fit-content", maxInlineSize: "full" } },
    heading: {
      alignItems: "center",
      display: "inline-flex",
      gap: dense("{spacing.gap.xs}"),
      verticalAlign: "middle",
    },
    manager: { display: "flex", flexDirection: "column", gap: dense("{spacing.gap.sm}") },
    pageSize: { alignItems: "center", display: "inline-flex", gap: dense("{spacing.gap.sm}") },
    pageSizeLabel: { color: "fg.muted", textStyle: "body.sm", whiteSpace: "nowrap" },
    panel: { inlineSize: "60" },
    range: {
      display: "grid",
      gap: dense("{spacing.gap.sm}"),
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
    region: {
      "&[data-pinned=bottom]": { insetBlockEnd: "0" },
      "&[data-pinned=top]": { insetBlockStart: "var(--table-head-size)" },
      backgroundColor: "bg.panel",
      position: "sticky",
      zIndex: "2",
    },
    reset: { alignSelf: "flex-end" },
    resizer: {
      _after: {
        background: "transparent",
        content: '""',
        forcedColorAdjust: "none",
        inlineSize: "{borderWidths.indicator}",
        insetBlock: "0",
        insetInlineStart: "50%",
        marginInlineStart: "calc({borderWidths.indicator} / -2)",
        position: "absolute",
      },
      "&:is(:hover, :focus-visible, [data-resizing])": {
        _after: { _highContrast: { background: "Highlight" }, background: "colorPalette.solid" },
      },
      background: "transparent",
      blockSize: "full",
      borderStyle: "none",
      cursor: "resizeColumn",
      focusVisibleRing: "inside",
      inlineSize: "3",
      insetBlock: "0",
      insetInlineEnd: "calc({sizes.3} / -2)",
      margin: "0",
      position: "absolute",
      "th:last-child > &": {
        _after: {
          insetInlineStart: "calc(100% - {borderWidths.indicator})",
          marginInlineStart: "0",
        },
        insetInlineEnd: "0",
      },
      touchAction: "none",
      userSelect: "none",
      zIndex: "1",
    },
    root: {
      display: "flex",
      flexDirection: "column",
      gap: dense("{spacing.gap.md}"),
      minInlineSize: "0",
    },
    row: {
      "&[data-region-end]": { [RULE_WIDTH]: "borderWidths.indicator" },
      "&[tabindex]": {
        _focusVisible: { outlineOffset: "calc({borderWidths.ring} * -1)" },
        focusRingColor: "colorPalette.focusRing",
        focusVisibleRing: "inside",
      },
    },
    rowHeader: { ...PINNED, ...FIT, ...SPAN_END, ...CHIP, ...GRIDDED },
    search: { maxInlineSize: "xs" },
    selectBox: { alignItems: "center", blockSize: "1lh", display: "flex" },
    sortIndicator: {
      ...TURNING,
      "&[data-direction=descending]": { rotate: "180deg" },
      "&[data-direction=none]": {
        "*:is(:hover, :focus-visible) > &": { opacity: "muted" },
        opacity: "0",
      },
    },
    spacer: { "& > td": { padding: "0" }, blockSize: "var(--spacer-size)" },
    table: { "&[data-sized]": { inlineSize: "var(--table-size)" } },
    toggle: {
      ...ONE_LINE,
      display: "flex",
      flexShrink: "0",
      inlineSize: BUTTON,
      justifyContent: "center",
    },
    value: { alignSelf: "stretch" },
    valueLabel: {
      display: "flex",
      flex: "1",
      gap: dense("{spacing.gap.md}"),
      justifyContent: "space-between",
    },
    visuallyHidden: { srOnly: true },
  },
  className: "data-table",
  jsx: [/^DataTable\.\w+$/u],
  slots: [
    "root",
    "frame",
    "table",
    "column",
    "columnHeader",
    "heading",
    "actions",
    "region",
    "row",
    "spacer",
    "rowHeader",
    "cell",
    "covered",
    "editor",
    "editorError",
    "branch",
    "toggle",
    "selectBox",
    "search",
    "panel",
    "range",
    "value",
    "valueLabel",
    "count",
    "manager",
    "reset",
    "pageSize",
    "pageSizeLabel",
    "sortIndicator",
    "expandIndicator",
    "resizer",
    "visuallyHidden",
  ],
});
