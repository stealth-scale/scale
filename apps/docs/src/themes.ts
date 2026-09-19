/**
 * Names every theme the catalogue offers, in the order the switcher lists them.
 *
 * @remarks
 *   The names alone, because a theme's definition is what the compiler reads at build time and
 *   nothing a browser needs. `theme.config.ts` states the definitions in the same order, and the
 *   specification beside this file holds the two lists to each other.
 */

/**
 * The names, the first being the theme a page wears until somebody switches.
 */
export const THEMES: readonly string[] = ["asphalt", "prism"];
