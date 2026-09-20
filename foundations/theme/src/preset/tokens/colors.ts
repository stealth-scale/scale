/**
 * Defines the reference colors: eleven hue ramps, two alpha ramps, and the four constants.
 *
 * @remarks
 *   Every ramp is drawn by one function from a hue and a chroma, so every ramp has the same shape
 *   and one step reads the same way on each. `primary` is not here. It is a semantic palette
 *   drawn from a color, and a theme moves it by stating another color rather than by drawing a
 *   twelfth ramp.
 */

import { HUES } from "#contract.ts";
import { alphaScale, colorScale, RAMPS } from "#draw/ramps.ts";
import { type Tokens } from "#pandacss.ts";
import { recordOf } from "#record.ts";

/**
 * Describes the colors a theme states.
 */
type Colors = NonNullable<Tokens["colors"]>;

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
