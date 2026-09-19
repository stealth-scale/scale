/**
 * States the four colors Regatta is drawn from, and the ramps drawn from them.
 *
 * @remarks
 *   The crimson is the product, the navy is the dark page and the light ink, the deep blue is the
 *   panel on the dark page, and the teal is the accent. The grey ramp is drawn in the navy's hue
 *   at its chroma, and the crimson, the deep blue and the teal redraw the ramps of their own hues,
 *   so every tint the theme needs is a tint of a color it states. Every other ramp is the
 *   foundation's.
 */

import { scaleOf, type Tokens } from "@stealthscale/theme/authoring";

/**
 * Fixes the crimson the product is drawn in.
 */
export const CRIMSON = "#BF092F";

/**
 * Fixes the navy: the dark page, and the ink on the light one.
 */
export const NAVY = "#132440";

/**
 * Fixes the deep blue: the panel on the dark page, and the secondary.
 */
export const DEEP = "#16476A";

/**
 * Fixes the teal: the accent.
 */
export const TEAL = "#3B9797";

/**
 * Lists the ramps the theme redraws, keyed as the foundation keys them.
 */
export const tokens: Tokens = {
  colors: {
    blue: scaleOf(DEEP),
    gray: scaleOf(NAVY),
    red: scaleOf(CRIMSON),
    teal: scaleOf(TEAL),
  },
};
