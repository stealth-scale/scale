/**
 * States what inline code is: a snippet set in the code role inside a line, in a look and a size,
 * in the palette of its status.
 *
 * @remarks
 *   Every value is a code role, a layer style, a semantic inset or a palette, so a theme moves all
 *   of them. The looks read the palette's roles through the foundation's layer styles, and the
 *   status axis points the palette at an intent, so an error snippet and a plain one are one
 *   recipe. Tabular figures keep a column of snippets aligned.
 */

import {
  defineRecipe,
  dense,
  flatVariants,
  statusEmitted,
  statusVariants,
} from "@stealthscale/theme/authoring";

/**
 * Draws a snippet on the neutral palette in the subtle look and the middle size until a caller
 * says otherwise, set inline so it sits in the line around it.
 */
export const recipe = defineRecipe({
  base: {
    alignItems: "center",
    borderRadius: "l1",
    colorPalette: "neutral",
    display: "inline-flex",
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
  },
  className: "code",
  defaultVariants: { size: "md", variant: "subtle" },
  jsx: [/Code$/u],
  staticCss: [statusEmitted()],
  variants: {
    size: {
      md: { paddingInline: dense("{spacing.inset.sm}"), textStyle: "code.md" },
      sm: { paddingInline: dense("{spacing.inset.xs}"), textStyle: "code.sm" },
    },
    status: statusVariants(),
    variant: flatVariants(["solid", "subtle", "surface", "outline", "plain"]),
  },
});
