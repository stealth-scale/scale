/**
 * States the values that change with the color mode: the surfaces, the inks, the lines, every
 * palette, the corners and the shadows.
 *
 * @remarks
 *   The light page is a cream, the palest tint of the yellow, written in the navy. The dark page
 *   is the navy itself, written in a pale yellow. The three families are drawn from those pages
 *   and inks. Every hue palette is drawn from one color over the same pages: the red palette from
 *   the red, which the primary and the errors point at, the orange palette from the orange, which
 *   the secondary and the warnings point at, the yellow palette from the yellow, which the accent
 *   points at, the grey from the ink, and every other from the foundation's hue. The shadows are
 *   cast in the navy's hue.
 */

import {
  coded,
  hues,
  type Inked,
  inked,
  oklch,
  palettes,
  radii,
  shadows,
  type ThemeTokens,
} from "@stealthscale/theme/authoring";

import { NAVY, ORANGE, RED, YELLOW } from "#tokens.ts";

/**
 * Fixes the cream: the palest tint of the yellow, and the light page.
 */
const PAGE = oklch(97.5, 0.02, 89);

/**
 * Fixes the pale yellow the dark page is written in.
 */
const INK = oklch(95, 0.04, 89);

/**
 * Fixes the page and the ink of each mode.
 */
const MODES: Inked = {
  dark: { ink: INK, page: NAVY },
  light: { ink: NAVY, page: PAGE },
};

/**
 * Fixes the hue the shadows are cast in, which is the navy's.
 */
const SHADOW = 256;

/**
 * Fixes the roundest corner.
 */
const CORNER = "0.5rem";

/**
 * Lists every semantic token, by category.
 */
export const semanticTokens: ThemeTokens = {
  colors: {
    ...inked(MODES),
    ...coded(MODES, { keyword: RED, number: YELLOW, string: ORANGE }),
    ...palettes({ accent: "yellow", primary: "red", secondary: "orange" }),
    ...hues(MODES, { orange: ORANGE, red: RED, yellow: YELLOW }),
  },
  radii: radii(CORNER),
  shadows: shadows(SHADOW),
};
