/**
 * Fixes the four colors Blush is drawn from, and states the theme's colors from them.
 *
 * @remarks
 *   The navy is the dark page and the light ink, the pink the primary and the keyword ink, the
 *   petal the dark ink and the tag ink, and the pearl the light page. The secondary is the ink of
 *   each mode, which is the grey control beside the pink. The surfaces after dark keep seven tenths
 *   of the navy's chroma. Each status keeps its canonical hue, and an error a shade off the pink
 *   is moved a step in lightness so a destructive action is told from the primary. The pink
 *   palette is drawn for an application that names it.
 */

import { type Colors } from "@stealthscale/theme/authoring";

/**
 * Fixes the navy: the dark page, and the ink on the light one.
 */
export const NAVY = "#021A54";

/**
 * Fixes the pink the product is drawn in.
 */
export const PINK = "#FF85BB";

/**
 * Fixes the petal: the ink on the dark page.
 */
export const PETAL = "#FFCEE3";

/**
 * Fixes the pearl: the light page.
 */
export const PEARL = "#F5F5F5";

/**
 * Fixes the share of the navy's chroma a raised surface and a well keep after dark, so the panels
 * sit a touch greyer than the page rather than as one wall of navy.
 */
export const CHROMA = 0.7;

/**
 * Fixes the colors the theme is drawn from.
 */
export const COLORS: Colors = {
  chroma: CHROMA,
  code: { keyword: PINK, tag: PETAL },
  dark: { ink: PETAL, page: NAVY },
  hues: { pink: PINK },
  light: { ink: NAVY, page: PEARL },
  primary: PINK,
  secondary: { dark: PETAL, light: NAVY },
};
