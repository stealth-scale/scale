/**
 * Declares the sidebar's slot recipe, which lays out a fixed header, scrolling content and a fixed
 * footer in a column.
 *
 * @remarks
 *   The recipe has eleven slots. The content scrolls and the root does not, so the header and the
 *   footer remain in place however long the list of destinations is. A nav block is a grid of two
 *   columns: the label and the headings take the first, the block's control takes the second, and
 *   every other child spans both. `iconic` collapses the sidebar to a rail of icons. The labels,
 *   the headings and the words in the header and footer are hidden visually and kept for screen
 *   readers, and the search, the empty message and the block's control are removed. The app shell
 *   sets the sidebar's width, and the caller passes `iconic` while the shell's panel is collapsed
 *   to icons. The recipe has no `palette` and no `effect` axis: its looks are neutral grounds, and
 *   the navigation list inside it offers its own palette and effect for the current row.
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
  truncate,
} from "@stealthscale/theme/authoring";

/**
 * Selects a part inside a sidebar collapsed to a rail.
 */
const ICONIC = "[data-iconic] &";

/**
 * Styles the header and the footer as a row that keeps its height and hides its words visually on
 * a rail.
 *
 * @remarks
 *   On a rail only the icon remains visible, so the rail is as wide as its icons. The words remain
 *   in the accessibility tree, because the header's words identify the workspace and the footer's
 *   words identify the signed-in person. A caller wraps the words in an element, because the
 *   selector matches element children only.
 */
const BANDED = {
  ...truncate(),
  alignItems: "center",
  display: "flex",
  flexShrink: "0",
  [ICONIC]: { "& > :not(svg)": { srOnly: true }, justifyContent: "center" },
};

/**
 * Returns the inline inset of a navigation list row at the sidebar's size.
 *
 * @remarks
 *   The navigation list insets a row by `spacing.inset` one size smaller than the row. The labels,
 *   the headings and the block's control use the same inset, so their text and icons start and end
 *   where the rows' do: 8, 12 and 16px at `sm`, `md` and `lg`.
 * @param size - The sidebar's size.
 * @returns The inset, multiplied by the density.
 */
function marked(size: Scale): string {
  return dense(`{spacing.inset.${below(size)}}`);
}

/**
 * Returns the inline padding of the header and the footer.
 *
 * @remarks
 *   The header and the footer are siblings of the content, so their padding is the content's
 *   padding plus a row's inset. Their icons then start where the rows' icons start: 20px from the
 *   sidebar's edge at `md`.
 * @param size - The sidebar's size.
 * @returns The padding, multiplied by the density.
 */
function banded(size: Scale): string {
  return `calc(${dense(`{spacing.gap.${size}}`)} + ${marked(size)})`;
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
 * Styles a plain sidebar at the middle size.
 */
export const recipe = defineSlotRecipe({
  base: {
    content: {
      display: "flex",
      flex: "1",
      flexDirection: "column",
      minBlockSize: "0",
      overflowY: "auto",
    },
    empty: { color: "fg.muted", [ICONIC]: { display: "none" }, textAlign: "center" },
    footer: { ...BANDED },
    header: { ...BANDED },
    nav: {
      alignItems: "center",
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) auto",
      minInlineSize: "0",

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
      color: "fg.muted",
      display: "flex",
      fontWeight: "medium",
      gridColumn: "1 / 2",
      [ICONIC]: { srOnly: true },
    },
    root: {
      blockSize: "100%",
      display: "flex",
      flexDirection: "column",
      minBlockSize: "0",
      minInlineSize: "0",
    },
    search: { [ICONIC]: { display: "none" } },
    separator: divider("horizontal"),
  },
  className: "sidebar",
  defaultVariants: { size: "md", variant: "plain" },
  jsx: [/^Sidebar(\.\w+)?$/u],
  slots: [
    "root",
    "header",
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
      content: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${size}}`),
          padding: dense(`{spacing.gap.${size}}`),
        }),
        ["sm", "md", "lg"],
      ),
      empty: sizeVariants(
        (size) => ({ padding: dense(`{spacing.inset.${size}}`), textStyle: `body.${size}` }),
        ["sm", "md", "lg"],
      ),
      footer: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${below(size)}}`),
          paddingBlock: dense(`{spacing.gap.${size}}`),
          paddingInline: banded(size),
        }),
        ["sm", "md", "lg"],
      ),
      header: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${below(size)}}`),
          paddingBlock: dense(`{spacing.gap.${size}}`),
          paddingInline: banded(size),
        }),
        ["sm", "md", "lg"],
      ),
      nav: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${size}}`) }), ["sm", "md", "lg"]),

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
      navLabel: sizeVariants(
        (size) => ({
          blockSize: dense(`{sizes.tag.${size}}`),
          paddingInline: marked(size),
          textStyle: `label.${size}`,
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
