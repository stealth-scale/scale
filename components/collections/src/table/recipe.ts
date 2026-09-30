/**
 * Recipe for the table: a scroller, the table, and the elements a table is composed from.
 *
 * @remarks
 *   Every part binds the element with the table semantics, so the recipe adds styles only.
 *   The stripe and the hover are on the body and select its own rows, because `:nth-of-type` counts
 *   within a parent. Column names read the label role one size smaller, in the muted ink, above a
 *   rule heavier than the row rules. A sorted column's name takes the full ink. A row header that
 *   spans the table is a section heading and takes the column names' style. The caption renders
 *   below the table with a cell's inset. A cell of figures states `data-numeric`, because a slot
 *   recipe resolves its variants once at the root. Borders are separated, and every cell rules its
 *   end on each axis and never its start, so a sticky header cell keeps its own rule. The recipe
 *   has no `effect` axis, because a glow around a row overlaps the rules of the rows beside it. A
 *   row's stripe, hover and selected fills set `--table-row-fill`, which the row paints and a
 *   sticky row header paints over the panel. The stripe skips a selected row. The body's rules
 *   read their ink from `--table-rule` and their width from `--table-rule-width`, which a
 *   composing part sets on a row that ends a group of rows. Under forced colours a selected row
 *   fills with `Highlight`, and its cells' text and rules take `HighlightText`.
 */

import {
  below,
  cornerVariants,
  defineSlotRecipe,
  dense,
  interactive,
  onSlot,
  onSlots,
  PALETTES,
  paletteVariants,
  sizeVariants,
  surface,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * Sizes the table offers.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Custom property the scroll area's root reads for the style of its focus ring.
 */
const RING_STYLE = "--scroll-area-ring-style";

/**
 * Attribute of a cell of figures, which the base aligns to the end in tabular figures.
 */
export const NUMERIC = "data-numeric";

/**
 * Custom property of a row's fill: transparent, the stripe, the hover fill or the selected fill.
 *
 * @remarks
 *   The row paints it, and a sticky cell paints it over the panel, so a sticky cell takes the fill
 *   of its row and hides the cells that scroll under it.
 */
export const ROW_FILL = "--table-row-fill";

/**
 * Custom property of the ink a row's cells rule their ends in: `border`, and `HighlightText` in a
 * selected row under forced colours.
 */
export const RULE_INK = "--table-rule";

/**
 * Custom property of the width of the rule at a row's cells' block end: `hairline`, and a heavier
 * width a composing part sets on a row that ends a group of rows.
 */
export const RULE_WIDTH = "--table-rule-width";

/**
 * Custom property of a cell's inline inset at the table's size, which a part laid over a cell reads
 * to start its text where the cell's text starts.
 */
export const CELL_INSET = "--table-cell-inset";

/**
 * Ink of a cell's rules: its row's rule ink, else `border` in a row outside the table's parts.
 */
const INK = `var(${RULE_INK}, {colors.border})`;

/**
 * Styles the rule at a cell's block end, as wide as its row states.
 */
const RULE = {
  borderBlockEndWidth: `var(${RULE_WIDTH}, {borderWidths.hairline})`,
  borderColor: INK,
};

/**
 * Styles the rule at the inline end of every cell but the last in its row.
 *
 * @remarks
 *   The selector counts children, not types, so a row that starts with a `th` still rules its
 *   first column.
 */
const BESIDE = {
  "&:not(:last-child)": { borderColor: INK, borderInlineEndWidth: "hairline" },
};

/**
 * Paints a sticky cell: the panel under its row's fill.
 */
const STUCK = {
  backgroundColor: "bg.panel",
  backgroundImage: `linear-gradient(var(${ROW_FILL}), var(${ROW_FILL}))`,
};

/**
 * Restates a selected row's forced fill under a state that fills the row.
 *
 * @remarks
 *   The states are variants, and the compiler layers every variant over the base, where the
 *   selected fill is stated, so a hovered selected row would take the hover's fill.
 */
const HIGHLIGHTED = { _selected: { _highContrast: { [ROW_FILL]: "Highlight" } } };

/**
 * Styles the rule under the header's last row, at the indicator width.
 *
 * @remarks
 *   Every rule uses one color, and the width sets the hierarchy.
 */
const UNDER = {
  "& > tr:last-of-type > th": { borderBlockEndWidth: "indicator", borderColor: "border" },
};

/**
 * Styles the rule over the footer's first row, at the indicator width.
 */
const OVER = {
  "& > tr:first-of-type > *": { borderBlockStartWidth: "indicator", borderColor: "border" },
};

/**
 * Removes the rule under a body's last row when a footer follows, because the footer rules its
 * own start.
 */
const LAST = {
  "&:has(+ tfoot) > tr:last-of-type > *": { borderBlockEndWidth: "0" },
};

/**
 * Returns a cell's padding: the gap scale on the block axis and the inset scale on the inline
 * axis, which the cell states in `--table-cell-inset`.
 *
 * @param size - The table's size.
 * @returns The inline inset and the block and inline padding.
 */
function inset(size: string): SystemStyleObject {
  return {
    [CELL_INSET]: dense(`{spacing.inset.${size}}`),
    paddingBlock: dense(`{spacing.gap.${size}}`),
    paddingInline: `var(${CELL_INSET})`,
  };
}

/**
 * Maps each `align` value to the cell's `vertical-align`.
 */
const VERTICAL = {
  start: { verticalAlign: "top" },

  center: { verticalAlign: "middle" },

  end: { verticalAlign: "bottom" },
};

/**
 * Defines the table recipe: a plain table ruled between its rows at size `md` by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    caption: { captionSide: "bottom", color: "fg.subtle", textAlign: "start" },
    cell: {
      [`&[${NUMERIC}]`]: { fontVariantNumeric: "tabular-nums", textAlign: "end" },
      textAlign: "start",
    },
    column: { borderColor: "border" },
    columnGroup: { borderColor: "border" },
    columnHeader: {
      "&[aria-sort]:not([aria-sort=none])": { color: "fg" },
      "&[colspan]": { textAlign: "center" },
      [`&[${NUMERIC}]`]: { textAlign: "end" },
      color: "fg.muted",
      fontWeight: "medium",
      textAlign: "start",
      whiteSpace: "nowrap",
    },
    footer: { fontWeight: "medium" },
    root: {
      borderCollapse: "separate",
      borderSpacing: "0",
      inlineSize: "full",
      textAlign: "start",
    },
    row: {
      _selected: {
        _highContrast: {
          "& > *": { color: "HighlightText" },
          color: "HighlightText",
          forcedColorAdjust: "none",
          [ROW_FILL]: "Highlight",
          [RULE_INK]: "HighlightText",
        },
        [ROW_FILL]: "colors.colorPalette.subtle",
      },
      background: `var(${ROW_FILL})`,
      [ROW_FILL]: "transparent",
      [RULE_INK]: "colors.border",
      [RULE_WIDTH]: "borderWidths.hairline",
    },
    rowHeader: {
      "&[colspan]": { color: "fg.subtle" },
      color: "fg",
      fontWeight: "medium",
      textAlign: "start",
    },
    /**
     * The box around the scroll area, which draws the focus ring while the viewport has keyboard
     * focus and hides the scroll area's own ring, because the box clips it.
     */
    scroller: {
      "&:has(.table__viewport:focus-visible)": {
        outlineColor: "colorPalette.focusRing",
        outlineOffset: "ring",
        outlineStyle: "solid",
        outlineWidth: "ring",
      },
      display: "flex",
      flexDirection: "column",
      inlineSize: "full",
      [RING_STYLE]: "none",
    },
    sorter: {
      ...interactive(),
      alignItems: "center",
      appearance: "none",
      background: "transparent",
      borderStyle: "none",
      color: "inherit",
      display: "inline-flex",
      font: "inherit",
      gap: dense("{spacing.gap.xs}"),
      padding: "0",
      textAlign: "inherit",
    },
  },
  className: "table",
  compoundVariants: [
    {
      css: {
        body: {
          "& > tr": { _hover: { ...HIGHLIGHTED, [ROW_FILL]: "colors.colorPalette.muted" } },
        },
      },
      interactive: true,
      name: "tracked",
      striped: true,
    },
    {
      css: { columnHeader: { "&:first-child": { zIndex: "2" } } },
      name: "cornered",
      stickyColumn: true,
      stickyHeader: true,
    },
  ],
  defaultVariants: {
    align: "center",
    layout: "auto",
    radius: "l2",
    rules: "rows",
    size: "md",
    variant: "plain",
  },
  jsx: [/^Table(\.\w+)?$/u],
  slots: [
    "scroller",
    "viewport",
    "root",
    "columnGroup",
    "column",
    "caption",
    "header",
    "body",
    "footer",
    "row",
    "columnHeader",
    "sorter",
    "rowHeader",
    "cell",
  ],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Vertical alignment of a cell's content in a row taller than one line.
     */
    align: onSlots({
      cell: VERTICAL,
      columnHeader: VERTICAL,
      rowHeader: VERTICAL,
    }),

    /**
     * Whether a body row fills under the pointer and while a control inside it has focus.
     *
     * @remarks
     *   A keyboard reaches the link inside a cell, so the row reads `:focus-within`. A `tr` takes
     *   no focus of its own.
     */
    interactive: {
      true: {
        body: {
          "& > tr": {
            _focusWithin: { ...HIGHLIGHTED, [ROW_FILL]: "colors.colorPalette.subtle" },
            _hover: { ...HIGHLIGHTED, [ROW_FILL]: "colors.colorPalette.subtle" },
          },
        },
      },
    },

    /**
     * Column widths from the content, or from the column declarations and the first row.
     */
    layout: {
      auto: { root: { tableLayout: "auto" } },
      fixed: { root: { tableLayout: "fixed" } },
    },

    /**
     * Palette the selected row and the interactive row fill read.
     *
     * @remarks
     *   The palette is set on the scroller, and every part inherits the palette's custom
     *   properties.
     */
    palette: onSlot("scroller", paletteVariants()),

    /**
     * Corner radius of the scroller, from the layer radii without the pill, which clips the first
     * and last rows.
     */
    radius: onSlot("scroller", cornerVariants(["l1", "l2", "l3"])),

    /**
     * Where the body rules run: `rows` between rows, `all` between rows and between columns, and
     * `none` nowhere. The rule under the header and the rule over the footer render in every value.
     */
    rules: {
      all: {
        body: LAST,
        cell: { ...BESIDE, ...RULE },
        columnHeader: { ...BESIDE, ...RULE },
        footer: OVER,
        header: UNDER,
        rowHeader: { ...BESIDE, ...RULE },
      },
      none: { footer: OVER, header: UNDER },
      rows: {
        body: LAST,
        cell: { ...RULE },
        columnHeader: { ...RULE },
        footer: OVER,
        header: UNDER,
        rowHeader: { ...RULE },
      },
    },

    /**
     * Text size and cell padding: cells read the body role at the size, and the column names and
     * the caption read the label role one size smaller.
     */
    size: onSlots({
      caption: sizeVariants(
        (size) => ({
          paddingBlock: dense(`{spacing.gap.${size}}`),
          paddingInline: dense(`{spacing.inset.${size}}`),
          textStyle: `label.${below(size)}`,
        }),
        SIZES,
      ),
      cell: sizeVariants((size) => inset(size), SIZES),
      columnHeader: sizeVariants(
        (size) => ({ ...inset(size), textStyle: `label.${below(size)}` }),
        SIZES,
      ),
      root: sizeVariants((size) => ({ textStyle: `body.${size}` }), SIZES),
      rowHeader: sizeVariants(
        (size) => ({ ...inset(size), "&[colspan]": { textStyle: `label.${below(size)}` } }),
        SIZES,
      ),
    }),

    /**
     * Whether the header rows stick to the top of the scroll area's viewport.
     *
     * @remarks
     *   The header cells take the panel fill, because the rows stick and the `thead` does not. The
     *   header rows are raised over a sticky column, and a sticky column's first header cell over
     *   both.
     */
    stickyHeader: {
      true: {
        columnHeader: { background: "bg.panel" },
        header: {
          "& > tr": { insetBlockStart: "0", position: "sticky", zIndex: "2" },
        },
      },
    },

    /**
     * Whether the row headers and the first column header stick to the start of the scroll area's
     * viewport.
     */
    stickyColumn: {
      true: {
        columnHeader: {
          "&:first-child": {
            background: "bg.panel",
            insetInlineStart: "0",
            position: "sticky",
            zIndex: "1",
          },
        },
        rowHeader: { ...STUCK, insetInlineStart: "0", position: "sticky", zIndex: "1" },
      },
    },

    /**
     * Whether the column names render on `bg.subtle`, in capitals, tracked out.
     *
     * @remarks
     *   The fill is the stripe's well, so a banded and striped table uses one tone for both.
     */
    banded: {
      true: {
        columnHeader: {
          background: "bg.subtle",
          letterSpacing: "wide",
          textTransform: "uppercase",
        },
      },
    },

    /**
     * Whether every odd body row renders on `bg.muted`.
     *
     * @remarks
     *   The stripe skips a selected row, so a selected row keeps its selected fill.
     */
    striped: {
      true: {
        body: {
          "& > tr:not([aria-selected=true], [data-selected])": {
            _odd: { [ROW_FILL]: "colors.bg.muted" },
          },
        },
      },
    },

    /**
     * Surface of the scroller: the panel inside a hairline edge, or transparent.
     *
     * @remarks
     *   `surface` does not cast a shadow. After dark a height adds an inset rim under the
     *   scroller's content, and a stripe, a filled row or a sticky cell at the edge covers the
     *   rim.
     */
    variant: {
      surface: {
        scroller: { ...surface(), boxShadow: "none", overflow: "hidden" },
      },

      plain: { scroller: { background: "transparent" } },
    },
  },
});
