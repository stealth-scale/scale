/**
 * Declares the badge recipe for a short label or a count set off from what it labels.
 *
 * @remarks
 *   The looks are the flat layer styles, so a badge does not repaint on hover, including inside a
 *   hoverable row. Numerals are tabular, so a column of changing counts keeps its width. The text
 *   does not wrap and the badge does not shrink in a flex row. The sizes come from `chipSize`,
 *   shared with the tag. An `svg` child is 1em square and does not shrink, so an icon matches the
 *   text at every size. At `md` a lucide icon's ink starts 8.6px from the edge, against the 8px
 *   inline padding at the text end. `staticCss` lists every palette, because `BadgePropsProvider`
 *   and data can set the value at run time.
 */

import {
  cornerVariants,
  defineRecipe,
  flatVariants,
  PALETTES,
  paletteVariants,
  sizeVariants,
} from "@stealthscale/theme/authoring";

import { CHIP_SIZES, chipSize } from "#chip.ts";

/**
 * Badge recipe, the subtle look at the md size with the l2 corner in the primary palette by
 * default.
 */
export const recipe = defineRecipe({
  base: {
    _highContrast: {
      outlineColor: "CanvasText",
      outlineOffset: "calc({borderWidths.hairline} * -1)",
      outlineStyle: "solid",
      outlineWidth: "hairline",
    },
    "& > svg": { blockSize: "1em", flexShrink: "0", inlineSize: "1em" },
    alignItems: "center",
    colorPalette: "primary",
    display: "inline-flex",
    flexShrink: "0",
    fontVariantNumeric: "tabular-nums",
    fontWeight: "medium",
    justifyContent: "center",
    userSelect: "none",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  },
  className: "badge",
  defaultVariants: { radius: "l2", size: "md", variant: "subtle" },
  jsx: [/Badge$/u],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * The halo around the badge, in the palette's solid at half opacity.
     *
     * @remarks
     *   `pulse` animates the halo and stops under reduced motion.
     */
    effect: {
      glow: { layerStyle: "glow.sm" },
      pulse: { animationStyle: "pulse-glow", boxShadowColor: "colorPalette.solid/50" },
    },
    palette: paletteVariants(),
    radius: cornerVariants(),

    /**
     * The height, padding, gap and text style from `chipSize`, shared with the tag.
     */
    size: sizeVariants(chipSize, CHIP_SIZES),
    variant: flatVariants(),
  },
});
