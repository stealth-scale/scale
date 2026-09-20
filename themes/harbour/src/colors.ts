/**
 * Fixes the four colors Harbour is drawn from, and states the theme's colors from them.
 *
 * @remarks
 *   The navy is the dark page and the light ink, the deep blue the secondary, the accent and the
 *   type ink, the steel blue the primary and the keyword ink, and the mist the light page and the
 *   dark ink. The panel on the dark page is drawn from the navy rather than stated as the deep
 *   blue, because the mist reads at 6.7:1 on the deep blue and a panel carries text. The navy
 *   reads at 9:1 on the mist, and three wells a reader can tell apart under a secondary ink need
 *   the text ratio at 6:1 there, so the theme states it and the specification holds the theme to
 *   the same number. Each status keeps its canonical hue at the chroma of the steel blue, so
 *   information is told from the primary and no status shouts over a quiet brand. The surfaces
 *   after dark keep three quarters of the navy's chroma. The two blues are drawn as the hue
 *   palettes nearest them for an application that names one.
 */

import { type Colors } from "@stealthscale/theme/authoring";

/**
 * Fixes the navy: the dark page, and the ink on the light one.
 */
export const NAVY = "#1B3C53";

/**
 * Fixes the deep blue: the secondary and the accent.
 */
export const DEEP = "#234C6A";

/**
 * Fixes the steel blue the product is drawn in.
 */
export const STEEL = "#456882";

/**
 * Fixes the mist: the light page, and the ink on the dark one.
 */
export const MIST = "#E3E3E3";

/**
 * Fixes the ratios the theme draws to: the text ratio three distinct wells leave the navy on the
 * mist.
 */
export const RATIOS = { text: 6 };

/**
 * Fixes the share of the navy's chroma a raised surface and a well keep after dark, so the
 * panels sit a touch greyer than the page rather than as one wall of navy.
 */
export const CHROMA = 0.75;

/**
 * Fixes the colors the theme is drawn from.
 */
export const COLORS: Colors = {
  accent: DEEP,
  chroma: CHROMA,
  code: { keyword: STEEL, type: DEEP },
  dark: { ink: MIST, page: NAVY },
  hues: { blue: STEEL, indigo: DEEP },
  light: { ink: NAVY, page: MIST },
  primary: STEEL,
  ratios: RATIOS,
  secondary: DEEP,
};
