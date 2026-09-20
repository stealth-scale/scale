/**
 * Draws the colors a theme states into every family and palette a recipe reads.
 *
 * @remarks
 *   A theme states the page and the ink of each mode, the brand's intents, and what else it
 *   draws from its own colors. The three families come from the pages and inks, the eight intents
 *   from the intent colors over the same pages, the code inks from the kinds it names, and the hue
 *   palettes where it asks for them.
 */

import { type Code, type Hue, type Palette, type ThemeColors } from "#contract.ts";
import { coded } from "#draw/code.ts";
import { inked } from "#draw/colors.ts";
import { type Intents, intents } from "#draw/intents.ts";
import { type DrawOptions, type Inked, type Ratios, type Written } from "#draw/ladder.ts";
import { hues, type Solid } from "#draw/palette.ts";

/**
 * Describes the colors a theme states: the page and the ink of each mode, the brand's intents,
 * and what else it draws from its own colors.
 */
export interface Colors extends Intents {
  /**
   * The share of the page's chroma a raised surface and a well keep. All of it unless stated.
   */
  chroma?: number | undefined;

  /**
   * The color each kind of code token is inked from. The foundation's hue for every kind left
   * out, and the muted ink for a comment.
   */
  code?: Readonly<Partial<Record<Code, Solid>>> | undefined;

  /**
   * The dark page, its ink, and its panel where the theme states one.
   */
  dark: Written;

  /**
   * Whether the eleven hue palettes are drawn: from the foundation's hues over the theme's pages
   * where `true`, and from the theme's own colors for the hues it names.
   */
  hues?: boolean | Readonly<Partial<Record<Hue, Solid>>> | undefined;

  /**
   * Which stated solids stay as stated where they fail a ratio, and the gate reports them: every
   * one where it is `true`, and the intents named where it is a list.
   */
  keep?: boolean | readonly Palette[] | undefined;

  /**
   * The light page, its ink, and its panel where the theme states one.
   */
  light: Written;

  /**
   * The ratios the colors are drawn to, where the theme restates any: a stated ink that cannot
   * reach the foundation's text ratio on its page is drawn to the ratio it can reach.
   */
  ratios?: Partial<Ratios> | undefined;
}

/**
 * Draws every color a theme states into the four families, the eight intents, and the hue
 * palettes where the theme asks for them.
 */
export function drawColors(colors: Colors): ThemeColors {
  const modes: Inked = { dark: colors.dark, light: colors.light };
  const options: DrawOptions = { ...colors.ratios, chroma: colors.chroma, keep: colors.keep };
  const named = colors.hues === true ? {} : colors.hues;

  return {
    ...inked(modes, options),
    ...coded(modes, colors.code, options),
    ...intents(modes, colors, options),
    ...(named === undefined || named === false ? {} : hues(modes, named, options)),
  };
}
