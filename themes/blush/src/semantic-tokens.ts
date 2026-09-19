/**
 * States the values that change with the color mode: the surfaces, the inks, the lines, every
 * palette, the corners and the shadows.
 *
 * @remarks
 *   The pearl page is written in the navy, and the navy page in the petal. The three families are
 *   drawn from those pages and inks. Every hue palette is drawn from one color over the same
 *   pages: the pink palette from the pink, which the primary and the accent point at, with the
 *   petal as its muted fill in light mode, the grey from the ink, which the secondary and the
 *   neutral point at, and every other from the foundation's hue. The corners are round and the
 *   shadows are cast in the navy's hue.
 */

import {
  drawn,
  hues,
  type Inked,
  inked,
  palettes,
  radii,
  shadows,
  stated,
  type ThemeTokens,
} from "@stealthscale/theme/authoring";

import { NAVY, PEARL, PETAL, PINK } from "#tokens.ts";

/**
 * Fixes the page and the ink of each mode.
 */
const MODES: Inked = {
  dark: { ink: PETAL, page: NAVY },
  light: { ink: NAVY, page: PEARL },
};

/**
 * Fixes the hue the shadows are cast in, which is the navy's.
 */
const SHADOW = 263;

/**
 * Fixes the roundest corner.
 */
const CORNER = "1rem";

/**
 * Draws the pink palette over the pages, before the petal takes its muted fill in light mode.
 */
const pink = drawn(PINK, MODES);

/**
 * Reads the muted fill the pink palette draws after dark, which the petal leaves alone.
 */
const { _dark: dusk } = pink.muted.value;

/**
 * Lists every semantic token, by category.
 */
export const semanticTokens: ThemeTokens = {
  colors: {
    ...inked(MODES),
    ...palettes({ accent: "pink", primary: "pink", secondary: "gray" }),
    ...hues(MODES),
    pink: { ...pink, muted: stated(PETAL, dusk) },
  },
  radii: radii(CORNER),
  shadows: shadows(SHADOW),
};
