/**
 * Fixes the colors Forge is drawn from, and states the theme's colors from them.
 *
 * @remarks
 *   The pages are cream, tinted a touch further from the brand than the greys, and each is written
 *   in a grey tinted warm enough to sit under the amber without going green. The primary is a hot
 *   amber, read a step lighter by day the way every warm hue is, so warnings take a yellow that
 *   leans towards orange: far enough from the amber to be told from it, and near enough to the
 *   hue a warning is read from to keep its identity. The secondary is the warm grey and the accent
 *   the canonical teal.
 */

import { canonical, type Colors, oklch, stepOf } from "@stealthscale/theme/authoring";

/**
 * Fixes the hue the product is drawn in: a hot amber.
 */
export const PRODUCT = 45;

/**
 * Fixes the hue the greys are tinted with and the shadows are cast in.
 */
export const NEUTRAL = 70;

/**
 * Fixes the hue the pages are tinted with, a touch further from the brand than the greys.
 */
const SURFACE = 75;

/**
 * Fixes how far the pages' tint goes.
 */
const TINT = 0.02;

/**
 * Fixes how far the greys go from grey.
 */
const GREY = 0.014;

/**
 * Fixes the hue warnings are drawn in: a yellow leaning towards orange.
 */
export const WARNING = 85;

/**
 * Fixes the colors the theme is drawn from.
 */
export const COLORS: Colors = {
  accent: canonical("teal"),
  dark: { ink: stepOf(NEUTRAL, GREY, 50), page: oklch(14, TINT, SURFACE) },
  light: { ink: stepOf(NEUTRAL, GREY, 950), page: oklch(96, TINT, SURFACE) },
  primary: { dark: stepOf(PRODUCT, 0.17, 400), light: stepOf(PRODUCT, 0.17, 500) },
  secondary: { dark: stepOf(NEUTRAL, GREY, 400), light: stepOf(NEUTRAL, GREY, 600) },
  warning: { dark: stepOf(WARNING, 0.15, 400), light: stepOf(WARNING, 0.15, 500) },
};
