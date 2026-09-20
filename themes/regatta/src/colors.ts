/**
 * Fixes the four colors Regatta is drawn from, and states the theme's colors from them.
 *
 * @remarks
 *   The crimson is the primary and the keyword ink, the navy the dark page and the light ink, the
 *   deep blue the panel on the dark page and the secondary, and the teal the accent and the type
 *   ink. The light page is the palest tint of the navy, and the dark page is written in a pale
 *   teal. Each status keeps its canonical hue, so an error is told from the crimson primary. The
 *   three colors beside the navy are drawn as the hue palettes of their own names for an
 *   application that names one.
 */

import { type Colors, oklch } from "@stealthscale/theme/authoring";

/**
 * Fixes the crimson the product is drawn in.
 */
export const CRIMSON = "#BF092F";

/**
 * Fixes the navy: the dark page, and the ink on the light one.
 */
export const NAVY = "#132440";

/**
 * Fixes the deep blue: the panel on the dark page, and the secondary.
 */
export const DEEP = "#16476A";

/**
 * Fixes the teal: the accent.
 */
export const TEAL = "#3B9797";

/**
 * Fixes the palest tint of the navy: the light page.
 */
export const PAGE = oklch(97.5, 0.008, 260);

/**
 * Fixes the pale teal the dark page is written in.
 */
export const INK = oklch(94, 0.03, 195);

/**
 * Fixes the colors the theme is drawn from.
 */
export const COLORS: Colors = {
  accent: TEAL,
  code: { keyword: CRIMSON, type: TEAL },
  dark: { ink: INK, page: NAVY, panel: DEEP },
  hues: { blue: DEEP, red: CRIMSON, teal: TEAL },
  light: { ink: NAVY, page: PAGE },
  primary: CRIMSON,
  secondary: DEEP,
};
