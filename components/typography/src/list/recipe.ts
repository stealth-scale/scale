/**
 * Styles a list's root, items and indicators: look, marker, gap, alignment and entrance motion.
 *
 * @remarks
 *   Every value reads a gap token, the `marker` gutter, a foreground token or an animation style.
 *   The `marker` look restores the browser's markers, which the compiler's reset removes, and
 *   indents the items by the gutter. The `plain` look removes the markers and lays each item out
 *   as a row, so a `List.Indicator` renders the mark beside the text. `as="ol"` numbers the items.
 *   The marker type is set on the item, because the `marker` look sets the root's `list-style`
 *   shorthand, which overrides a type on the root. The recipe has no `palette` axis, because the
 *   markers take the muted text ink, and no `effect` axis, because a list renders no box.
 */

import {
  defineSlotRecipe,
  dense,
  gapSizes,
  motionVariants,
  onSlot,
} from "@stealthscale/theme/authoring";

/**
 * Defaults to the browser's markers at the `md` gap, with no motion.
 *
 * @remarks
 *   An indicator is one line of the item tall and centres its content, so a mark centres on the
 *   first line of a wrapped item. An `svg` inside it is `1em`, the height of the item's text.
 */
export const recipe = defineSlotRecipe({
  base: {
    indicator: {
      "& > svg": { boxSize: "1em", flexShrink: "0" },
      alignItems: "center",
      display: "inline-flex",
      flexShrink: "0",
      height: "1lh",
      marginInlineEnd: dense("{spacing.gap.sm}"),
    },
    item: { display: "list-item", whiteSpace: "normal" },
    root: { display: "flex", flexDirection: "column" },
  },
  className: "list",
  defaultVariants: { gap: "md", variant: "marker" },
  jsx: [/^List(\.\w+)?$/u],
  slots: ["root", "item", "indicator"],
  variants: {
    /**
     * Block alignment of an item's indicator against its text, in the `plain` look.
     */
    align: {
      start: { item: { alignItems: "flex-start" } },

      center: { item: { alignItems: "center" } },

      end: { item: { alignItems: "flex-end" } },
    },

    /**
     * Gap token between the items.
     */
    gap: onSlot("root", gapSizes()),

    /**
     * Browser marker type of the items, in the `marker` look.
     */
    marker: {
      circle: { item: { listStyleType: "circle" } },
      dash: { item: { listStyleType: '"– "' } },
      decimal: { item: { listStyleType: "decimal" } },
      disc: { item: { listStyleType: "disc" } },
      "leading-zero": { item: { listStyleType: "decimal-leading-zero" } },
      "lower-alpha": { item: { listStyleType: "lower-alpha" } },
      "lower-greek": { item: { listStyleType: "lower-greek" } },
      "lower-roman": { item: { listStyleType: "lower-roman" } },
      square: { item: { listStyleType: "square" } },
      "upper-alpha": { item: { listStyleType: "upper-alpha" } },
      "upper-roman": { item: { listStyleType: "upper-roman" } },
    },

    /**
     * Entrance animation of each item. Each value reads the theme's animation style of the same
     * name.
     */
    motion: onSlot("item", motionVariants(["rise", "reveal"])),

    /**
     * Look of the list.
     *
     * @remarks
     *   `marker` renders the browser's markers in the muted ink. `plain` renders none, and each
     *   item is a row for its `List.Indicator`.
     */
    variant: {
      marker: {
        item: { _marker: { color: "fg.muted" } },
        root: { listStyle: "revert", paddingInlineStart: "marker" },
      },
      plain: {
        item: { alignItems: "flex-start", display: "inline-flex" },
      },
    },
  },
});
