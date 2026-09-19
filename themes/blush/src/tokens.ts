/**
 * States the four colors Blush is drawn from, and the ramps drawn from them.
 *
 * @remarks
 *   The navy is the dark page and the light ink, the pink is the product, the petal is the quiet
 *   fill of the pink and the ink on the dark page, and the pearl is the light page. The grey ramp
 *   is drawn in the navy's hue, held to a low chroma so a grey control reads as grey beside the
 *   pink, and the pink redraws the pink ramp, so every other tint the theme needs is a tint of a
 *   color it states. Every other ramp is the foundation's.
 */

import { colorScale, scaleOf, type Tokens } from "@stealthscale/theme/authoring";

/**
 * Fixes the navy: the dark page, and the ink on the light one.
 */
export const NAVY = "#021A54";

/**
 * Fixes the pink the product is drawn in.
 */
export const PINK = "#FF85BB";

/**
 * Fixes the petal: the quiet fill of the pink, and the ink on the dark page.
 */
export const PETAL = "#FFCEE3";

/**
 * Fixes the pearl: the light page.
 */
export const PEARL = "#F5F5F5";

/**
 * Fixes the hue the grey ramp is tinted with, which is the navy's.
 */
const NEUTRAL = 263;

/**
 * Fixes how far the grey ramp goes from grey, well below the navy's own chroma.
 */
const TINT = 0.04;

/**
 * Lists the ramps the theme redraws, keyed as the foundation keys them.
 */
export const tokens: Tokens = {
  colors: { gray: colorScale(NEUTRAL, TINT), pink: scaleOf(PINK) },
};
