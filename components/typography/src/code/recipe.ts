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

    /**
     * How the snippet is set off from the line it sits in.
     *
     * @remarks
     *   The plain look drops the room the size gives, because that room is there to hold a fill off
     *   the words and the plain look paints none. Kept, it pushes the snippet a step to the right
     *   of whatever sits above and below it, which a column of types in a table reads as one row
     *   indented.
     */
    variant: {
      ...flatVariants(["solid", "subtle", "surface", "outline", "plain"]),
      plain: { layerStyle: "flat.plain", paddingInline: "0" },
    },
  },
});
