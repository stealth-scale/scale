/**
 * States the values that change with the color mode: the surfaces, the inks, the lines, every
 * palette, the corners and the shadows.
 *
 * @remarks
 *   The light page is the palest tint of the sage, written in the night. The dark page is the
 *   night itself, written in the sage. The three families are drawn from those pages and inks.
 *   Every hue palette is drawn from one color over the same pages: the teal palette from the
 *   green, which the primary points at, the cyan palette from the teal, which the secondary points
 *   at, the green palette from the sage, which the accent and the successes point at, the grey
 *   from the ink, and every other from the foundation's hue. The shadows are cast in the night's
 *   hue.
 */

import {
  hues,
  type Inked,
  inked,
  oklch,
  palettes,
  radii,
  shadows,
  type ThemeTokens,
} from "@stealthscale/theme/authoring";

import { GREEN, NIGHT, SAGE, TEAL } from "#tokens.ts";

/**
 * Fixes the palest tint of the sage: the light page.
 */
const PAGE = oklch(97, 0.015, 149);

/**
 * Fixes the page and the ink of each mode.
 */
const MODES: Inked = {
  dark: { ink: SAGE, page: NIGHT },
  light: { ink: NIGHT, page: PAGE },
};

/**
 * Fixes the hue the shadows are cast in, which is the night's.
 */
const SHADOW = 212;

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
    ...palettes({ accent: "green", primary: "teal", secondary: "cyan" }),
    ...hues(MODES, { cyan: TEAL, green: SAGE, teal: GREEN }),
  },
  radii: radii(CORNER),
  shadows: shadows(SHADOW),
};
