/**
 * States the values that change with the color mode: the surfaces, the inks, the lines, every
 * palette, the corners and the shadows.
 *
 * @remarks
 *   The light page is the palest tint of the navy, written in the navy. The dark page is the navy
 *   itself, with the deep blue as the panel on it, written in a pale teal. The three families are
 *   drawn from those pages and inks. Every hue palette is drawn over the same pages: the red
 *   palette from the crimson, which the primary and the errors point at, the blue palette, which
 *   the secondary and the information point at, from the deep blue by day and from the pale teal
 *   after dark, where the deep blue would sink into the navy, the teal palette from the teal,
 *   which the accent points at, the grey from the ink, and every other from the foundation's hue.
 *   The corners are sharp and the shadows are cast in the navy's hue.
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

import { CRIMSON, DEEP, NAVY, TEAL } from "#tokens.ts";

/**
 * Fixes the palest tint of the navy: the light page.
 */
const PAGE = oklch(97.5, 0.008, 260);

/**
 * Fixes the pale teal the dark page is written in.
 */
const INK = oklch(94, 0.03, 195);

/**
 * Fixes the page and the ink of each mode.
 */
const MODES: Inked = {
  dark: { ink: INK, page: NAVY, panel: DEEP },
  light: { ink: NAVY, page: PAGE },
};

/**
 * Fixes the hue the shadows are cast in, which is the navy's.
 */
const SHADOW = 260;

/**
 * Fixes the roundest corner.
 */
const CORNER = "0.25rem";

/**
 * Lists every semantic token, by category.
 */
export const semanticTokens: ThemeTokens = {
  colors: {
    ...inked(MODES),
    ...coded(MODES, { keyword: CRIMSON, type: TEAL }),
    ...palettes({ accent: "teal", primary: "red", secondary: "blue" }),
    ...hues(MODES, { blue: { dark: INK, light: DEEP }, red: CRIMSON, teal: TEAL }),
  },
  radii: radii(CORNER),
  shadows: shadows(SHADOW),
};
