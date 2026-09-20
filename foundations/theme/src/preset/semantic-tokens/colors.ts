/**
 * Defines the color families: the surfaces a page is built from, the inks it is written in, the
 * lines between things, and the inks a passage of code is set in.
 *
 * @remarks
 *   The page sits at 97% lightness in light mode and 13% in dark mode, tinted towards the blue
 *   the grey ramp is tinted with. Every surface is a fixed distance from the page, so a theme
 *   that moves the page moves its panels with it. The inks and lines read the grey ramp, and the
 *   steps they read are the ones the accessibility gate accepts on every surface. The code inks
 *   are drawn from the foundation's hues over the same pages.
 */

import { type Coded } from "#authoring/contract.ts";
import { families as drawn } from "#scales/palettes.ts";

/**
 * Fixes where the page sits in each mode.
 */
const PAGE = { dark: 13, light: 97 };

/**
 * Fixes the hue every surface is tinted with, which is the grey ramp's.
 */
const TINT_HUE = 262;

/**
 * Fixes how far the tint goes, which is less than the grey ramp's so a panel reads as white or
 * near black rather than as a color.
 */
const TINT_CHROMA = 0.006;

/**
 * Lists the three families and the code family.
 */
export const families: Coded = drawn(PAGE, TINT_HUE, TINT_CHROMA);
