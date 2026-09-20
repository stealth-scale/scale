/**
 * Defines the styles a sidebar is drawn with.
 *
 * @remarks
 *   Ten parts. The root is the column, the header and footer are the bands that stay put, and the
 *   content between them is what scrolls. A nav is a block of destinations under a heading, with an
 *   action beside it. The search narrows what the blocks hold, and the empty line stands where the
 *   search finds nothing. The content scrolls rather than the column, so a switcher at the head and
 *   an account at the foot stay where a reader left them however long the list of destinations is.
 *   `iconic` collapses the sidebar to a rail of marks. Every heading and the search go, because a
 *   heading with nothing under it that a reader can read says nothing, and the destinations keep
 *   their words out of sight so a screen reader still names each one. The sidebar states nothing
 *   about how wide it is: the shell around it decides that, and this reads the state.
 */

import {
  defineSlotRecipe,
  dense,
  divider,
  onSlot,
  onSlots,
  sizeVariants,
  surface,
  truncate,
} from "@stealthscale/theme/authoring";

/**
 * Selects a part inside a sidebar collapsed to a rail of marks.
 */
const ICONIC = "[data-iconic] &";

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
    footer: { flexShrink: "0" },
    header: { flexShrink: "0" },
    nav: { display: "flex", flexDirection: "column", minInlineSize: "0" },
    navAction: { flexShrink: "0", [ICONIC]: { display: "none" }, marginInlineStart: "auto" },
    navLabel: {
      ...truncate(),
      alignItems: "center",
      color: "fg.muted",
      display: "flex",
      fontWeight: "medium",
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
        (size) => ({ padding: dense(`{spacing.gap.${size}}`) }),
        ["sm", "md", "lg"],
      ),
      header: sizeVariants(
        (size) => ({ padding: dense(`{spacing.gap.${size}}`) }),
        ["sm", "md", "lg"],
      ),
      nav: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${size}}`) }), ["sm", "md", "lg"]),
      navLabel: sizeVariants(
        (size) => ({
          blockSize: dense(`{sizes.tag.${size}}`),
          paddingInline: dense(`{spacing.inset.${size}}`),
          textStyle: `label.${size}`,
        }),
        ["sm", "md", "lg"],
      ),
      search: sizeVariants(
        (size) => ({ paddingInline: dense(`{spacing.gap.${size}}`) }),
        ["sm", "md", "lg"],
      ),
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
