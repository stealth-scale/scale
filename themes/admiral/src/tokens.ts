/**
 * States the four colors Admiral is drawn from, and the ramps drawn from them.
 *
 * @remarks
 *   The navy is the dark page and the light ink, the blue is the panel on the dark page, the teal
 *   blue is the product, and the chalk is the light page and the dark ink. The grey ramp is drawn
 *   in the navy's hue at its chroma, the blue redraws the blue ramp and the teal blue takes the
 *   cyan, so every tint the theme needs is a tint of a color it states. Every other ramp is the
 *   foundation's.
 */

import { scaleOf, type Tokens } from "@stealthscale/theme/authoring";

/**
 * Fixes the navy: the dark page, and the ink on the light one.
 */
export const NAVY = "#0C2B4E";

/**
 * Fixes the blue: the panel on the dark page, and the secondary.
 */
export const BLUE = "#1A3D64";

/**
 * Fixes the teal blue the product is drawn in.
 */
export const TEAL = "#1D546C";

/**
 * Fixes the chalk: the light page, and the ink on the dark one.
 */
export const CHALK = "#F4F4F4";

/**
 * Lists the ramps the theme redraws, keyed as the foundation keys them.
 */
export const tokens: Tokens = {
  colors: { blue: scaleOf(BLUE), cyan: scaleOf(TEAL), gray: scaleOf(NAVY) },
};
