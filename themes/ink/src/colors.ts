/**
 * Fixes the colors Ink is drawn from, and states the theme's colors from them.
 *
 * @remarks
 *   The paper is the foundation's own light page and the night its dark page, so the theme keeps
 *   the foundation's greys. The paper is written in a charcoal a little lighter than the
 *   foundation's ink, and the night in the paper. The primary is a grey, a lighter charcoal by day
 *   and white after dark, which is the black button the components were drawn against. The blue is
 *   the accent, the secondary and the keyword ink, so links and rings are blue on a grey brand.
 *   That blue is the most saturated color the theme states, so every status is drawn at its
 *   canonical chroma and the statuses stay as loud as the brand. The blue palette is drawn for an
 *   application that names it.
 */

import { type Colors, oklch, PAGES } from "@stealthscale/theme/authoring";

/**
 * Fixes the hue the charcoal is tinted with, which is the foundation's grey's.
 */
const TINT = 262;

/**
 * Fixes the paper: the light page, which is the foundation's.
 */
export const PAPER = PAGES.light;

/**
 * Fixes the charcoal the paper is written in.
 */
export const CHARCOAL = oklch(18, 0.0076, TINT);

/**
 * Fixes the night: the dark page, which is the foundation's.
 */
export const NIGHT = PAGES.dark;

/**
 * Fixes the grey the primary is drawn in: a lighter charcoal by day, and white after dark.
 */
export const GREY = { dark: "#FFFFFF", light: oklch(27, 0.0077, TINT) };

/**
 * Fixes the blue the accent is drawn in, in both modes.
 */
export const BLUE = "#2563EB";

/**
 * Fixes how far the three wells sink below the page: 0.025, 0.05 and 0.075 in lightness, against
 * the foundation's 0.04, 0.08 and 0.13.
 *
 * @remarks
 *   A step of 0.02 measures just under the gate's minimum distance between two surfaces once the
 *   drawn colors are rounded, so each step is 0.025. On the paper the wells measure 94.5, 92 and
 *   89.5 percent lightness, so a subtle field, a filled addon and a muted region read as a light
 *   grey against a white panel. A control's quiet fills keep the foundation's steps.
 */
export const WELLS = [0.025, 0.05, 0.075] as const;

/**
 * Fixes the colors the theme is drawn from.
 */
export const COLORS: Colors = {
  accent: BLUE,
  code: { keyword: BLUE },
  dark: { ink: PAPER, page: NIGHT },
  hues: { blue: BLUE },
  light: { ink: CHARCOAL, page: PAPER },
  primary: GREY,
  secondary: BLUE,
  wells: WELLS,
};
