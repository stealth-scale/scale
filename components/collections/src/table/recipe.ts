/**
 * Defines the styles a table is drawn with.
 *
 * @remarks
 *   Thirteen parts. The scroller is the box a wide table scrolls inside, the root is the table
 *   itself, and the rest are the elements a table is built from. Every part binds the element the
 *   browser already gives the meaning to, so the semantics are the document's and the recipe only
 *   draws.
 *   The stripe and the hover sit on the body and reach its own rows, because `:nth-of-type` counts
 *   within a parent and a rule on the row slot would stripe the header's single row as well.
 *   A cell states `numeric` rather than taking it as an axis. A slot recipe resolves its variants
 *   once at the root, so a per-column switch cannot be one. The prop writes an attribute the base
 *   styles.
 */

import {
  cornerVariants,
  defineSlotRecipe,
  dense,
  interactive,
  onSlot,
  onSlots,
  sizeVariants,
  surface,
} from "@stealthscale/theme/authoring";

/**
 * The steps a table is read at.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * The attribute a cell of figures carries, which the base right-aligns and sets in tabular figures.
 */
export const NUMERIC = "data-numeric";

/**
 * Writes the rule between two rows.
 */
const RULE = { borderBlockEndWidth: "hairline", borderColor: "border" };

/**
 * Writes where a cell's words sit against the height of its row.
 */
const VERTICAL = {
  bottom: { verticalAlign: "bottom" },
  middle: { verticalAlign: "middle" },
  top: { verticalAlign: "top" },
};

/**
 * Draws a table ruled between its rows, at the middle size, until a caller says otherwise.
 */
export const recipe = defineSlotRecipe({
  base: {
    caption: { captionSide: "bottom", color: "fg.muted", textAlign: "start" },
    cell: {
      [`&[${NUMERIC}]`]: { fontVariantNumeric: "tabular-nums", textAlign: "end" },
      textAlign: "start",
    },
    column: { borderColor: "border" },
    columnGroup: { borderColor: "border" },
    columnHeader: {
      [`&[${NUMERIC}]`]: { textAlign: "end" },
      color: "fg",
      fontWeight: "semibold",
      textAlign: "start",
    },
    footer: { fontWeight: "medium" },
    root: { borderCollapse: "collapse", inlineSize: "full", textAlign: "start" },
    row: { _selected: { background: "colorPalette.subtle" } },
    rowHeader: { color: "fg", fontWeight: "semibold", textAlign: "start" },
    scroller: { inlineSize: "full", overflowX: "auto" },
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
      css: { body: { "& > tr": { _hover: { background: "colorPalette.muted" } } } },
      interactive: true,
      name: "tracked",
      striped: true,
    },
    {
      css: {
        columnHeader: {
          "&:first-child": {
            background: "bg.panel",
            insetInlineStart: "0",
            position: "sticky",
            zIndex: "2",
          },
        },
      },
      name: "cornered",
      stickyColumn: true,
      stickyHeader: true,
    },
  ],
  defaultVariants: { align: "middle", layout: "auto", radius: "l2", size: "md", variant: "line" },
  jsx: [/^Table(\.\w+)?$/u],
  slots: [
    "scroller",
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
  variants: {
    /**
     * Where a cell's words sit against the height of the row. A table whose cells run to several
     * lines reads better from the top, and one of single lines from the middle.
     */
    align: onSlots({
      cell: VERTICAL,
      columnHeader: VERTICAL,
      rowHeader: VERTICAL,
    }),

    /**
     * Whether a row lights up under the pointer, for a table whose rows go somewhere.
     *
     * The row lights up from the keyboard too. What a keyboard reaches is the link inside a cell,
     * so the row answers to focus within it rather than to focus on itself. A row cannot hold the
     * focus: a `tr` takes no role a reader can act on, and a `tabindex` on one announces a control
     * that says nothing.
     */
    interactive: {
      true: {
        body: {
          "& > tr": {
            _focusWithin: { background: "colorPalette.subtle" },
            _hover: { background: "colorPalette.subtle" },
          },
        },
      },
    },

    /**
     * Whether the columns take their width from their content or share the table's evenly.
     */
    layout: {
      auto: { root: { tableLayout: "auto" } },
      fixed: { root: { tableLayout: "fixed" } },
    },

    radius: onSlot("scroller", cornerVariants()),

    /**
     * Whether the columns are ruled apart as well as the rows.
     */
    ruled: {
      true: {
        cell: {
          "&:not(:last-of-type)": { borderColor: "border", borderInlineEndWidth: "hairline" },
        },
        columnHeader: {
          "&:not(:last-of-type)": { borderColor: "border", borderInlineEndWidth: "hairline" },
        },
      },
    },

    size: onSlots({
      caption: sizeVariants((size) => ({ paddingBlock: dense(`{spacing.inset.${size}}`) }), SIZES),
      cell: sizeVariants(
        (size) => ({
          paddingBlock: dense(`{spacing.inset.${size}}`),
          paddingInline: dense(`{spacing.inset.${size}}`),
        }),
        SIZES,
      ),
      columnHeader: sizeVariants(
        (size) => ({
          paddingBlock: dense(`{spacing.inset.${size}}`),
          paddingInline: dense(`{spacing.inset.${size}}`),
        }),
        SIZES,
      ),
      root: sizeVariants((size) => ({ textStyle: `body.${size}` }), SIZES),
      rowHeader: sizeVariants(
        (size) => ({
          paddingBlock: dense(`{spacing.inset.${size}}`),
          paddingInline: dense(`{spacing.inset.${size}}`),
        }),
        SIZES,
      ),
    }),

    /**
     * Whether the header stays put while the body scrolls under it.
     */
    /**
     * Whether the column names stay put while the table scrolls down.
     *
     * @remarks
     *   The surface is painted on the cells rather than on the section. A `thead` does not move:
     *   the rows inside it are what stick, so a fill on the section scrolled away and the body's
     *   values showed through the header's labels. The corner cell sticks on both axes and carries
     *   the same surface, so it occludes what passes under it rather than letting two scrolls meet
     *   in it.
     */
    stickyHeader: {
      true: {
        columnHeader: { background: "bg.panel" },
        header: {
          "& > tr": { insetBlockStart: "0", position: "sticky", zIndex: "1" },
        },
      },
    },

    /**
     * Whether the row's own name stays put while the table scrolls sideways.
     */
    stickyColumn: {
      true: {
        rowHeader: {
          background: "bg.panel",
          insetInlineStart: "0",
          position: "sticky",
          zIndex: "1",
        },
      },
    },

    /**
     * Whether every other row is tinted, which helps an eye track across a wide table.
     *
     * @remarks
     *   A stripe is the shallowest well, so a hovered row on the muted fill still stands from it.
     */
    striped: {
      true: { body: { "& > tr": { _odd: { background: "bg.subtle" } } } },
    },

    /**
     * How the table is set off from the page.
     */
    variant: {
      line: { cell: { ...RULE }, columnHeader: { ...RULE }, rowHeader: { ...RULE } },
      outline: {
        cell: { ...RULE },
        columnHeader: { ...RULE },
        rowHeader: { ...RULE },
        scroller: { ...surface(), boxShadow: "none", overflow: "hidden", overflowX: "auto" },
      },
      plain: { root: { borderStyle: "none" } },
    },
  },
});
