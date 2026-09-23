/**
 * Defines the styles a sidebar is drawn with.
 *
 * @remarks
 *   Eleven parts. The root is the column, the header and footer are the bands that stay put, and
 *   the content between them is what scrolls. A nav is a block of destinations under a label, with
 *   an action beside it, and a heading over each list the block holds. The block is a grid of two
 *   columns rather than a plain column, because the action sits beside the label it belongs to and
 *   everything else in the block takes the whole width. Laid out as a column, the auto margin the
 *   action carried moved it to the end of a line of its own under the label, which read as a
 *   destination rather than as a control on the block's heading.
 *   The search narrows what the
 *   blocks hold, and the empty line stands where the search finds nothing. The content scrolls
 *   rather than the column, so a switcher at the head and an account at the foot stay where a
 *   reader left them however long the list of destinations is. `iconic` collapses the sidebar to a
 *   rail of marks. Every heading and the search go, because a heading with nothing under it that a
 *   reader can read says nothing, and the destinations keep their words out of sight so a screen
 *   reader still names each one. The sidebar states nothing about how wide it is: the shell around
 *   it decides that, and this reads the state.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  divider,
  onSlot,
  onSlots,
  type Scale,
  sizeVariants,
  surface,
  truncate,
} from "@stealthscale/theme/authoring";

/**
 * Selects a part inside a sidebar collapsed to a rail of marks.
 */
const ICONIC = "[data-iconic] &";

/**
 * Writes what the bands that stay put are drawn as: their own height, and their words kept for a
 * screen reader once the column is a rail.
 *
 * @remarks
 *   A rail is as wide as the marks it holds. The head and the foot were the two bands that kept
 *   their words there, so the name of the workspace and the name of the reader held a rail open to
 *   the width of a column and nothing about it read as a rail.
 *   The words go out of sight rather than out of the document: the head names the workspace and the
 *   foot names who is signed in, and neither is something a rail should stop announcing. A caller
 *   states them in an element, because a bare text node is no child a selector reaches.
 */
const BANDED = {
  ...truncate(),
  alignItems: "center",
  display: "flex",
  flexShrink: "0",
  [ICONIC]: { "& > :not(svg)": { srOnly: true }, justifyContent: "center" },
};

/**
 * The room a row leaves before its own mark, which every band of the column lines up with.
 *
 * @remarks
 *   A row is drawn by the navigation list rather than here, and it insets its mark by one step
 *   under the step it is read at. The bands of the column are this recipe's, so this is where the
 *   two are kept the same. Written as one function because three slots read it and a second copy
 *   of the arithmetic drifts from the first.
 */
function marked(size: Scale): string {
  return dense(`{spacing.inset.${below(size)}}`);
}

/**
 * Writes the inset a band outside the scrolling middle takes, so its mark starts in the column the
 * rows' marks start in.
 *
 * @remarks
 *   The head and the foot are siblings of the middle rather than children of it, so they keep the
 *   middle's own room as well as the row's. Drawn with the middle's room alone they stood a row's
 *   inset to the left of every row: measured at 8 pixels from the column's edge against the rows'
 *   20 and the block labels' 24, which is three columns in a panel 320 wide.
 */
function banded(size: Scale): string {
  return `calc(${dense(`{spacing.gap.${size}}`)} + ${marked(size)})`;
}

/**
 * Draws a plain sidebar at the middle size.
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
    navAction: { flexShrink: "0", gridColumn: "2 / 3", [ICONIC]: { display: "none" } },
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
       * The field the blocks are narrowed from takes no room of its own.
       *
       * @remarks
       *   It is a box, and so is every row under it, and the middle of the column already keeps
       *   room round both. A second inset here stood the field 8 pixels inside the rows it narrows.
       */
      search: sizeVariants(() => ({ paddingInline: "0" }), ["sm", "md", "lg"]),
      separator: sizeVariants(
        (size) => ({ marginBlock: dense(`{spacing.gap.${size}}`) }),
        ["sm", "md", "lg"],
      ),
    }),

    /**
     * How the column is set against the screen around it.
     *
     * @remarks
     *   `subtle` is the muted ground and no line, for a sidebar inside a shell panel. The shell
     *   draws the hairline between the panel and the page, so a line here would be a second one.
     */
    variant: onSlot("root", {
      subtle: { background: "bg.subtle" },

      surface: { ...surface(), borderRadius: "0" },

      outline: { borderColor: "border", borderInlineEndWidth: "hairline" },

      plain: { background: "transparent" },
    }),
  },
});
