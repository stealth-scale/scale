/**
 * Declares the sidebar's slot recipe, which lays out a fixed header, scrolling content and a fixed
 * footer in a column.
 *
 * @remarks
 *   The recipe has twelve slots. The content scrolls in the primitives package's scroll area, whose
 *   root is the `scroller` and fills the column, and the root does not scroll, so the header and
 *   the footer remain in place however long the list of destinations is. The header and the footer
 *   are columns padded like the content, so a search, a nav block or a switcher in a band is as
 *   wide as the rows' fills, and a line of words in a band starts where the rows' icons start. A
 *   nav block is a grid of two columns: the label and the headings take the first, the block's
 *   control takes the second, and every other child spans both. A block's label is as tall as a
 *   row, small, uppercase and in `fg.subtle`. A block whose rows a query matches none of is hidden,
 *   unless it renders an empty message. On a rail the labels, the headings and the lines of words
 *   in the bands are hidden visually and kept for screen readers, the empty message and the block's
 *   control are removed, and the search centres its button. The app shell sets the sidebar's width,
 *   and the root reads the shell's panel to render the rail. The recipe has no `palette` and no
 *   `effect` axis: its looks are neutral grounds, and the navigation list inside it offers its own
 *   palette and effect for the current row.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  divider,
  interactive,
  onSlot,
  onSlots,
  type Scale,
  sizeVariants,
  surface,
  type SystemStyleObject,
  truncate,
} from "@stealthscale/theme/authoring";

/**
 * Selects a part inside a sidebar collapsed to a rail.
 */
const ICONIC = "[data-iconic] &";

/**
 * Selects the children of a band that fold to an icon by themselves: a search, a nav block, a
 * navigation list and a switcher.
 */
const FOLDS = ".sidebar__search, .sidebar__nav, .nav-list__root, .switcher__root";

/**
 * Selects the children of a band a caller writes around its words and marks: every child that does
 * not fold by itself.
 */
const LINES = `& > :not(${FOLDS})`;

/**
 * Selects the lines of a band that have no icon form: every line except a bare `svg`.
 */
const WORDS = `& > :not(svg, ${FOLDS})`;

/**
 * Styles the header and the footer as a column that keeps its height, and hides its words visually
 * on a rail.
 *
 * @remarks
 *   On a rail only a bare `svg` and the parts that fold by themselves remain visible, so the rail
 *   is as wide as its icons. The words remain in the accessibility tree, because the header's words
 *   identify the workspace and the footer's words identify the signed-in person.
 */
const BANDED = {
  display: "flex",
  flexDirection: "column",
  flexShrink: "0",
  [ICONIC]: { alignItems: "center", [WORDS]: { srOnly: true } },
  minInlineSize: "0",
};

/**
 * Maps each sidebar size to the height of a navigation list row at the same size: 24px, 32px and
 * 40px at the foundation's metrics.
 */
const ROWS: Readonly<Record<"lg" | "md" | "sm", string>> = {
  lg: "control.md",
  md: "control.xs",
  sm: "tag.md",
};

/**
 * Maps each sidebar size to the gap between the content's blocks, two gap sizes larger than the
 * content's padding: 12, 16 and 24px at the foundation's metrics.
 */
const BLOCKS: Readonly<Record<"lg" | "md" | "sm", string>> = { lg: "2xl", md: "xl", sm: "lg" };

/**
 * Returns the inline inset of a navigation list row at the sidebar's size.
 *
 * @remarks
 *   The navigation list insets a row by `spacing.inset` two sizes smaller than the row. The
 *   labels, the headings, the block's control and the lines of words in the bands use the same
 *   inset, so their text and icons start and end where the rows' do: 8, 8 and 12px at `sm`, `md`
 *   and `lg`.
 * @param size - The sidebar's size.
 * @returns The inset, multiplied by the density.
 */
function marked(size: Scale): string {
  return dense(`{spacing.inset.${below(below(size))}}`);
}

/**
 * Returns the side of the block control's square: the tag size one size smaller than the sidebar,
 * and never under `sizes.6`.
 *
 * @remarks
 *   The navigation list sizes the control and the count at the end of a row with the same
 *   expression, so the block's control is in the rows' end column: 24px at every size.
 * @param size - The sidebar's size.
 * @returns The side of the square.
 */
function squared(size: Scale): string {
  return `max({sizes.6}, ${dense(`{sizes.tag.${below(size)}}`)})`;
}

/**
 * Returns the size styles of a band: the content's padding, the gap between its children, the rows'
 * inset on its lines of words and the text style of the rows' words one size up.
 *
 * @param size - The sidebar's size.
 * @returns The styles of the header or the footer at that size.
 */
function banded(size: Scale): SystemStyleObject {
  return {
    gap: dense(`{spacing.gap.${below(size)}}`),
    [LINES]: { marginInline: marked(size) },
    padding: dense(`{spacing.gap.${size}}`),
    textStyle: `label.${below(size)}`,
  };
}

/**
 * Styles a plain sidebar at the middle size.
 */
export const recipe = defineSlotRecipe({
  base: {
    content: { display: "flex", flexDirection: "column" },
    empty: { color: "fg.muted", [ICONIC]: { display: "none" }, textAlign: "center" },
    footer: BANDED,
    header: BANDED,
    nav: {
      alignItems: "center",
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) auto",
      minInlineSize: "0",

      "&[data-unmatched]:not(:has(.sidebar__empty))": { display: "none" },
      "& > *": { gridColumn: "1 / -1" },
    },
    navAction: {
      ...interactive(),
      _active: { background: "colorPalette.emphasized" },
      _hover: { background: "colorPalette.muted", color: "fg" },
      alignItems: "center",
      appearance: "none",
      background: "transparent",
      borderRadius: "l1",
      color: "fg.muted",
      display: "flex",
      flexShrink: "0",
      gridColumn: "2 / 3",
      [ICONIC]: { display: "none" },
      justifyContent: "center",
      padding: "0",
    },
    navHeading: {
      ...truncate(),
      alignItems: "center",
      color: "fg.subtle",
      display: "flex",
      fontWeight: "medium",
      gridColumn: "1 / 2",
      [ICONIC]: { srOnly: true },
      textTransform: "uppercase",
    },
    navLabel: {
      ...truncate(),
      alignItems: "center",
      color: "fg.subtle",
      display: "flex",
      fontWeight: "medium",
      gridColumn: "1 / 2",
      [ICONIC]: { srOnly: true },
      textStyle: "label.xs",
      textTransform: "uppercase",
    },
    root: {
      blockSize: "100%",
      display: "flex",
      flexDirection: "column",
      minBlockSize: "0",
      minInlineSize: "0",
    },
    scroller: { flex: "1", minBlockSize: "0" },
    search: {
      [ICONIC]: { display: "flex", justifyContent: "center" },
      inlineSize: "full",
      minInlineSize: "0",
    },
    separator: divider("horizontal"),
  },
  className: "sidebar",
  defaultVariants: { size: "md", variant: "plain" },
  jsx: [/^Sidebar(\.\w+)?$/u],
  slots: [
    "root",
    "header",
    "scroller",
    "content",
    "footer",
    "nav",
    "navLabel",
    "navHeading",
    "navAction",
    "search",
    "empty",
    "separator",
  ],
  variants: {
    size: onSlots({
      /**
       * The blocks are three to four times as far apart as the rows inside them, so each block
       * reads as its own group. A separator between two blocks sets no margin of its own, so the
       * gap on either side of it is the block gap.
       */
      content: sizeVariants(
        (size) => ({
          "& > .sidebar__separator": { marginBlock: "0" },
          gap: dense(`{spacing.gap.${BLOCKS[size]}}`),
          padding: dense(`{spacing.gap.${size}}`),
        }),
        ["sm", "md", "lg"],
      ),
      empty: sizeVariants(
        (size) => ({ padding: dense(`{spacing.inset.${size}}`), textStyle: `body.${size}` }),
        ["sm", "md", "lg"],
      ),
      footer: sizeVariants(banded, ["sm", "md", "lg"]),
      header: sizeVariants(banded, ["sm", "md", "lg"]),

      /**
       * The label and the first row are as far apart as two rows.
       */
      nav: sizeVariants(
        (size) => ({ gap: dense(`{spacing.gap.${below(below(size))}}`) }),
        ["sm", "md", "lg"],
      ),

      /**
       * The block's control is a square in the rows' end column, with the rows' end inset after
       * it and an icon the size of a row's leading icon.
       */
      navAction: sizeVariants(
        (size) => ({
          "& > svg": { boxSize: dense(`{sizes.icon.${below(size)}}`) },
          blockSize: squared(size),
          marginInlineEnd: marked(size),
          minInlineSize: squared(size),
        }),
        ["sm", "md", "lg"],
      ),
      navHeading: sizeVariants(
        (size) => ({
          marginBlockEnd: `calc(${dense(`{spacing.gap.${size}}`)} * -0.5)`,
          paddingBlock: dense("{spacing.gap.xs}"),
          paddingInline: marked(size),
          textStyle: "label.xs",
        }),
        ["sm", "md", "lg"],
      ),

      /**
       * The label is as tall as a row of the navigation list, so it reads as the list's first row.
       */
      navLabel: sizeVariants(
        (size) => ({
          blockSize: `max({sizes.6}, ${dense(`{sizes.${ROWS[size]}}`)})`,
          paddingInline: marked(size),
        }),
        ["sm", "md", "lg"],
      ),

      /**
       * The search has zero inline padding, so the field is as wide as the rows under it.
       */
      search: sizeVariants(() => ({ paddingInline: "0" }), ["sm", "md", "lg"]),
      separator: sizeVariants(
        (size) => ({ marginBlock: dense(`{spacing.gap.${size}}`) }),
        ["sm", "md", "lg"],
      ),
    }),

    /**
     * The ground and the edge of the sidebar.
     *
     * @remarks
     *   `subtle` is a muted ground without an edge, for a sidebar inside an app shell panel. The
     *   shell renders the hairline between the panel and the page.
     */
    variant: onSlot("root", {
      subtle: { background: "bg.subtle" },

      surface: { ...surface(), borderRadius: "0" },

      outline: { borderColor: "border", borderInlineEndWidth: "hairline" },

      plain: { background: "transparent" },
    }),
  },
});
