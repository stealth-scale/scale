/**
 * States the four colors Neon is drawn from, and the ramps drawn from them.
 *
 * @remarks
 *   The grape is the dark page and the light ink, the violet is the product, the pink stands
 *   beside it, and the yellow is the ink on the dark page and the accent. The grey ramp is drawn
 *   in the grape's hue, held to a low chroma so a grey control reads as grey beside the violet,
 *   and the violet, the pink and the yellow redraw the ramps of their own hues, so every other tint
 *   the theme needs is a tint of a color it states. Every other ramp is the foundation's.
 */

import { colorScale, scaleOf, type Tokens } from "@stealthscale/theme/authoring";

/**
 * Fixes the grape: the dark page, and the ink on the light one.
 */
export const GRAPE = "#450693";

/**
 * Fixes the violet the product is drawn in.
 */
export const VIOLET = "#8C00FF";

/**
 * Fixes the pink beside the violet.
 */
export const PINK = "#FF3F7F";

/**
 * Fixes the yellow: the ink on the dark page, and the accent.
 */
export const YELLOW = "#FFC400";

/**
 * Fixes the hue the grey ramp is tinted with, which is the grape's.
 */
const NEUTRAL = 292;

/**
 * Fixes how far the grey ramp goes from grey, well below the grape's own chroma.
 */
const TINT = 0.04;

/**
 * Lists the ramps the theme redraws, keyed as the foundation keys them.
 */
export const tokens: Tokens = {
  colors: {
    gray: colorScale(NEUTRAL, TINT),
    pink: scaleOf(PINK),
    purple: scaleOf(VIOLET),
    yellow: scaleOf(YELLOW),
  },
};
