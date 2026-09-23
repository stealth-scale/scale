/**
 * Declares the empty state slot recipe for the panel a surface renders when it has no content.
 *
 * @remarks
 *   `size` sets the panel's inset, the column's gap, the mark's box and the title's text style
 *   together. The mark is 32, 40 and 50px at `sm`, `md` and `lg`, above a 16, 18 and 20px title.
 *   With eight sizes on the icon and heading scales the mark measured 20px over a 20px title at
 *   `md`, and the title reached 83px at `4xl`. The mark has twice the column's gap below it, so
 *   the title and the description read as one group. The description stays at `body.sm` at every
 *   size. The recipe has no `palette` axis, because the panel is muted, and no `effect` axis,
 *   because it has no fill or border.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  onSlots,
  sizeVariants,
} from "@stealthscale/theme/authoring";

/**
 * Sizes the recipe offers.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Maps each size to the gap step one size larger: 8, 12 and 16px.
 */
const GAPS = { lg: "xl", md: "lg", sm: "md" };

/**
 * Maps each size to the icon and inset step of the mark and the panel: 32, 40 and 50px marks in
 * 24, 32 and 40px of inset.
 */
const MARKS = { lg: "3xl", md: "2xl", sm: "xl" };

/**
 * Empty state slot recipe, at the md size by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    content: {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      textAlign: "center",
    },
    description: { color: "fg.muted", textStyle: "body.sm" },
    indicator: {
      "& svg": { boxSize: "100%" },
      alignItems: "center",
      color: "fg.muted",
      display: "flex",
      justifyContent: "center",
    },
    root: {
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
      width: "full",
    },
    title: { fontWeight: "semibold" },
  },
  className: "empty-state",
  defaultVariants: { size: "md" },
  jsx: [/^EmptyState(\.\w+)?$/u],
  slots: ["root", "content", "indicator", "title", "description"],
  variants: {
    /**
     * The inset of the panel, the gap in the column, the box of the mark and the title's text
     * style.
     */
    size: onSlots({
      content: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${GAPS[size]}}`) }), SIZES),
      indicator: sizeVariants(
        (size) => ({
          boxSize: dense(`{sizes.icon.${MARKS[size]}}`),
          marginBlockEnd: dense(`{spacing.gap.${GAPS[size]}}`),
        }),
        SIZES,
      ),
      root: sizeVariants((size) => ({ padding: dense(`{spacing.inset.${MARKS[size]}}`) }), SIZES),
      title: sizeVariants((size) => ({ textStyle: `heading.${below(size)}` }), SIZES),
    }),
  },
});
