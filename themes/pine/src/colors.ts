/**
 * Fixes the four colors Pine is drawn from, and states the theme's colors from them.
 *
 * @remarks
 *   The night is the dark page and the light ink, the teal the secondary and the type ink, the
 *   green the primary and the keyword ink, and the sage the dark ink, the accent and the string
 *   ink. The light page is the palest tint of the sage. The sage reads at 6.7:1 on the night, so
 *   the inks are drawn to the AA ratios, and the specification holds the theme to the same
 *   numbers. Each status keeps its canonical hue at the chroma of the green, so a success is told
 *   from the primary and no status shouts over a quiet brand. The surfaces keep seven tenths of
 *   the page's chroma. The three greens are drawn as the hue palettes nearest them for an
 *   application that names one.
 */

import { type Colors, oklch } from "@stealthscale/theme/authoring";

/**
 * Fixes the night: the dark page, and the ink on the light one.
 */
export const NIGHT = "#092328";

/**
 * Fixes the teal beside the product.
 */
export const TEAL = "#12544F";

/**
 * Fixes the green the product is drawn in.
 */
export const GREEN = "#2A835F";

/**
 * Fixes the sage: the ink on the dark page, and the accent.
 */
export const SAGE = "#8BBB92";

/**
 * Fixes the palest tint of the sage: the light page.
 */
export const PAGE = oklch(97, 0.015, 149);

/**
 * Fixes the ratio the secondary ink is drawn to, which is what the sage can reach on the night
 * while a tertiary ink still has room below it at the floor.
 *
 * @remarks
 *   The sage reads at 6:1 on the deepest surface after dark. A secondary ink at 5.5:1 and a
 *   tertiary at the floor's 4.5:1 are two steps a reader tells apart, and both clear what WCAG
 *   asks of normal text. The foundation's 7:1 is out of reach on this page, and anything below
 *   4.5:1 is out of the question.
 */
export const RATIOS = { text: 5.5 };

/**
 * Fixes the share of the page's chroma a raised surface and a well keep, so the surfaces sit
 * quieter than the page in both modes.
 */
export const CHROMA = 0.7;

/**
 * Fixes the colors the theme is drawn from.
 */
export const COLORS: Colors = {
  accent: SAGE,
  chroma: CHROMA,
  code: { keyword: GREEN, string: SAGE, type: TEAL },
  dark: { ink: SAGE, page: NIGHT },
  hues: { cyan: TEAL, green: SAGE, teal: GREEN },
  light: { ink: NIGHT, page: PAGE },
  primary: GREEN,
  ratios: RATIOS,
  secondary: TEAL,
};
