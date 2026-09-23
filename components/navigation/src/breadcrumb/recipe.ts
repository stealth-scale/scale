/**
 * Declares the breadcrumb slot recipe for an ordered list of links from the site root to the
 * current page, with a separator between each pair.
 *
 * @remarks
 *   The separator is a list row between two items, so a screen reader counts the crumbs without
 *   the separators. The size axis sets the text style on the root and the gap on the list, and
 *   every part inherits the text size. The axis stops at `xl`, because it reads the body text
 *   style. The links are muted and the current page is in the default ink. The recipe has no
 *   `palette` axis, because a trail has no color of its own. It has no `effect` axis, because it
 *   has no box.
 */

import {
  defineSlotRecipe,
  dense,
  gapSizes,
  onSlots,
  textSizes,
} from "@stealthscale/theme/authoring";

/**
 * Breadcrumb slot recipe, at the md size in the plain look by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    currentLink: { alignItems: "center", display: "inline-flex", gap: dense("{spacing.gap.xs}") },
    ellipsis: { alignItems: "center", color: "fg.muted", display: "inline-flex" },
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
  slots: ["root", "list", "item", "link", "currentLink", "ellipsis", "separator"],
  variants: {
    /**
     * The text style of the root and the gap between list rows.
     */
    size: onSlots({ list: gapSizes(["xs", "sm", "md", "lg", "xl"]), root: textSizes("body") }),

    /**
     * Whether the links show an underline at rest or only on hover.
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
