/**
 * Reads and writes one color: OKLCH as CSS writes it, OKLab as the engine measures it, a mix of
 * two colors, a color moved in lightness, and the two shapes a color token takes.
 *
 * @remarks
 *   Every mix and every move happens in OKLab, so a step of lightness reads as the same step on
 *   every hue. A color moved in lightness keeps its hue and its chroma, and gives up chroma only
 *   where the display could not show it.
 */

import { type Moded, type Referenced } from "#contract.ts";
import { linear, oklab, type Oklab } from "#draw/contrast.ts";

/**
 * Describes a color as OKLCH reads it: how light, how far from grey, and where on the wheel.
 */
export interface Polar {
  /**
   * Distance from grey.
   */
  chroma: number;

  /**
   * Degrees around the wheel, from 0 to 360.
   */
  hue: number;

  /**
   * Percent, from black to white.
   */
  lightness: number;
}

/**
 * Fixes the chroma below which a color is a grey, whose hue is noise and reads as zero.
 */
const GREY = 0.0001;

/**
 * Fixes how far outside 0 to 1 a linear channel may sit before the color is outside sRGB, which
 * absorbs the rounding a color is written at.
 */
const SLACK = 0.002;

/**
 * Fixes the share of its chroma a color gives up at each try while it is brought into gamut.
 */
const SHED = 0.92;

/**
 * Fixes how many times a color may shed chroma before the search gives up, which a grey always
 * reaches long before.
 *
 * @remarks
 *   A bound rather than a loop that trusts its own arithmetic: a coordinate that is not a finite
 *   number never comes inside the gamut, and an unbounded loop would hang the build rather than
 *   report the color that caused it.
 */
const SHEDDINGS = 256;

/**
 * Writes one OKLCH color as CSS writes it.
 *
 * @remarks
 *   The color is written as it was asked for, chroma and all. A display shows the nearest color
 *   it can and a wider display shows more of it, so mapping every color into sRGB here would take
 *   saturation away from the screens that have it. What the display does instead is clipped for
 *   the measurement, so a ratio is the ratio a reader sees.
 * @param lightness - Percent, from black to white.
 * @param chroma - Distance from grey.
 * @param hue - Degrees around the wheel.
 * @throws {@link Error} When a coordinate is not a finite number.
 */
export function oklch(lightness: number, chroma: number, hue: number): string {
  if (![lightness, chroma, hue].every((coordinate) => Number.isFinite(coordinate))) {
    throw new Error(
      `oklch(${String(lightness)}% ${String(chroma)} ${String(hue)}) is not a color a theme can be drawn from`,
    );
  }

  return `oklch(${lightness.toFixed(1)}% ${chroma.toFixed(4)} ${hue.toFixed(1)})`;
}

/**
 * Reads a color into OKLab.
 *
 * @remarks
 *   A color whose coordinates are not finite numbers is refused here rather than carried into the
 *   arithmetic, where it would spread through every value drawn from it and report nothing about
 *   where it came from.
 * @throws {@link Error} When the color is not one CSS writes as OKLCH, hex or `rgb()`, or carries
 *   a coordinate that is not a finite number.
 */
export function read(color: string): Oklab {
  const lab = oklab(color);

  if (lab === undefined || ![lab.l, lab.a, lab.b].every((each) => Number.isFinite(each))) {
    throw new Error(`${color} is not a color a theme can be drawn from`);
  }

  return lab;
}

/**
 * Reads an OKLab color as OKLCH reads it.
 */
export function polarOf(lab: Oklab): Polar {
  const chroma = Math.hypot(lab.a, lab.b);
  const hue = (Math.atan2(lab.b, lab.a) * 180) / Math.PI;

  return { chroma, hue: chroma < GREY ? 0 : (hue + 360) % 360, lightness: lab.l * 100 };
}

/**
 * Reads a color as OKLCH reads it.
 */
export function polar(color: string): Polar {
  return polarOf(read(color));
}

/**
 * Writes an OKLab color as CSS reads it.
 */
export function written(lab: Oklab): string {
  const { chroma, hue, lightness } = polarOf(lab);

  return oklch(lightness, chroma, hue);
}

/**
 * Reads the OKLab lightness of a color, 0 for black and 1 for white.
 */
export function lightnessOf(color: string): number {
  return read(color).l;
}

/**
 * Measures how far apart two colors are in OKLab, which is how far apart they read.
 */
export function distanceOf(one: string, other: string): number {
  const first = read(one);
  const second = read(other);

  return Math.hypot(first.l - second.l, first.a - second.a, first.b - second.b);
}

/**
 * Mixes one color a share of the way towards another in OKLab, and writes the result as OKLCH.
 *
 * @param from - The color mixed from.
 * @param to - The color mixed towards.
 * @param share - How far to go, 0 for the first color and 1 for the second.
 */
export function mixed(from: string, to: string, share: number): string {
  const one = read(from);
  const other = read(to);

  return written({
    a: one.a + (other.a - one.a) * share,
    b: one.b + (other.b - one.b) * share,
    l: one.l + (other.l - one.l) * share,
  });
}

/**
 * Reports whether a display can show a color, which is whether every linear channel sits inside
 * sRGB.
 */
export function inGamut(color: string): boolean {
  const rgb = linear(color);

  if (rgb === undefined) return false;

  return [rgb.red, rgb.green, rgb.blue].every(
    (channel) => channel >= -SLACK && channel <= 1 + SLACK,
  );
}

/**
 * Moves a color to a chroma, keeping its hue and its lightness.
 *
 * @param color - The color to move.
 * @param chroma - How far from grey to place it.
 */
export function atChroma(color: string, chroma: number): string {
  const { hue, lightness } = polar(color);

  return oklch(lightness, chroma, hue);
}

/**
 * Moves a color to a lightness, keeping its hue and as much of its chroma as the display can
 * show there.
 *
 * @remarks
 *   A saturated color moved towards white or black leaves the display's gamut before it gets
 *   there, so the chroma is shed a share at a time until the color is inside it, which a grey at
 *   any lightness is. A move is where the shedding belongs: the color is being redrawn, so it may
 *   as well be redrawn to something a display can show, and a color the theme stated outright is
 *   left as the theme wrote it.
 * @param color - The color to move.
 * @param lightness - Where to move it, 0 for black and 1 for white.
 */
export function lightened(color: string, lightness: number): string {
  const { chroma, hue } = polar(color);
  const percent = Math.min(Math.max(lightness, 0), 1) * 100;
  let kept = chroma;

  for (
    let shedding = 0;
    shedding < SHEDDINGS && !inGamut(oklch(percent, kept, hue));
    shedding += 1
  ) {
    kept *= SHED;
  }

  return oklch(percent, kept, hue);
}

/**
 * Writes one color outright in each mode.
 *
 * @param light - The color in light mode.
 * @param dark - The color in dark mode, which is the same color unless another is named.
 */
export function stated(light: string, dark = light): Moded {
  return { value: { _dark: dark, base: light } };
}

/**
 * Writes a reference to a color token that carries both modes itself.
 */
export function referenced(path: string): Referenced {
  return { value: `{colors.${path}}` };
}
