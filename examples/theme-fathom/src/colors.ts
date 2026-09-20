/**
 * Fixes the colors Fathom is drawn from, and states the theme's colors from them.
 *
 * @remarks
 *   The pages are tinted between the greys and the product, so a panel belongs to both, and each
 *   is written in a grey tinted a little bluer than the product, so a grey beside the teal reads
 *   as neutral rather than as a washed-out teal. The primary is a deep marine teal, the accent the
 *   canonical cyan and the secondary the canonical indigo.
 */

import { canonical, type Colors, oklch, stepOf } from "@stealthscale/theme/authoring";

/**
 * Fixes the hue the product is drawn in: a deep marine teal.
 */
export const PRODUCT = 185;

/**
 * Fixes the hue the greys are tinted with and the shadows are cast in.
 */
export const NEUTRAL = 200;

/**
 * Fixes the hue the pages are tinted with, between the greys and the product.
 */
const SURFACE = 195;

/**
 * Fixes how far the pages' tint goes.
 */
const TINT = 0.016;

/**
 * Fixes the colors the theme is drawn from.
 */
export const COLORS: Colors = {
  accent: canonical("cyan"),
  dark: { ink: stepOf(NEUTRAL, 0.012, 50), page: oklch(15, TINT, SURFACE) },
  light: { ink: stepOf(NEUTRAL, 0.012, 950), page: oklch(96, TINT, SURFACE) },
  primary: { dark: stepOf(PRODUCT, 0.12, 400), light: stepOf(PRODUCT, 0.12, 600) },
  secondary: canonical("indigo"),
};
