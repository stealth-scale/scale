/**
 * States the values that change with the color mode: the surfaces, the inks, the lines, every
 * palette, the corners and the shadows.
 *
 * @remarks
 *   The chalk page is written in the navy, and the navy page in the chalk, with the blue as the
 *   panel on it. The three families are drawn from those pages and inks. Every hue palette is
 *   drawn over the same pages: the cyan palette, which the primary points at, from the teal blue
 *   by day and from the chalk after dark, where the teal blue would sink into the navy, the blue
 *   palette, which the secondary and the accent point at, from the blue by day and the teal blue
 *   after dark, the grey from the ink, and every other from the foundation's hue. The shadows are
 *   cast in the navy's hue.
 */

import {
  hues,
  type Inked,
  inked,
  palettes,
  radii,
  shadows,
  type ThemeTokens,
} from "@stealthscale/theme/authoring";

import { BLUE, CHALK, NAVY, TEAL } from "#tokens.ts";

/**
 * Fixes the page and the ink of each mode.
 */
const MODES: Inked = {
  dark: { ink: CHALK, page: NAVY, panel: BLUE },
  light: { ink: NAVY, page: CHALK },
};

/**
 * Fixes the hue the shadows are cast in, which is the navy's.
 */
const SHADOW = 254;

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
    ...palettes({ accent: "blue", primary: "cyan", secondary: "blue" }),
    ...hues(MODES, {
      blue: { dark: TEAL, light: BLUE },
      cyan: { dark: CHALK, light: TEAL },
    }),
  },
  radii: radii(CORNER),
  shadows: shadows(SHADOW),
};
