/**
 * States the four colors Cinder is drawn from, and the ramps drawn from them.
 *
 * @remarks
 *   The slate is the dark page and the light ink, the steel is the panel on it, the red is the
 *   product, and the ash is the light page and the dark ink. The grey ramp is drawn in the slate's
 *   hue at its chroma, and the red ramp in the red's, so every tint the theme needs is a tint of a
 *   color it states. Every other ramp is the foundation's.
 */

import { scaleOf, type Tokens } from "@stealthscale/theme/authoring";

/**
 * Fixes the slate: the dark page, and the ink on the light one.
 */
export const SLATE = "#303841";

/**
 * Fixes the steel: the panel on the dark page.
 */
export const STEEL = "#3A4750";

/**
 * Fixes the red the product is drawn in.
 */
export const RED = "#D72323";

/**
 * Fixes the ash: the light page, and the ink on the dark one.
 */
export const ASH = "#EEEEEE";

/**
 * Lists the ramps the theme redraws, keyed as the foundation keys them.
 */
export const tokens: Tokens = {
  colors: { gray: scaleOf(SLATE), red: scaleOf(RED) },
};
