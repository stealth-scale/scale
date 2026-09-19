/**
 * States the values that change with the color mode: the surfaces, the inks, the lines, every
 * palette, the corners and the shadows.
 *
 * @remarks
 *   The mist page is written in the navy, and the navy page in the mist, with the deep blue as the
 *   panel on it. The three families are drawn from those pages and inks. Every hue palette is
 *   drawn over the same pages: the blue palette, which the primary and the information point at,
 *   from the steel blue by day and from the mist after dark, where the steel blue would sink into
 *   the navy, the indigo palette, which the secondary and the accent point at, from the deep blue
 *   by day and the steel blue after dark, the grey from the ink, and every other from the
 *   foundation's hue. The shadows are cast in the navy's hue.
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

import { DEEP, MIST, NAVY, STEEL } from "#tokens.ts";

/**
 * Fixes the page and the ink of each mode.
 */
const MODES: Inked = {
  dark: { ink: MIST, page: NAVY, panel: DEEP },
  light: { ink: NAVY, page: MIST },
};

/**
 * Fixes the hue the shadows are cast in, which is the navy's.
 */
const SHADOW = 241;

/**
 * Fixes the roundest corner.
 */
const CORNER = "0.375rem";

/**
 * Lists every semantic token, by category.
 */
export const semanticTokens: ThemeTokens = {
  colors: {
    ...inked(MODES),
    ...palettes({ accent: "indigo", primary: "blue", secondary: "indigo" }),
    ...hues(MODES, {
      blue: { dark: MIST, light: STEEL },
      indigo: { dark: STEEL, light: DEEP },
    }),
  },
  radii: radii(CORNER),
  shadows: shadows(SHADOW),
};
