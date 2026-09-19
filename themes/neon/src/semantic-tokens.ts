/**
 * States the values that change with the color mode: the surfaces, the inks, the lines, every
 * palette, the corners and the shadows.
 *
 * @remarks
 *   The light page is the palest tint of the violet, written in the grape. The dark page is the
 *   grape itself, written in a pale yellow. The three families are drawn from those pages and
 *   inks. Every hue palette is drawn from one color over the same pages: the purple palette from
 *   the violet, which the primary points at, the pink palette from the pink, which the secondary
 *   points at, the yellow palette from the yellow, which the accent points at, the grey from the
 *   ink, and every other from the foundation's hue. The corners are soft and the shadows are cast
 *   in the grape's hue.
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

import { GRAPE, PINK, VIOLET, YELLOW } from "#tokens.ts";

/**
 * Fixes the palest tint of the violet: the light page.
 */
const PAGE = oklch(97.5, 0.02, 298);

/**
 * Fixes the pale yellow the dark page is written in.
 */
const INK = oklch(95, 0.04, 87);

/**
 * Fixes the page and the ink of each mode.
 */
const MODES: Inked = {
  dark: { ink: INK, page: GRAPE },
  light: { ink: GRAPE, page: PAGE },
};

/**
 * Fixes the hue the shadows are cast in, which is the grape's.
 */
const SHADOW = 292;

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
    ...palettes({ accent: "yellow", primary: "purple", secondary: "pink" }),
    ...hues(MODES, { pink: PINK, purple: VIOLET, yellow: YELLOW }),
  },
  radii: radii(CORNER),
  shadows: shadows(SHADOW),
};
