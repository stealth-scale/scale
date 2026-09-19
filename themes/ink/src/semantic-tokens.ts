/**
 * States the values that change with the color mode: the surfaces, the inks, the lines and every
 * palette.
 *
 * @remarks
 *   The paper is the foundation's own page, tinted a touch towards the blue, and the ink is a
 *   charcoal on it, with the two swapped after dark. The three families are drawn from those pages
 *   and inks. The grey palette, which the primary and the neutral point at, draws its solid from
 *   the charcoal by day and from white after dark, takes its quiet fills from the page's own
 *   surfaces, and its lines and inks from the page's own families, so a grey control and the panel
 *   behind it are drawn from one place. The blue palette, which the secondary and the accent point
 *   at, is drawn from one blue in both modes. Every other palette is the foundation's hue over the
 *   same pages. The corners and the shadows are the foundation's.
 */

import {
  drawn,
  hues,
  type Inked,
  inked,
  oklch,
  palettes,
  stated,
  type ThemeTokens,
} from "@stealthscale/theme/authoring";

/**
 * Fixes the hue the paper, the charcoal and every grey are tinted with.
 */
const TINT = 262;

/**
 * Fixes the paper: the light page.
 */
const PAPER = oklch(97, 0.006, TINT);

/**
 * Fixes the charcoal the paper is written in.
 */
const CHARCOAL = oklch(18, 0.0076, TINT);

/**
 * Fixes the night: the dark page.
 */
const NIGHT = oklch(13, 0.006, TINT);

/**
 * Fixes the chalk the night is written in.
 */
const CHALK = oklch(97, 0.0075, TINT);

/**
 * Fixes the grey solid: a lighter charcoal by day, and white after dark.
 */
const SOLID = { dark: "#FFFFFF", light: oklch(27, 0.0077, TINT) };

/**
 * Fixes the blue the accent is drawn in, in both modes.
 */
const BLUE = "#2563EB";

/**
 * Fixes the page and the ink of each mode.
 */
const MODES: Inked = {
  dark: { ink: CHALK, page: NIGHT },
  light: { ink: CHARCOAL, page: PAPER },
};

/**
 * Draws the grey palette: the solid and the text on it from the charcoal and the white, and every
 * other role from the page's own families.
 */
const gray = {
  ...drawn(SOLID, MODES),
  bg: stated("{colors.bg}"),
  border: { DEFAULT: stated("{colors.border}"), hover: stated("{colors.border.emphasized}") },
  emphasized: stated("{colors.bg.emphasized}"),
  fg: { DEFAULT: stated("{colors.fg}"), muted: stated("{colors.fg.muted}") },
  focusRing: stated("{colors.border.emphasized}"),
  muted: stated("{colors.bg.muted}"),
  subtle: stated("{colors.bg.subtle}"),
};

/**
 * Lists every semantic token, by category.
 */
export const semanticTokens: ThemeTokens = {
  colors: {
    ...inked(MODES),
    ...palettes({ accent: "blue", primary: "gray", secondary: "blue" }),
    ...hues(MODES, { blue: BLUE }),
    gray,
  },
};
