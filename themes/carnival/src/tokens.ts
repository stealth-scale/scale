/**
 * States the four colors Carnival is drawn from, and the ramps drawn from them.
 *
 * @remarks
 *   The navy is the dark page and the light ink, the red is the product, the orange stands beside
 *   it, and the yellow is the ink on the dark page and the accent. The grey ramp is drawn in the
 *   navy's hue at its chroma, and the red, the orange and the yellow each redraw the ramp of their
 *   own hue, so every tint the theme needs is a tint of a color it states. Every other ramp is the
 *   foundation's.
 */

import { scaleOf, type Tokens } from "@stealthscale/theme/authoring";

/**
 * Fixes the navy: the dark page, and the ink on the light one.
 */
export const NAVY = "#2D4059";

/**
 * Fixes the red the product is drawn in.
 */
export const RED = "#EA5455";

/**
 * Fixes the orange beside the red.
 */
export const ORANGE = "#F07B3F";

/**
 * Fixes the yellow: the ink on the dark page, and the accent.
 */
export const YELLOW = "#FFD460";

/**
 * Lists the ramps the theme redraws, keyed as the foundation keys them.
 */
export const tokens: Tokens = {
  colors: {
    gray: scaleOf(NAVY),
    orange: scaleOf(ORANGE),
    red: scaleOf(RED),
    yellow: scaleOf(YELLOW),
  },
};
