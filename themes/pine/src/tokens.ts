/**
 * States the four colors Pine is drawn from, and the ramps drawn from them.
 *
 * @remarks
 *   The night is the dark page and the light ink, the teal stands beside the product, the green
 *   is the product, and the sage is the ink on the dark page and the accent. The grey ramp is
 *   drawn in the night's hue at its chroma, and the three greens take the three ramps nearest
 *   them, the sage as the green, the green as the teal and the teal as the cyan, so every tint the
 *   theme needs is a tint of a color it states. Every other ramp is the foundation's.
 */

import { scaleOf, type Tokens } from "@stealthscale/theme/authoring";

/**
 * Fixes the night: the dark page, and the ink on the light one.
 */
export const NIGHT = "#092328";

/**
 * Fixes the teal beside the product.
 */
export const TEAL = "#12544F";

/**
 * Fixes the green the product is drawn in.
 */
export const GREEN = "#2A835F";

/**
 * Fixes the sage: the ink on the dark page, and the accent.
 */
export const SAGE = "#8BBB92";

/**
 * Lists the ramps the theme redraws, keyed as the foundation keys them.
 */
export const tokens: Tokens = {
  colors: {
    cyan: scaleOf(TEAL),
    gray: scaleOf(NIGHT),
    green: scaleOf(SAGE),
    teal: scaleOf(GREEN),
  },
};
