/**
 * Styles a grid's cells and the editor over a cell: the selected fill, the line along the
 * selection's outer edges, the focus ring, the unsaved mark, the editor's control and the reason a
 * value was refused.
 *
 * @remarks
 *   In a grid a selected cell fills with the palette's subtle role over its row, a line in the
 *   palette's solid runs along the selection's outer edges, and the cell with the tab stop rings
 *   its edge inside while it has keyboard focus. An open editor covers its cell. The cell's content
 *   remains under it, hidden, so the cell keeps its size. The editor's control fills the cell with
 *   square corners and starts its text at the cell's inline inset less its edge, where the cell's
 *   text starts, and ends it there in a column of figures. The reason a value was refused is placed
 *   under the cell in the error inks, over the rows below, or above the cell in a body's last row,
 *   so the scroller never clips it. It is as wide as its words up to `sizes.xs`, from the cell's
 *   end in a column of figures. A cell with an unsaved change marks its inline start with a bar in
 *   the warning palette's solid, `CanvasText` under forced colours.
 */

import {
  CONTROL_INSET_END,
  CONTROL_INSET_START,
  dense,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

import { CELL_INSET, ROW_FILL, RULE_INK } from "#data-table/properties.ts";

/**
 * Styles a cell of a grid: the selected fill, the line along the selection's outer edges, the
 * unsaved mark, and the focus ring inside the cell with the tab stop.
 *
 * @remarks
 *   A selected cell paints the fill it states over its row, as a pinned cell paints its row's fill
 *   over the panel. The line is a box over the cell, as wide as the indicator on each side
 *   `data-edges` lists, in the palette's solid, which is at least 3:1 against the panel. Each side
 *   reads its own custom property, so no rule depends on the order of another. Under forced colours
 *   a selected cell fills with `Highlight` over `Canvas`, and its text, its rule, its line and its
 *   focus ring take `HighlightText`. A cell whose editor is open shows no line and takes no forced
 *   fill. Its editor covers the cell with a field in the forced colours of every field.
 */
export const GRIDDED: SystemStyleObject = {
  "&:is([data-edges], [data-editing], [data-unsaved]):not([data-pinned])": {
    position: "relative",
  },
  "&[aria-selected=true]": {
    backgroundImage: `linear-gradient(var(${ROW_FILL}), var(${ROW_FILL}))`,
    [ROW_FILL]: "colors.colorPalette.subtle",
  },
  "&[aria-selected=true]:not([data-editing])": {
    _highContrast: {
      "& *": { color: "HighlightText" },
      backgroundColor: "Canvas",
      color: "HighlightText",
      focusRingColor: "HighlightText",
      forcedColorAdjust: "none",
      [ROW_FILL]: "Highlight",
      [RULE_INK]: "HighlightText",
    },
  },
  "&[data-edges]": {
    _after: {
      _highContrast: { borderColor: "HighlightText" },
      borderBlockEndWidth: "var(--edge-block-end, 0)",
      borderBlockStartWidth: "var(--edge-block-start, 0)",
      borderColor: "colorPalette.solid",
      borderInlineEndWidth: "var(--edge-inline-end, 0)",
      borderInlineStartWidth: "var(--edge-inline-start, 0)",
      borderStyle: "solid",
      content: '""',
      inset: "0",
      pointerEvents: "none",
      position: "absolute",
    },
  },
  "&[data-edges~=block-end]": { "--edge-block-end": "borderWidths.indicator" },
  "&[data-edges~=block-start]": { "--edge-block-start": "borderWidths.indicator" },
  "&[data-edges~=inline-end]": { "--edge-inline-end": "borderWidths.indicator" },
  "&[data-edges~=inline-start]": { "--edge-inline-start": "borderWidths.indicator" },
  "&[data-editing]": { _after: { display: "none" } },
  "&[data-unsaved]": {
    _before: {
      _highContrast: { background: "CanvasText", forcedColorAdjust: "none" },
      background: "warning.solid",
      content: '""',
      inlineSize: "{borderWidths.indicator}",
      insetBlock: "0",
      insetInlineStart: "0",
      pointerEvents: "none",
      position: "absolute",
    },
  },
  "&[tabindex]": {
    _focusVisible: { outlineOffset: "calc({borderWidths.ring} * -1)" },
    focusRingColor: "colorPalette.focusRing",
    focusVisibleRing: "inside",
  },
};

/**
 * Styles the editor over a cell: a flex box over the cell's padding box, whose control fills it
 * with square corners and starts its text where the cell's text starts.
 */
export const EDITOR: SystemStyleObject = {
  "[data-numeric] > &": { "& input": { textAlign: "end" } },
  "& > :first-child": {
    borderRadius: "none",
    [CONTROL_INSET_END]: `calc(var(${CELL_INSET}) - {borderWidths.control})`,
    [CONTROL_INSET_START]: `calc(var(${CELL_INSET}) - {borderWidths.control})`,
    flex: "1",
    maxBlockSize: "full",
    minBlockSize: "full",
    minInlineSize: "0",
  },
  display: "flex",
  inset: "0",
  position: "absolute",
};

/**
 * Styles the reason a value was refused: a box in the error inks under the cell, above it in a
 * body's last row, as wide as its words up to `sizes.xs`.
 */
export const EDITOR_ERROR: SystemStyleObject = {
  "[data-numeric] > * > &": { insetInlineEnd: "0", insetInlineStart: "auto" },
  background: "bg.panel",
  borderColor: "border.error",
  borderRadius: "l2",
  borderStyle: "solid",
  borderWidth: "hairline",
  color: "fg.error",
  inlineSize: "max-content",
  insetBlockStart: "100%",
  insetInlineStart: "0",
  marginBlockStart: dense("{spacing.gap.xs}"),
  maxInlineSize: "xs",
  paddingBlock: dense("{spacing.gap.xs}"),
  paddingInline: dense("{spacing.inset.xs}"),
  position: "absolute",
  textStyle: "body.sm",
  "tr:last-child > * > * > &": {
    insetBlockEnd: "100%",
    insetBlockStart: "auto",
    marginBlockEnd: dense("{spacing.gap.xs}"),
    marginBlockStart: "0",
  },
  zIndex: "3",
};
