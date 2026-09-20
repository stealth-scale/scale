/**
 * States the values that change with the color mode: the surfaces, the inks, the lines, every
 * palette, the corners and the shadows.
 *
 * @remarks
 *   The light page is the palest tint of the coral, written in the navy. The dark page is the navy
 *   itself, with the plum as the panel on it, written in the same pale coral. The three families
 *   are drawn from those pages and inks. Every hue palette is drawn over the same pages: the red
 *   palette from the coral, which the primary points at, the pink palette from the mauve, which
 *   the secondary points at, the purple palette, which the accent points at, from the plum by day
 *   and from the pale coral after dark, where the plum is the panel, the grey from the ink, and
 *   every other from the foundation's hue. The corners are soft and the shadows are cast in the
 *   navy's hue.
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

import { CORAL, MAUVE, NAVY, PLUM } from "#tokens.ts";

/**
 * Fixes the palest tint of the coral: the light page.
 */
const PAGE = oklch(97.5, 0.012, 16);

/**
 * Fixes the pale coral the dark page is written in.
 */
const INK = oklch(96, 0.02, 16);

/**
 * Fixes the page and the ink of each mode.
 */
const MODES: Inked = {
  dark: { ink: INK, page: NAVY, panel: PLUM },
  light: { ink: NAVY, page: PAGE },
};

/**
 * Fixes the hue the shadows are cast in, which is the navy's.
 */
const SHADOW = 246;

/**
 * Fixes the roundest corner.
 */
const CORNER = "0.75rem";

/**
 * Lists every semantic token, by category.
 */
export const semanticTokens: ThemeTokens = {
  colors: {
    ...inked(MODES),
    ...coded(MODES, { keyword: CORAL, tag: PLUM, type: MAUVE }),
    ...palettes({ accent: "purple", primary: "red", secondary: "pink" }),
    ...hues(MODES, { pink: MAUVE, purple: { dark: INK, light: PLUM }, red: CORAL }),
  },
  radii: radii(CORNER),
  shadows: shadows(SHADOW),
};
