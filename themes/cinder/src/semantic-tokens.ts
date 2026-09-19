/**
 * States the values that change with the color mode: the surfaces, the inks, the lines, every
 * palette, the corners and the shadows.
 *
 * @remarks
 *   The ash page is written in the slate, and the slate page in the ash, with the steel as the
 *   panel on it. The three families are drawn from those pages and inks, so every surface is a
 *   tint of the page and every line and faded ink a mix of the two. Every hue palette is drawn
 *   over the same pages: the red palette from the red, which the primary and the accent point at,
 *   the grey palette, which the secondary and the neutral point at, from the steel by day and
 *   from the ash after dark, where the steel would sink into the slate, and every other from the
 *   foundation's hue. The corners are sharp and the shadows cast hard, in the slate's hue.
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

import { ASH, RED, SLATE, STEEL } from "#tokens.ts";

/**
 * Fixes the page and the ink of each mode.
 */
const MODES: Inked = {
  dark: { ink: ASH, page: SLATE, panel: STEEL },
  light: { ink: SLATE, page: ASH },
};

/**
 * Fixes the hue the shadows are cast in, which is the slate's.
 */
const SHADOW = 251;

/**
 * Fixes how much ink every shadow carries against the default weight.
 */
const DEPTH = 1.5;

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
    ...palettes({ accent: "red", primary: "red", secondary: "gray" }),
    ...hues(MODES, { gray: { dark: ASH, light: STEEL }, red: RED }),
  },
  radii: radii(CORNER),
  shadows: shadows(SHADOW, DEPTH),
};
