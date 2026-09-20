/**
 * Fixes the four colors Carnival is drawn from, and states the theme's colors from them.
 *
 * @remarks
 *   The red is the primary and the keyword ink, the orange the secondary and the string ink, the
 *   yellow the accent and the number ink, and the navy the dark page and the light ink. The light
 *   page is a cream, the palest tint of the yellow, and the dark page is written in a pale yellow.
 *   Each status keeps its canonical hue at the chroma of the red, and an error a shade off the red
 *   is moved in lightness so a destructive action is told from the primary. The warning is left at
 *   its canonical amber rather than drawn from the orange: the navy page is light enough that
 *   every solid on it is lifted to the same band, where an orange warning and a red error are one
 *   badge. The three colors beside the navy are drawn as the hue palettes of their own names for
 *   an application that names one.
 */

import { type Colors, oklch } from "@stealthscale/theme/authoring";

/**
 * Fixes the navy: the dark page, and the ink on the light one.
 */
export const NAVY = "#2D4059";

/**
 * Fixes the red the product is drawn in.
 */
export const RED = "#EA5455";

/**
 * Fixes the orange beside the red.
 */
export const ORANGE = "#F07B3F";

/**
 * Fixes the yellow: the accent.
 */
export const YELLOW = "#FFD460";

/**
 * Fixes the cream: the palest tint of the yellow, and the light page.
 */
export const PAGE = oklch(97.5, 0.02, 89);

/**
 * Fixes the pale yellow the dark page is written in.
 */
export const INK = oklch(95, 0.04, 89);

/**
 * Fixes the colors the theme is drawn from.
 */
export const COLORS: Colors = {
  accent: YELLOW,
  code: { keyword: RED, number: YELLOW, string: ORANGE },
  dark: { ink: INK, page: NAVY },
  hues: { orange: ORANGE, red: RED, yellow: YELLOW },
  light: { ink: NAVY, page: PAGE },
  primary: RED,
  secondary: ORANGE,
};
