/**
 * Styles inline code: its look, size and palette.
 *
 * @remarks
 *   Every value reads a code text style, a layer style, an inset token or a palette. The looks read
 *   the `flat` layer styles, so a palette sets the fill, the edge and the text together. Numerals
 *   are tabular, so a column of snippets keeps its alignment. `staticCss` lists every palette,
 *   because data can set the value at run time.
 */

import {
  below,
  defineRecipe,
  dense,
  flatVariants,
  PALETTES,
  paletteVariants,
  sizeVariants,
} from "@stealthscale/theme/authoring";

/**
 * Draws a `CanvasText` hairline on the padding edge, for a look whose fill forced colours remove.
 */
const OUTLINED = {
  outlineColor: "CanvasText",
  outlineOffset: "calc({borderWidths.hairline} * -1)",
  outlineStyle: "solid",
  outlineWidth: "hairline",
};

/**
 * Defaults to the subtle look at `md` in the neutral palette.
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
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Semantic palette of the fill, the edge and the text.
     */
    palette: paletteVariants(),

    /**
     * Step of the code text style, with inline padding from the inset one size smaller.
     */
    size: sizeVariants(
      (size) => ({
        paddingInline: dense(`{spacing.inset.${below(size)}}`),
        textStyle: `code.${size}`,
      }),
      ["sm", "md"],
    ),

    /**
     * Look of the snippet.
     *
     * @remarks
     *   `solid` and `subtle` have no edge, so they draw a `CanvasText` hairline in forced colours,
     *   where the fill is removed. `plain` sets no inline padding, because it renders no fill, so a
     *   column of plain snippets starts at the same x as the text above and below it.
     */
    variant: {
      solid: { _highContrast: OUTLINED, layerStyle: "flat.solid" },
      subtle: { _highContrast: OUTLINED, layerStyle: "flat.subtle" },
      ...flatVariants(["surface", "outline"]),
      plain: { layerStyle: "flat.plain", paddingInline: "0" },
    },
  },
});
