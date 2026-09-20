/**
 * States what a breadcrumb trail is: the path from the front of a site to the page a person is on,
 * drawn as a list of links with a mark between each pair.
 *
 * @remarks
 *   Six parts. The root is the landmark, the list holds the trail, and each crumb is an item
 *   holding either a link to somewhere above or the name of the page itself. A separator sits
 *   between two crumbs as a row of the list rather than inside one, which is how a screen reader
 *   counts the crumbs rather than counting them twice.
 *   The size axis sets the text on the root and the gap on the list, so every part reads at one
 *   size by inheriting it and only the spacing is stated twice. It stops at `xl` because it reads
 *   the body role, and a trail is read at the size the page around it is read at rather than as a
 *   heading.
 *   The trail is quieter than the page it sits above: the links are muted and darken under a
 *   pointer, and the crumb for the page itself is the one at full strength. That is the way round
 *   a reader needs, because the one crumb that is not a link is the one naming where they are.
 */

import {
  defineSlotRecipe,
  dense,
  gapSizes,
  onSlots,
  textSizes,
} from "@stealthscale/theme/authoring";

/**
 * Draws a muted trail at the middle size until a caller says otherwise.
 */
export const recipe = defineSlotRecipe({
  base: {
    currentLink: { alignItems: "center", display: "inline-flex", gap: dense("{spacing.gap.xs}") },
    item: { alignItems: "center", display: "inline-flex" },
    link: {
      alignItems: "center",
      borderRadius: "l1",
      cursor: "button",
      display: "inline-flex",
      focusRingColor: "colorPalette.focusRing",
      focusVisibleRing: "outside",
      gap: dense("{spacing.gap.xs}"),
      textDecoration: "none",
    },
    list: {
      alignItems: "center",
      display: "flex",
      flexWrap: "wrap",
      listStyle: "none",
      margin: "0",
      padding: "0",
      wordBreak: "break-word",
    },
    separator: { _rtl: { rotate: "180deg" }, color: "fg.muted" },
  },
  className: "breadcrumb",
  defaultVariants: { size: "md", variant: "plain" },
  jsx: [/^Breadcrumb(\.\w+)?$/u],
  slots: ["root", "list", "item", "link", "currentLink", "separator"],
  variants: {
    /**
     * How big the trail is read at, which every part inherits from the root.
     */
    size: onSlots({ list: gapSizes(["xs", "sm", "md", "lg", "xl"]), root: textSizes("body") }),

    /**
     * Whether a crumb above the page is underlined at rest or only under a pointer.
     */
    variant: {
      plain: {
        currentLink: { color: "fg" },
        link: { _hover: { color: "fg", textDecoration: "underline" }, color: "fg.muted" },
      },
      underline: {
        currentLink: { color: "fg" },
        link: { _hover: { color: "fg" }, color: "fg.muted", textDecoration: "underline" },
      },
    },
  },
});
