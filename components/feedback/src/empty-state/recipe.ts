/**
 * Declares the slot recipe an empty state is styled from, the panel a surface renders in place of
 * content it has none of.
 *
 * @remarks
 *   Five slots, each separately styled so that a caller can order and omit them: `root` is the
 *   panel, `content` centres a column inside it, `indicator` holds the icon, and `title` and
 *   `description` carry the copy. `size` is the only variant, and it drives four scales at once:
 *   the panel's inset, the column's gap, the icon's box and the title's type step. That puts a
 *   compact empty state in a side panel and a full-page one a single value apart. The description
 *   is deliberately excluded from it, because body copy is read at the page's own size no matter
 *   how large the panel around it is.
 */

import {
  defineSlotRecipe,
  gapSizes,
  iconSizes,
  insetSizes,
  onSlots,
  textSizes,
} from "@stealthscale/theme/authoring";

/**
 * Styles an empty state, defaulting to a centred panel at the middle size.
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
     * The scale step the panel's inset, the column's gap, the icon's box and the title's type all
     * move together on.
     */
    size: onSlots({
      content: gapSizes(),
      indicator: iconSizes(),
      root: insetSizes(),
      title: textSizes("heading"),
    }),
  },
});
