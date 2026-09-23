/**
 * Declares the slot recipe of the status, a colored dot next to a word that reports a current
 * state.
 *
 * @remarks
 *   The dot is `0.64em` and the gap `0.5em`, so both scale with the word at every size and inside
 *   any text. The root aligns its items on the word's baseline and the dot centres itself, so the
 *   word shares the baseline of the text around it. With the items centred, the root took its
 *   baseline from the dot and the word rendered below the line. The dot is the palette's `solid`,
 *   which the theme engine holds at 3:1 against the page. `forcedColorAdjust: none` keeps its color
 *   in forced colors mode. The word carries the meaning, so the status is readable without the
 *   color.
 */

import {
  below,
  defineSlotRecipe,
  onSlot,
  PALETTES,
  paletteVariants,
  sizeVariants,
} from "@stealthscale/theme/authoring";

/**
 * Styles a status at the middle size in the neutral palette.
 */
export const recipe = defineSlotRecipe({
  base: {
    indicator: {
      alignSelf: "center",
      background: "colorPalette.solid",
      blockSize: "0.64em",
      borderRadius: "full",
      flexShrink: "0",
      forcedColorAdjust: "none",
      inlineSize: "0.64em",
    },
    root: {
      alignItems: "baseline",
      colorPalette: "neutral",
      display: "inline-flex",
      gap: "0.5em",
      whiteSpace: "nowrap",
    },
  },
  className: "status",
  defaultVariants: { size: "md" },
  jsx: [/^Status\.(Root|Indicator)$/u],
  slots: ["root", "indicator"],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * The halo around the dot, in the palette's solid at half opacity.
     *
     * @remarks
     *   `pulse` animates the halo, the usual signal for a live connection, and stops when the
     *   reader prefers reduced motion.
     */
    effect: onSlot("indicator", {
      glow: { layerStyle: "glow.sm" },
      pulse: { animationStyle: "pulse-glow", boxShadowColor: "colorPalette.solid/50" },
    }),

    /**
     * The palette the dot is drawn in.
     *
     * @remarks
     *   The caller maps each of its states to a palette, so the axis offers all eight semantic
     *   palettes and not the four statuses alone.
     */
    palette: onSlot("root", paletteVariants()),

    /**
     * The label text style, one size smaller than the status's size, or the surrounding text's
     * font.
     *
     * @remarks
     *   `inherit` is for a status inside running text. At `md` the word measured 14px inside 16px
     *   body text.
     */
    size: onSlot("root", {
      ...sizeVariants((size) => ({ textStyle: `label.${below(size)}` }), ["sm", "md", "lg"]),
      inherit: { fontSize: "inherit", fontWeight: "inherit", lineHeight: "inherit" },
    }),
  },
});
