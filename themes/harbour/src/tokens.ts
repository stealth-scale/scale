/**
 * States the four colors Harbour is drawn from, and the ramps drawn from them.
 *
 * @remarks
 *   The navy is the dark page and the light ink, the deep blue is the panel on the dark page, the
 *   steel blue is the product, and the mist is the light page and the dark ink. The grey ramp is
 *   drawn in the navy's hue at its chroma, the steel blue redraws the blue ramp and the deep blue
 *   takes the indigo, so every tint the theme needs is a tint of a color it states. Every other
 *   ramp is the foundation's.
 */

import { scaleOf, type Tokens } from "@stealthscale/theme/authoring";

/**
 * Fixes the navy: the dark page, and the ink on the light one.
 */
export const NAVY = "#1B3C53";

/**
 * Fixes the deep blue: the panel on the dark page, and the secondary.
 */
export const DEEP = "#234C6A";

/**
 * Fixes the steel blue the product is drawn in.
 */
export const STEEL = "#456882";

/**
 * Fixes the mist: the light page, and the ink on the dark one.
 */
export const MIST = "#E3E3E3";

/**
 * Lists the ramps the theme redraws, keyed as the foundation keys them.
 */
export const tokens: Tokens = {
  colors: { blue: scaleOf(STEEL), gray: scaleOf(NAVY), indigo: scaleOf(DEEP) },
};
