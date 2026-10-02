/**
 * Measures how far apart two colors are, for a reader with typical vision and for one with a
 * color vision deficiency.
 *
 * @remarks
 *   The distance is Euclidean in OKLab, where a distance of 0.02 is about one just noticeable
 *   difference. A deficiency is simulated with the matrices of Machado, Oliveira and Fernandes
 *   (2009) at full severity, applied in linear sRGB. Each row of a matrix sums to one, so white
 *   stays white and a grey stays a grey.
 */

import { type Linear, linear, oklab, type Oklab } from "@stealthscale/theme/authoring";

/**
 * Selects one of the three dichromacies.
 */
export type Deficiency = "deuteranopia" | "protanopia" | "tritanopia";

/**
 * Lists the three dichromacies in the order a report shows them.
 */
export const DEFICIENCIES: readonly Deficiency[] = ["protanopia", "deuteranopia", "tritanopia"];

/**
 * Describes one row of a matrix: the weight of each linear channel.
 */
type Row = readonly [red: number, green: number, blue: number];

/**
 * Describes a three by three matrix as three rows.
 */
type Matrix = readonly [Row, Row, Row];

/**
 * Fixes the simulation matrix of each dichromacy, applied to linear red, green and blue.
 */
const MATRICES: Readonly<Record<Deficiency, Matrix>> = {
  deuteranopia: [
    [0.367_322, 0.860_646, -0.227_968],
    [0.280_085, 0.672_501, 0.047_413],
    [-0.011_82, 0.042_94, 0.968_881],
  ],
  protanopia: [
    [0.152_286, 1.052_583, -0.204_868],
    [0.114_503, 0.786_281, 0.099_216],
    [-0.003_882, -0.048_116, 1.051_998],
  ],
  tritanopia: [
    [1.255_528, -0.076_749, -0.178_779],
    [-0.078_411, 0.930_809, 0.147_602],
    [0.004_733, 0.691_367, 0.3039],
  ],
};

/**
 * Multiplies one row of a matrix into a color.
 */
function row(weights: Row, color: Linear): number {
  return weights[0] * color.red + weights[1] * color.green + weights[2] * color.blue;
}

/**
 * Simulates how a reader with a dichromacy sees a color.
 *
 * @returns The color as that reader sees it, in linear sRGB, or undefined where the color cannot
 *   be read.
 */
export function simulated(color: string, deficiency: Deficiency): Linear | undefined {
  const read = linear(color);

  if (read === undefined) return undefined;

  const [first, second, third] = MATRICES[deficiency];

  return { blue: row(third, read), green: row(second, read), red: row(first, read) };
}

/**
 * Applies the sRGB transfer curve to one linear channel and writes it as a byte.
 *
 * @remarks
 *   The channel is clamped into the display's range on the way, because a simulated color outside
 *   it is one the reader's display cannot show either.
 */
function encoded(channel: number): number {
  const clamped = Math.min(Math.max(channel, 0), 1);

  return Math.round(
    255 * (clamped <= 0.003_130_8 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055),
  );
}

/**
 * Returns a linear color as a CSS `rgb()` string, so a simulated color is measured like any other.
 */
export function written(color: Linear): string {
  return `rgb(${String(encoded(color.red))} ${String(encoded(color.green))} ${String(encoded(color.blue))})`;
}

/**
 * Measures the distance between two OKLab points.
 */
function between(one: Oklab, other: Oklab): number {
  return Math.hypot(one.l - other.l, one.a - other.a, one.b - other.b);
}

/**
 * Measures how far apart two colors are for a reader with typical vision.
 *
 * @returns The OKLab distance, or `NaN` where either color cannot be read.
 */
export function distance(one: string, other: string): number {
  const first = oklab(one);
  const second = oklab(other);

  if (first === undefined || second === undefined) return Number.NaN;

  return between(first, second);
}

/**
 * Measures how far apart two colors are for a reader with a dichromacy.
 *
 * @returns The OKLab distance between the two simulated colors, or `NaN` where either color
 *   cannot be read.
 */
export function distanceFor(one: string, other: string, deficiency: Deficiency): number {
  const first = simulated(one, deficiency);
  const second = simulated(other, deficiency);

  if (first === undefined || second === undefined) return Number.NaN;

  return distance(written(first), written(second));
}
