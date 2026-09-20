/**
 * States what Abyss moves under Fathom's colors: the pages, the primary and the accent.
 *
 * @remarks
 *   A derived theme states any part of its parent's colors, and the part is merged over the
 *   parent's statement before every family and palette is drawn again. The pages go nearer black
 *   and nearer white than Fathom's while their inks stay Fathom's, the primary is the canonical
 *   indigo while the teal becomes the accent, and everything else Fathom states is inherited.
 */

import { COLORS as FATHOM } from "@stealthscale/example-theme-fathom";
import { canonical, type DerivedColors, oklch } from "@stealthscale/theme/authoring";

/**
 * Fixes the hue the pages are tinted with, which is Fathom's.
 */
const SURFACE = 195;

/**
 * Fixes how far the pages' tint goes, a touch further than Fathom's.
 */
const TINT = 0.02;

/**
 * Fixes the colors the theme moves: the pages, the primary and the accent.
 */
export const COLORS: DerivedColors = {
  accent: FATHOM.primary,
  dark: { page: oklch(13, TINT, SURFACE) },
  light: { page: oklch(93, TINT, SURFACE) },
  primary: canonical("indigo"),
};
