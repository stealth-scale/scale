/**
 * States the four colors Dusk is drawn from, and the ramps drawn from them.
 *
 * @remarks
 *   The coral is the product, the mauve and the plum stand beside it, and the navy is the dark
 *   page and the light ink. The grey ramp is drawn in the navy's hue at its chroma, and the coral,
 *   the mauve and the plum each get the ramp of the hue nearest them, so every tint the theme
 *   needs is a tint of a color it states. Every other ramp is the foundation's.
 */

import { scaleOf, type Tokens } from "@stealthscale/theme/authoring";

/**
 * Fixes the coral the product is drawn in.
 */
export const CORAL = "#F67280";

/**
 * Fixes the mauve beside the coral.
 */
export const MAUVE = "#C06C84";

/**
 * Fixes the plum: the panel on the dark page.
 */
export const PLUM = "#6C5B7B";

/**
 * Fixes the navy: the dark page, and the ink on the light one.
 */
export const NAVY = "#355C7D";

/**
 * Lists the ramps the theme redraws, keyed as the foundation keys them.
 */
export const tokens: Tokens = {
  colors: {
    gray: scaleOf(NAVY),
    pink: scaleOf(MAUVE),
    purple: scaleOf(PLUM),
    red: scaleOf(CORAL),
  },
};
