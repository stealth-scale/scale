/**
 * Fills the color contract in two calls: the families from the page, and every palette from the
 * ramps.
 *
 * @remarks
 *   A root theme states every hue palette and every semantic palette. Each hue palette reads its
 *   ramp by name, so a theme that redraws a ramp under the same name moves the palette with it,
 *   and a theme points a semantic palette at another hue by naming the hue. What a theme leaves
 *   unnamed points where the foundation points it.
 */

import {
  type Coded,
  type Hue,
  type HuePalette,
  HUES,
  type Palette,
  PALETTES,
  type SemanticPalette,
} from "#authoring/contract.ts";
import { recordOf } from "#record.ts";
import {
  backgrounds,
  borders,
  foregrounds,
  neutralFills,
  oklch,
  type PageLightness,
  paletteAlias,
  paletteRoles,
  stepOf,
} from "#scales/color.ts";
import { coded } from "#scales/drawn.ts";
import { type Inked } from "#scales/inked.ts";

/**
 * Points each semantic palette at the hue the foundation fills it with.
 *
 * @remarks
 *   `info` and `primary` share a hue, which is what most systems do and what a theme that wants
 *   them apart remaps in one line.
 */
const ALIASES: Readonly<Record<Palette, Hue>> = {
  accent: "teal",
  error: "red",
  info: "blue",
  neutral: "gray",
  primary: "blue",
  secondary: "purple",
  success: "green",
  warning: "orange",
};

/**
 * The steps of the grey ramp the page is written in, in each mode.
 */
const INK_STEPS = { dark: 50, light: 950 };

/**
 * Describes every palette: the eleven hue palettes, then the eight semantic ones.
 */
export type Palettes = Record<Hue, HuePalette> & Record<Palette, SemanticPalette>;

/**
 * Describes where a theme points a semantic palette, for each palette it moves.
 */
export type PaletteAliases = Readonly<Partial<Record<Palette, Hue>>>;

/**
 * Draws the three families and the code family: the surfaces a fixed distance from the page, the
 * inks and lines from the grey ramp, and the code inks from the foundation's hues over the page.
 *
 * @param pages - Where the page sits in each mode.
 * @param hue - The hue every surface is tinted with.
 * @param chroma - How far that tint goes.
 */
export function families(pages: PageLightness, hue: number, chroma: number): Coded {
  const modes: Inked = {
    dark: { ink: stepOf(hue, chroma, INK_STEPS.dark), page: oklch(pages.dark, chroma, hue) },
    light: { ink: stepOf(hue, chroma, INK_STEPS.light), page: oklch(pages.light, chroma, hue) },
  };

  return {
    bg: backgrounds(pages, hue, chroma),
    border: borders(),
    ...coded(modes),
    fg: foregrounds(),
  };
}

/**
 * Fills every palette: the twelve roles of each hue from its ramp, and each semantic palette by
 * reference to the hue named for it, or to the foundation's hue where none is named.
 *
 * @remarks
 *   The neutral palette's quiet fills point at the page's own surfaces, so a grey button and the
 *   panel behind it are drawn from one place.
 */
export function palettes(aliases?: PaletteAliases): Palettes {
  const pointed = { ...ALIASES, ...aliases };

  return {
    ...recordOf(HUES, (hue) => paletteRoles(hue)),
    ...recordOf(PALETTES, (palette) => paletteAlias(pointed[palette])),
    neutral: { ...paletteAlias(pointed.neutral), ...neutralFills() },
  };
}
