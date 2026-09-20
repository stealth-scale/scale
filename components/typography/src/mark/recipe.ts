/**
 * Defines the styles a mark element is drawn with.
 *
 * @remarks
 *   The base clears the browser's own highlight colours, which no theme reaches, and clones the
 *   box decoration so a fill that runs onto a second line carries its inset and its corners onto
 *   both. The base sets no `whiteSpace`. A marked phrase held on one line forces a horizontal
 *   scroll at 320 pixels, which WCAG 1.4.10 fails. The filled looks read the `flat` layer styles,
 *   whose background and ink are the palette pairs the contrast gate measures, so a highlight
 *   clears the text ratio in both color modes. The inset writes `paddingInline` alone, because
 *   block padding on an inline box overflows into the line above rather than opening the line.
 *   The defaults draw a finished highlight: a subtle fill, the tightest inset and the tightest
 *   corner. A mark with nothing picked sits off the glyphs rather than running against them.
 */

import {
  cornerVariants,
  defineRecipe,
  dense,
  flatVariants,
  motionVariants,
  sizeVariants,
  statusEmitted,
  statusVariants,
} from "@stealthscale/theme/authoring";

/**
 * Draws a highlight in the subtle look until a caller states another.
 */
export const recipe = defineRecipe({
  base: { background: "transparent", boxDecorationBreak: "clone", color: "inherit" },
  className: "mark",
  compoundVariants: [
    {
      css: { color: "colorPalette.fg" },
      name: "tinted",
      status: ["error", "info", "success", "warning"],
      variant: ["plain", "text"],
    },
  ],
  defaultVariants: { inset: "xs", radius: "l1", variant: "subtle" },
  jsx: [/Mark$/u],
  staticCss: [statusEmitted()],
  variants: {
    /**
     * A highlight that asks to be noticed beyond its fill.
     */
    effect: {
      glow: { layerStyle: "glow.sm" },
      shine: { animationStyle: "shimmer", layerStyle: "text.shine" },
    },

    /**
     * How much room the fill leaves round the words, on the inline axis alone.
     */
    inset: sizeVariants(
      (size) => ({ paddingInline: dense(`{spacing.inset.${size}}`) }),
      ["xs", "sm", "md"],
    ),

    motion: motionVariants(["fade", "rise", "reveal"]),
    radius: cornerVariants(),
    status: statusVariants(),

    /**
     * How the words are picked out. The plain value restates the base, so its class reaches a
     * rule, and the text value picks them out by weight where a fill would be too loud.
     */
    variant: {
      ...flatVariants(),
      plain: { background: "transparent", color: "inherit" },
      text: { fontWeight: "medium" },
    },
  },
});
