/**
 * Fixes the four colors Admiral is drawn from, and states the theme's colors from them.
 *
 * @remarks
 *   The navy is the dark page and the light ink, the blue the panel on the dark page, the
 *   secondary, the accent and the type ink, the teal blue the primary and the keyword ink, and the
 *   chalk the light page and the dark ink. Each status keeps its canonical hue, so information is
 *   told from the teal blue primary. The two blues are drawn as the hue palettes nearest them for
 *   an application that names one.
 */

import { type Colors } from "@stealthscale/theme/authoring";

/**
 * Fixes the navy: the dark page, and the ink on the light one.
 */
export const NAVY = "#0C2B4E";

/**
 * Fixes the blue: the panel on the dark page, the secondary and the accent.
 */
export const BLUE = "#1A3D64";

/**
 * Fixes the teal blue the product is drawn in.
 */
export const TEAL = "#1D546C";

/**
 * Fixes the chalk: the light page, and the ink on the dark one.
 */
export const CHALK = "#F4F4F4";

/**
 * Fixes the colors the theme is drawn from.
 */
export const COLORS: Colors = {
  accent: BLUE,
  code: { keyword: TEAL, type: BLUE },
  dark: { ink: CHALK, page: NAVY, panel: BLUE },
  hues: { blue: BLUE, cyan: TEAL },
  light: { ink: NAVY, page: CHALK },
  primary: TEAL,
  secondary: BLUE,
};
