/**
 * Fixes the four colors Dusk is drawn from, and states the theme's colors from them.
 *
 * @remarks
 *   The coral is the primary and the keyword ink, the mauve the secondary and the type ink, and
 *   the plum the accent and the tag ink. The navy is taken down to a night, which is the dark
 *   page and the ink on the light one. The light page is the palest tint of the coral, and the
 *   night is written in a pale coral. The surfaces keep four fifths of the page's chroma.
 *   The night rather than the navy itself, because the navy sits at 46% lightness. A page there
 *   leaves one band where a solid both stands from it and carries a label, so every status lands
 *   on the brand, and an ink there reads at 5:1 on its own deepest well, which is one step of text
 *   rather than three. Deepened, the theme draws to the foundation's own ratios and states none of
 *   its own.
 *   The warning, the success and the information are stated rather than left to their canonical
 *   colors, because a canonical status is louder than anything else on a page this dusty. Each is
 *   dusted to the theme's own register and kept within the thirty degrees of its canonical hue
 *   that the gate allows, so a sage green is still read as a success. The error is left to the
 *   engine, which moves it off the coral. The three colors beside the navy are drawn as the hue
 *   palettes nearest them, and the navy itself as the blue, for an application that names one.
 */

import { type Colors, oklch } from "@stealthscale/theme/authoring";

/**
 * Fixes the coral the product is drawn in.
 */
export const CORAL = "#F67280";

/**
 * Fixes the mauve beside the coral.
 */
export const MAUVE = "#C06C84";

/**
 * Fixes the plum: the accent.
 */
export const PLUM = "#6C5B7B";

/**
 * Fixes the navy the night is taken down from, which an application reads as the blue.
 */
export const NAVY = "#355C7D";

/**
 * Fixes the palest tint of the coral: the light page.
 */
export const PAGE = oklch(97.5, 0.012, 16);

/**
 * Fixes the night: the navy taken down to a lightness a page can be read on, which is the dark
 * page.
 *
 * @remarks
 *   The navy itself sits at 46% lightness, which is a middle tone rather than a dark one. A page
 *   there leaves one band where a solid both stands from it and carries a label, so every status
 *   lands on the brand, and it leaves a pale ink under 5:1 with no room for three steps of text.
 *   Deepened to 22% it keeps the navy's hue and gives the theme the room the foundation asks for.
 */
export const NIGHT = oklch(22, 0.05, 246);

/**
 * Fixes the pale coral the dark page is written in.
 */
export const INK = oklch(96, 0.02, 16);

/**
 * Fixes the share of the page's chroma a raised surface and a well keep, so the panels sit a
 * touch quieter than the navy after dark.
 */
export const CHROMA = 0.8;

/**
 * Fixes the ochre a warning is drawn in, twelve degrees from the canonical orange.
 */
export const OCHRE = "#C98A2E";

/**
 * Fixes the sage a success is drawn in, eight degrees from the canonical green.
 */
export const SAGE = "#6BA583";

/**
 * Fixes the slate blue information is drawn in: bluer than the navy, so an information badge and
 * a grey control are told apart.
 */
export const SLATE = "#3E86B8";

/**
 * Fixes the colors the theme is drawn from.
 */
export const COLORS: Colors = {
  accent: PLUM,
  chroma: CHROMA,
  code: { keyword: CORAL, tag: PLUM, type: MAUVE },
  dark: { ink: INK, page: NIGHT },
  hues: { blue: NAVY, pink: MAUVE, purple: PLUM, red: CORAL },
  info: SLATE,
  light: { ink: NIGHT, page: PAGE },
  primary: CORAL,
  secondary: MAUVE,
  success: SAGE,
  warning: OCHRE,
};
