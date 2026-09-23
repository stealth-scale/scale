/**
 * Styles a highlight's look, palette, inline inset, corner, effect and entrance motion.
 *
 * @remarks
 *   The base clears the browser's highlight colours and sets `box-decoration-break: clone`, so a
 *   highlight that wraps repeats its inset and corners on every line. The base sets no
 *   `white-space`, because a highlight kept on one line scrolls horizontally at 320px, which fails
 *   WCAG 1.4.10. The filled looks read the `flat` layer styles, whose fill and ink pairs the
 *   theme's contrast gate measures in both colour modes. The inset sets `padding-inline` only,
 *   because block padding on an inline box overlaps the line above. `staticCss` lists every
 *   palette, because `MarkPropsProvider` and data can set the value at run time.
 */

import {
  cornerVariants,
  defineRecipe,
  dense,
  flatVariants,
  motionVariants,
  PALETTES,
  paletteVariants,
  sizeVariants,
} from "@stealthscale/theme/authoring";

/**
 * Defaults to the subtle look with the `xs` inset and the `l1` corner, in the inherited palette.
 *
 * @remarks
 *   The `tinted` compound sets the text to `colorPalette.fg` in the plain and text looks when a
 *   palette is set, because those looks have no fill to carry the palette.
 */
export const recipe = defineRecipe({
  base: { background: "transparent", boxDecorationBreak: "clone", color: "inherit" },
  className: "mark",
  compoundVariants: [
    {
      css: { color: "colorPalette.fg" },
      name: "tinted",
      palette: [...PALETTES],
      variant: ["plain", "text"],
    },
  ],
  defaultVariants: { inset: "xs", radius: "l1", variant: "subtle" },
  jsx: [/Mark$/u],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Effect around the highlight.
     *
     * @remarks
     *   `glow` reads the `glow.sm` layer style. `shine` reads `text.shine` and the `shimmer`
     *   animation style, which moves a highlight across the text.
     */
    effect: {
      glow: { layerStyle: "glow.sm" },
      shine: { animationStyle: "shimmer", layerStyle: "text.shine" },
    },

    /**
     * Inline padding from the inset scale. The plain and text looks set no padding.
     */
    inset: sizeVariants(
      (size) => ({ paddingInline: dense(`{spacing.inset.${size}}`) }),
      ["xs", "sm", "md"],
    ),

    /**
     * Entrance animation. Each value reads the theme's animation style of the same name.
     */
    motion: motionVariants(["fade", "rise", "reveal"]),

    /**
     * Semantic palette of the fill and the edge, and of the text in the plain and text looks.
     */
    palette: paletteVariants(),

    /**
     * Corner radius token.
     */
    radius: cornerVariants(),

    /**
     * Look of the highlight.
     *
     * @remarks
     *   The filled looks read the `flat` layer styles. `plain` restates the base, so its class
     *   matches a rule. `text` sets the medium weight in place of a fill, for a highlight that has
     *   to be distinguishable without colour. Both set no inline padding, because they render no
     *   box.
     */
    variant: {
      ...flatVariants(),
      plain: { background: "transparent", color: "inherit", paddingInline: "0" },
      text: { fontWeight: "medium", paddingInline: "0" },
    },
  },
});
