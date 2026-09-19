/**
 * Defines the reference colors: eleven hue ramps, two alpha ramps, and the four constants.
 *
 * @remarks
 *   Every ramp is drawn by one function from a hue and a chroma, so every ramp has the same shape
 *   and the palette roles read the same step of each. `primary` is not here. It is a semantic
 *   palette that references a hue, and a theme moves it by pointing it at another hue rather than
 *   by drawing a twelfth ramp.
 */

import { type Hue, HUES } from "#authoring/contract.ts";
import { type Tokens } from "#pandacss.ts";
import { recordOf } from "#record.ts";
import { alphaScale, colorScale } from "#scales/color.ts";

/**
 * Describes the colors a theme states.
 */
type Colors = NonNullable<Tokens["colors"]>;

/**
 * Places each hue on the wheel and states how far from grey its ramp sits.
 *
 * @remarks
 *   The grey is tinted towards the blue, so a page and its panels sit in the same light as the
 *   primary palette. Its chroma is below the threshold at which a ramp reads as a color, so it
 *   holds that chroma at both ends rather than falling away. Published so a theme drawn from a
 *   palette reads the foundation's hue for every palette it does not state.
 */
export const RAMPS: Readonly<Record<Hue, readonly [hue: number, chroma: number]>> = {
  blue: [262, 0.14],
  cyan: [220, 0.13],
  gray: [262, 0.008],
  green: [150, 0.13],
  indigo: [280, 0.14],
  orange: [60, 0.15],
  pink: [350, 0.15],
  purple: [300, 0.16],
  red: [25, 0.16],
  teal: [180, 0.12],
  yellow: [95, 0.15],
};

/**
 * Lists every reference color: the ramps, the overlays, and the constants a recipe reads by name.
 *
 * @remarks
 *   `current` is `currentColor`, so a border or a fill can follow the text. `transparent` is an
 *   OKLCH transparent rather than the keyword, so a transition from a color to it interpolates in
 *   the same space as everything else.
 */
export const colors: Colors = {
  ...recordOf(HUES, (hue) => colorScale(...RAMPS[hue])),
  black: { value: "oklch(0% 0 0)" },
  blackAlpha: alphaScale("black"),
  current: { value: "currentColor" },
  transparent: { value: "oklch(0% 0 0 / 0)" },
  white: { value: "oklch(100% 0 0)" },
  whiteAlpha: alphaScale("white"),
};
