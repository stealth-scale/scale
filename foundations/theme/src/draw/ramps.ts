/**
 * Draws the reference ramps: eleven steps of one hue, eleven steps of an overlay, and the hue and
 * chroma the foundation places each of its hues at.
 *
 * @remarks
 *   Every ramp is drawn by one function from a hue and a chroma, so every ramp has the same shape
 *   and one step reads the same way on each. A ramp is a reference scale an application names a
 *   step of. No semantic token is read off a ramp: a palette is drawn from a color over a page.
 */

import { type Hue } from "#contract.ts";
import { oklch, polar } from "#draw/color.ts";
import { type Tokens } from "#pandacss.ts";

/**
 * Describes the colors a ramp carries.
 */
type Colors = NonNullable<Tokens["colors"]>;

/**
 * Places each hue on the wheel and states how far from grey its ramp sits.
 *
 * @remarks
 *   The grey is tinted towards the blue, so a page and its panels sit in the same light as the
 *   primary palette. Its chroma is below the threshold at which a ramp reads as a color, so it
 *   holds that chroma at both ends rather than falling away.
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
 * Places each step of a ramp: how light it is, and how much of the stated chroma it takes.
 *
 * @remarks
 *   The steps run closer together at the dark end than at the light end, because a dark page is
 *   built from four surfaces that all have to sit under a light ink at 7:1. Saturation falls away
 *   at both ends because a color at 97% lightness cannot hold much chroma without turning pastel,
 *   and one at 15% cannot without turning to mud.
 */
const STOPS: ReadonlyArray<readonly [step: number, lightness: number, saturation: number]> = [
  [50, 97, 0.18],
  [100, 94, 0.32],
  [200, 88, 0.55],
  [300, 80, 0.78],
  [400, 72, 0.94],
  [500, 58, 1],
  [600, 47, 0.98],
  [700, 37, 0.9],
  [800, 28, 0.75],
  [900, 21, 0.58],
  [950, 15, 0.42],
];

/**
 * Places each step of an alpha ramp: how opaque a white or a black overlay is.
 */
const ALPHAS: ReadonlyArray<readonly [step: number, alpha: number]> = [
  [50, 0.04],
  [100, 0.06],
  [200, 0.08],
  [300, 0.16],
  [400, 0.24],
  [500, 0.36],
  [600, 0.48],
  [700, 0.64],
  [800, 0.8],
  [900, 0.92],
  [950, 0.95],
];

/**
 * Fixes the chroma at which a hue reads as a color rather than as a tinted grey.
 */
const SATURATED = 0.1;

/**
 * Keeps a near-grey ramp at its stated chroma, and lets a saturated one fall away at the ends.
 *
 * @remarks
 *   A grey that lost chroma at the ends would read as two different greys, and a blue that kept
 *   it would read as pastel at the top and mud at the bottom.
 */
function share(saturation: number, chroma: number): number {
  const risk = Math.min(chroma / SATURATED, 1);

  return saturation * risk + (1 - risk);
}

/**
 * Writes one step of the ramp a hue and a chroma draw, as CSS reads it.
 *
 * @param hue - Degrees around the wheel.
 * @param chroma - How far from grey the middle of the ramp sits.
 * @param step - The step to write, `50` to `950`.
 * @throws {@link Error} When no ramp has the step.
 */
export function stepOf(hue: number, chroma: number, step: number): string {
  const stop = STOPS.find(([at]) => at === step);

  if (stop === undefined) throw new Error(`${String(step)} is not a step of a ramp`);

  const [, lightness, saturation] = stop;

  return oklch(lightness, chroma * share(saturation, chroma), hue);
}

/**
 * Draws the eleven steps of one hue, keyed `50` to `950`.
 *
 * @param hue - Degrees around the wheel.
 * @param chroma - How far from grey the middle of the ramp sits.
 */
export function colorScale(hue: number, chroma: number): Colors {
  return Object.fromEntries(
    STOPS.map(([step]) => [String(step), { value: stepOf(hue, chroma, step) }]),
  );
}

/**
 * Draws the eleven steps of the hue a color is drawn in, at its chroma.
 *
 * @param color - The color the ramp is drawn from.
 */
export function scaleOf(color: string): Colors {
  const { chroma, hue } = polar(color);

  return colorScale(hue, chroma);
}

/**
 * Draws the eleven steps of a white or a black overlay, keyed `50` to `950`.
 *
 * @param base - Whether the overlay lightens or darkens what it covers.
 */
export function alphaScale(base: "black" | "white"): Colors {
  const lightness = base === "white" ? 100 : 0;

  return Object.fromEntries(
    ALPHAS.map(([step, alpha]) => [
      String(step),
      { value: `oklch(${String(lightness)}% 0 0 / ${alpha.toFixed(2)})` },
    ]),
  );
}
