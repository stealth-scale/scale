/**
 * Draws the colors a theme states into every family and palette a recipe reads.
 *
 * @remarks
 *   A theme states the page and the ink of each mode, the brand's intents, and what else it
 *   draws from its own colors. The three families come from the pages and inks, the eight intents
 *   from the intent colors over the same pages, the code inks from the kinds it names, the hue
 *   palettes where it asks for them, and the series colors from its intents and hues.
 */

import { type Code, type Hue, type Palette, type ThemeColors } from "#contract.ts";
import { coded } from "#draw/code.ts";
import { inked } from "#draw/colors.ts";
import { type Intents, intents } from "#draw/intents.ts";
import { type DrawOptions, type Inked, type Ratios, type Written } from "#draw/ladder.ts";
import { hues, type Solid } from "#draw/palette.ts";
import { series } from "#draw/series.ts";

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
   * Which stated solids are kept as stated when they fail a ratio, for the gate to report: every
   * one where it is `true`, and the intents named where it is a list.
   */
  keep?: boolean | readonly Palette[] | undefined;

  /**
   * The light page, its ink, and its panel where the theme states one.
   */
  light: Written;

  /**
   * The ratios the colors are drawn to, where the theme restates any: a stated ink below the
   * foundation's text ratio on its page is drawn to the ratio it measures there.
   */
  ratios?: Partial<Ratios> | undefined;

  /**
   * The colors a chart's series take first, in order. The primary, the secondary, the accent and
   * the stated hues unless stated.
   */
  series?: readonly Solid[] | undefined;

  /**
   * How far each of the three wells sinks below the page, in lightness, from the shallowest:
   * `bg.subtle`, `bg.muted` and `bg.emphasized`. The foundation's steps, 0.04, 0.08 and 0.13,
   * unless stated.
   */
  wells?: readonly [number, number, number] | undefined;
}

/**
 * Draws the colors a theme states into every family, intent and palette a recipe reads, and into
 * the series colors.
 */
export function drawColors(colors: Colors): ThemeColors {
  const modes: Inked = { dark: colors.dark, light: colors.light };
  const options: DrawOptions = {
    ...colors.ratios,
    chroma: colors.chroma,
    keep: colors.keep,
    wells: colors.wells,
  };
  const named = colors.hues === true ? {} : colors.hues;
  const stated = named === undefined || named === false ? undefined : named;

  return {
    ...inked(modes, options),
    ...coded(modes, colors.code, options),
    ...intents(modes, colors, options),
    ...(stated === undefined ? {} : hues(modes, stated, options)),
    series: series({ ...colors, hues: stated }, modes, options),
  };
}
