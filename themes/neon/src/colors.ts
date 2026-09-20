/**
 * Fixes the four colors Neon is drawn from, and states the theme's colors from them.
 *
 * @remarks
 *   The violet is the primary and the keyword ink, the pink the secondary and the string ink, the
 *   yellow the accent and the number ink, and the grape the dark page and the light ink. The light
 *   page is the palest tint of the violet, and the dark page is written in a pale yellow. The
 *   surfaces keep half the grape's chroma, so the panels and the wells step in a quieter violet
 *   and the fills and the solids carry the color. The three colors beside the grape are drawn as
 *   the hue palettes of their own names for an application that names one.
 *   The four statuses are stated rather than left to their canonical colors, because a theme this
 *   loud reads a canonical status as a color from another product. Each is drawn in the same
 *   fluorescent register as the brand and kept within the thirty degrees of its canonical hue that
 *   the gate allows, so a rose error is still read as an error and an acid green as a success.
 */

import { type Colors, oklch } from "@stealthscale/theme/authoring";

/**
 * Fixes the grape: the dark page, and the ink on the light one.
 */
export const GRAPE = "#450693";

/**
 * Fixes the violet the product is drawn in.
 */
export const VIOLET = "#8C00FF";

/**
 * Fixes the pink beside the violet.
 */
export const PINK = "#FF3F7F";

/**
 * Fixes the yellow: the accent.
 */
export const YELLOW = "#FFC400";

/**
 * Fixes the palest tint of the violet: the light page.
 */
export const PAGE = oklch(97.5, 0.02, 298);

/**
 * Fixes the pale yellow the dark page is written in.
 */
export const INK = oklch(95, 0.04, 87);

/**
 * Fixes the share of the grape's chroma a raised surface and a well keep, so the fills and the
 * solids carry the color and the panels do not read as one wall of violet.
 */
export const CHROMA = 0.5;

/**
 * Fixes the rose an error is drawn in: the pink taken hotter and redder, nine degrees from the
 * canonical red.
 */
export const ROSE = "#FF1053";

/**
 * Fixes the acid green a success is drawn in, seven degrees from the canonical green.
 */
export const ACID = "#00FF9C";

/**
 * Fixes the amber a warning is drawn in: the accent yellow taken a touch deeper, so a warning and
 * a focus ring are not one color, and twenty-four degrees from the canonical orange.
 */
export const AMBER = "#FFAE00";

/**
 * Fixes the electric cyan information is drawn in, three degrees from the canonical cyan.
 */
export const CYAN = "#00D9FF";

/**
 * Fixes the colors the theme is drawn from.
 */
export const COLORS: Colors = {
  accent: YELLOW,
  chroma: CHROMA,
  code: { keyword: VIOLET, number: YELLOW, string: PINK },
  dark: { ink: INK, page: GRAPE },
  error: ROSE,
  hues: { pink: PINK, purple: VIOLET, yellow: YELLOW },
  info: CYAN,
  light: { ink: GRAPE, page: PAGE },
  primary: VIOLET,
  secondary: PINK,
  success: ACID,
  warning: AMBER,
};
