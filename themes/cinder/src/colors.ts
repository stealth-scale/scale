/**
 * Fixes the four colors Cinder is drawn from, and states the theme's colors from them.
 *
 * @remarks
 *   The slate is the dark page and the light ink, the steel is the panel on the dark page and the
 *   secondary, the red is the primary and the keyword ink, and the ash is the light page and the
 *   dark ink. Every other value is drawn from these: each surface a step from the page, each faded
 *   ink from the ink at the ratio it reads at, each line from the page at the ratio it stands at,
 *   and each palette from its color over the pages. The red palette is drawn for an application
 *   that names it.
 */

import { type Colors } from "@stealthscale/theme/authoring";

/**
 * Fixes the slate: the dark page, and the ink on the light one.
 */
export const SLATE = "#303841";

/**
 * Fixes the steel: the panel on the dark page, and the secondary.
 */
export const STEEL = "#3A4750";

/**
 * Fixes the red the product is drawn in.
 */
export const RED = "#D72323";

/**
 * Fixes the ash: the light page, and the ink on the dark one.
 */
export const ASH = "#EEEEEE";

/**
 * Fixes the colors the theme is drawn from.
 */
export const COLORS: Colors = {
  code: { keyword: RED },
  dark: { ink: ASH, page: SLATE, panel: STEEL },
  hues: { red: RED },
  light: { ink: SLATE, page: ASH },
  primary: RED,
  secondary: STEEL,
};
