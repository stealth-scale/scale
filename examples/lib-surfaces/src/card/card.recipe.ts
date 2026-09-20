/**
 * States what a card is: a panel holding a header, a content band and a footer, drawn in a look
 * and a size.
 *
 * @remarks
 *   Every value is a semantic token, a layer style or a text style, so a theme moves all of them.
 *   The root wears the surface, the corner and the look. A size sets the root's inset and gap and
 *   the header's heading, so the header carries a size class of its own, which is how a theme
 *   addresses one band at one size.
 */

import { defineSlotRecipe, surface } from "@stealthscale/theme/authoring";

/**
 * Draws a card: a column of bands on the panel surface, in a look and a size, elevated and
 * medium until a caller says otherwise.
 */
export const recipe = defineSlotRecipe({
  base: {
    content: { display: "flex", flexDirection: "column", gap: "gap.sm", textStyle: "body.md" },
    footer: {
      alignItems: "center",
      display: "flex",
      flexWrap: "wrap",
      gap: "gap.sm",
      justifyContent: "flex-end",
    },
    header: { display: "flex", flexDirection: "column", gap: "gap.xs" },
    root: { ...surface(), display: "flex", flexDirection: "column", overflow: "hidden" },
  },
  className: "card",
  defaultVariants: { size: "md", variant: "elevated" },
  jsx: [/^Card(\.\w+)?$/u],
  slots: ["root", "header", "content", "footer"],
  variants: {
    size: {
      sm: { header: { textStyle: "label.lg" }, root: { gap: "gap.sm", padding: "inset.sm" } },

      md: { header: { textStyle: "heading.sm" }, root: { gap: "gap.md", padding: "inset.md" } },

      lg: { header: { textStyle: "heading.md" }, root: { gap: "gap.lg", padding: "inset.lg" } },
    },
    variant: {
      elevated: { root: { borderColor: "transparent", boxShadow: "md" } },
      outline: { root: { boxShadow: "none" } },
      subtle: { root: { background: "bg.subtle", borderColor: "transparent", boxShadow: "none" } },
    },
  },
});
