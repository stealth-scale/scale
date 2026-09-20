/**
 * Fixes the colors Folio is drawn from, and states the theme's colors from them.
 *
 * @remarks
 *   The pages sit nearer white and nearer black than the foundation's, tinted a little further
 *   round than the brand, and each is written in a grey that keeps a trace of the violet, so a
 *   rule beside the brand reads as belonging to it. The light page stops half a point short of
 *   98, because a panel has to rise a step above it before it reaches white. The primary is the
 *   violet, the accent the canonical indigo and the secondary the canonical pink.
 */

import { canonical, type Colors, oklch, stepOf } from "@stealthscale/theme/authoring";

/**
 * Fixes the hue the product is drawn in, and the one the greys keep a trace of.
 */
export const PRODUCT = 295;

/**
 * Fixes the hue the pages are tinted with, a little further round than the brand.
 */
const SURFACE = 300;

/**
 * Fixes how far the pages' tint goes.
 */
const TINT = 0.01;

/**
 * Fixes the colors the theme is drawn from.
 */
export const COLORS: Colors = {
  accent: canonical("indigo"),
  dark: { ink: stepOf(PRODUCT, 0.01, 50), page: oklch(13, TINT, SURFACE) },
  light: { ink: stepOf(PRODUCT, 0.01, 950), page: oklch(97.5, TINT, SURFACE) },
  primary: { dark: stepOf(PRODUCT, 0.17, 400), light: stepOf(PRODUCT, 0.17, 600) },
  secondary: canonical("pink"),
};
