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
 *   The column names recede and the values lead. A name is set a step smaller, in the muted ink, at
 *   the label role, and the band is closed by a rule heavier than the ones between the rows. A fill
 *   behind the names would say the same thing louder, and it has to be painted on each cell rather
 *   than on the section once the header sticks, which is where a fill starts fighting the stripe.
 *   A sorted column takes the full ink, so a reader sees which column the table is in the order of.
 *   A row header spanning the table is a section heading rather than a row's own name, and takes
 *   the column names' treatment: the subtler ink at the smaller size. Drawn as a row's name it
 *   reads as one more record.
 *   The caption sits under the table and takes the inset a cell takes, so its words start on the
 *   line the first column's words start on. It is the quietest thing the table draws: a line about
 *   the table rather than a line of it.
 *   A cell states `numeric` rather than taking it as an axis. A slot recipe resolves its variants
 *   once at the root, so a per-column switch cannot be one. The prop writes an attribute the base
 *   styles.
 *   The borders are separated rather than collapsed, and every cell rules its own end on each axis
 *   and never its start. A collapsed border belongs to the table rather than to the cell that asked
 *   for it, so a header cell held in view scrolled away from its own rule and left the names
 *   sitting on nothing. Separated borders travel with the cell. The cost is that two cells ruling
 *   the edge between them draw two lines, which the one-end rule is what avoids.
 */

import {
  below,
  cornerVariants,
  defineSlotRecipe,
  dense,
  interactive,
  onSlot,
  onSlots,
  sizeVariants,
  surface,
  type SystemStyleObject,
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
 *
 * @remarks
 *   A cell rules its own end and never its start, on either axis. The table's borders are separated
 *   rather than collapsed, so two cells that both ruled the edge between them would draw two lines
 *   where a reader expects one.
 */
const RULE = { borderBlockEndWidth: "hairline", borderColor: "border" };

/**
 * Writes the rule between two columns, which every cell but the last in its row draws.
 *
 * @remarks
 *   Counted by child and not by type. A row of a table with a row header holds one `th` and several
 *   `td`, so the `th` is the last of its own type as well as the first child, and a rule drawn on
 *   every cell but the last of its type left the first column with no rule at all.
 */
const BESIDE = {
  "&:not(:last-child)": { borderColor: "border", borderInlineEndWidth: "hairline" },
};

/**
 * Writes the rule under the last row of the header, which is heavier than the rules between the
 * rows so that the names read as a band rather than as a first row of values.
 *
 * @remarks
 *   Heavier and not darker. Every rule a table draws is the one line colour, and the weight is what
 *   says which rule matters. Drawn in a second colour, the header's rule and the row's rules read
 *   as two systems that happen to meet, which is what a reader sees before they see a hierarchy.
 */
const UNDER = {
  "& > tr:last-of-type > th": { borderBlockEndWidth: "indicator", borderColor: "border" },
};

/**
 * Writes the rule over the first row of the footer, which separates a total from the figures it
 * sums whichever way the rows between them are ruled.
 */
const OVER = {
  "& > tr:first-of-type > *": { borderBlockStartWidth: "indicator", borderColor: "border" },
};

/**
 * Takes the rule off the last row of a body that a footer follows.
 *
 * @remarks
 *   The footer rules its own start, so a last row that still ruled its end drew a line of its own a
 *   pixel above it. Separated borders draw both rather than merging them, which is the trade a
 *   sticky header is worth: a collapsed border belongs to the table and stays behind while the cell
 *   that drew it scrolls away.
 */
const LAST = {
  "&:has(+ tfoot) > tr:last-of-type > *": { borderBlockEndWidth: "0" },
};

/**
 * Writes the room a cell leaves round its words.
 *
 * @remarks
 *   The two axes take different scales. A cell's words need room on either side of them to read as
 *   a column, and room above and below them only to read as a row, so the block axis steps down.
 *   Drawn from one scale, the middle size came to a forty-six pixel row, which is a table of any
 *   length read at half the density it could be.
 */
function inset(size: string): SystemStyleObject {
  return {
    paddingBlock: dense(`{spacing.gap.${size}}`),
    paddingInline: dense(`{spacing.inset.${size}}`),
  };
}

/**
 * Writes where a cell's words sit against the height of its row.
 *
 * @remarks
 *   The values are the ones every other `align` axis in the library takes, rather than the words
 *   the `vertical-align` property spells them with. A reader who has learned `align="center"` on a
 *   stack reads it the same way on a table.
 */
const VERTICAL = {
  start: { verticalAlign: "top" },

  center: { verticalAlign: "middle" },

  end: { verticalAlign: "bottom" },
};

/**
 * Draws a table ruled between its rows, at the middle size, until a caller says otherwise.
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
    row: { _selected: { background: "colorPalette.subtle" } },
    rowHeader: {
      "&[colspan]": { color: "fg.subtle" },
      color: "fg",
      fontWeight: "medium",
      textAlign: "start",
    },
    scroller: {
      _focusVisible: { focusVisibleRing: "outside" },
      inlineSize: "full",
      overflowX: "auto",
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
      css: { body: { "& > tr": { _hover: { background: "colorPalette.muted" } } } },
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

    /**
     * How the corners of the surface a table sits on are cut.
     *
     * @remarks
     *   The three layer radii and not the pill. A table is a rectangle of rows, and a box rounded
     *   to its own height clips the first and last of them into an arc.
     */
    radius: onSlot("scroller", cornerVariants(["l1", "l2", "l3"])),

    /**
     * Which rules the table is drawn with.
     *
     * @remarks
     *   Two decisions used to be one. Whether a table sits in a box and whether its rows are ruled
     *   are independent, and holding them on one axis left `line` and `outline` writing the same
     *   rules twice and no way to rule the columns of a boxed table without a second boolean.
     *   The rule under the header is drawn whichever way the rows are, because the names are a band
     *   and a band with nothing under it reads as the first row of values. The rule over the footer
     *   is drawn for the same reason: a total flush against the last figure reads as one more
     *   figure.
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
     * Whether the header stays put while the body scrolls under it.
     */
    /**
     * Whether the column names stay put while the table scrolls down.
     *
     * @remarks
     *   The surface is painted on the cells rather than on the section. A `thead` does not move:
     *   the rows inside it are what stick, so a fill on the section scrolled away and the body's
     *   values showed through the header's labels.
     *   The header's rows are raised over the held column rather than beside it. A held row is
     *   positioned too, and two positioned elements on one layer are settled by document order, so
     *   a body row's own name painted over the name of the column it sits in.
     *   Where the first column is held as well, the cell at the crossing is raised over the rest of
     *   its row, so it occludes what passes under it rather than letting two scrolls meet in it.
     */
    stickyHeader: {
      true: {
        columnHeader: { background: "bg.panel" },
        header: {
          "& > tr": { insetBlockStart: "0", position: "sticky", zIndex: "2" },
        },
        scroller: { overflowY: "auto" },
      },
    },

    /**
     * Whether the row's own name stays put while the table scrolls sideways.
     *
     * @remarks
     *   The name over that column is held with it. A column held without its own name leaves the
     *   reader looking at a column of names under whichever name has scrolled into its place, which
     *   is worse than not holding it at all.
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
        rowHeader: {
          background: "bg.panel",
          insetInlineStart: "0",
          position: "sticky",
          zIndex: "1",
        },
      },
    },

    /**
     * Whether the column names sit on a fill of their own.
     *
     * @remarks
     *   Off by default, and worth turning on for a reference rather than for a table of figures. A
     *   table read on its own says which row is the names through weight, ink and a heavier rule,
     *   and a fill behind them says the same thing louder. A page of a dozen tables one under
     *   another is the case it earns: the fill is what tells a reader where one table ends and the
     *   next begins, which no amount of weight does from the corner of an eye.
     *   The fill is the shallowest well, the same one a stripe takes, so a table that is both
     *   banded and striped draws its names in the tone its odd rows take rather than in a third.
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
     * Whether every other row is tinted, which helps an eye track across a wide table.
     *
     * @remarks
     *   A stripe is the shallowest well, so a hovered row on the muted fill still stands from it.
     */
    striped: {
      true: { body: { "& > tr": { _odd: { background: "bg.muted" } } } },
    },

    /**
     * Whether the table is raised on a surface of its own or drawn against what holds it.
     *
     * @remarks
     *   A raised table takes the panel fill and the shadow a panel rests at, so it reads as a thing
     *   on the page rather than a grid ruled onto it. The shadow is what separates two tables that
     *   sit one under another on the same fill.
     */
    variant: {
      surface: {
        scroller: { ...surface(), overflow: "hidden", overflowX: "auto" },
      },

      plain: { scroller: { background: "transparent" } },
    },
  },
});
