/**
 * States what a list is: a column of entries the browser marks or the caller marks, at a gap,
 * with each entry's mark aligned to its lines, entering with a motion where a page wants one.
 *
 * @remarks
 *   Every value is a semantic gap, the marker gutter, a foreground role or an animation style, so
 *   a theme moves all of them. The root takes the variants and every part draws its slot in them.
 *   The marker look restores the browser's markers, which the compiler's reset removes, and lays
 *   the entries in from the gutter the foundation states for a marker, and the plain look leaves
 *   each entry a row so an indicator of the caller's own sits beside the text.
 *   Which element the root draws is the whole of the difference between a bulleted and a numbered
 *   list, and a caller chooses it with `as`. A marker picks the glyph or the numbering the browser
 *   draws, and is set on the entry rather than the root, because the marker look restores the
 *   root's list style with the shorthand and a type on the root would lose to it.
 */

import {
  defineSlotRecipe,
  dense,
  gapSizes,
  motionVariants,
  onSlot,
} from "@stealthscale/theme/authoring";

/**
 * Draws a list with the browser's markers at the middle gap until a caller says otherwise, with
 * no motion until a caller asks for one.
 */
export const recipe = defineSlotRecipe({
  base: {
    indicator: {
      display: "inline-block",
      flexShrink: "0",
      marginInlineEnd: dense("{spacing.gap.xs}"),
      verticalAlign: "middle",
    },
    item: { display: "list-item", whiteSpace: "normal" },
    root: { display: "flex", flexDirection: "column" },
  },
  className: "list",
  defaultVariants: { gap: "md", variant: "marker" },
  jsx: [/^List(\.\w+)?$/u],
  slots: ["root", "item", "indicator"],
  variants: {
    align: {
      start: { item: { alignItems: "flex-start" } },

      center: { item: { alignItems: "center" } },

      end: { item: { alignItems: "flex-end" } },
    },
    gap: onSlot("root", gapSizes()),
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
    motion: onSlot("item", motionVariants(["rise", "reveal"])),
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
