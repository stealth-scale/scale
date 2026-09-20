/**
 * Fixes the foundation's own colors, which the same engine draws that draws every theme.
 *
 * @remarks
 *   The pages are the two ends of the grey ramp, and each is written in the other, so the
 *   foundation's ink on its light page is its dark page. The primary is the canonical blue, every
 *   intent left unstated takes its own canonical color, and every hue palette is drawn so an
 *   application that names a hue in `css()` finds it. A theme that keeps the foundation's pages
 *   and moves the brand alone states these pages and its own primary.
 */

import { canonical } from "#draw/palette.ts";
import { RAMPS, stepOf } from "#draw/ramps.ts";
import { type Colors } from "#draw/statement.ts";

/**
 * Fixes the foundation's two pages: the lightest and the darkest step of the grey ramp.
 */
export const PAGES: Readonly<Record<"dark" | "light", string>> = {
  dark: stepOf(...RAMPS.gray, 950),
  light: stepOf(...RAMPS.gray, 50),
};

/**
 * Fixes the foundation's colors: each page written in the other, the canonical blue as the
 * primary, and every hue palette drawn.
 */
export const FOUNDATION: Colors = {
  dark: { ink: PAGES.light, page: PAGES.dark },
  hues: true,
  light: { ink: PAGES.dark, page: PAGES.light },
  primary: canonical("blue"),
};
