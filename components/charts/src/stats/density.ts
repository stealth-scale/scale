/**
 * Estimates the density of values as a violin plot renders it: Silverman's bandwidth, a Gaussian
 * kernel density on an even grid from the smallest value to the largest, and the density's peaks.
 *
 * @remarks
 *   The grid stops at the smallest and the largest value. A Gaussian kernel puts mass past the
 *   data, such as below zero for a duration, so an outline sampled there would show values no one
 *   measured. The bandwidth decides the shape: too narrow turns sampling noise into peaks, too wide
 *   smooths a second peak away.
 */

import { finiteOf } from "#cartesian/finite.ts";
import { quantile } from "#stats/quantile.ts";

/**
 * Number of points the density is sampled at unless stated.
 */
const RESOLUTION = 64;

/**
 * Share of the tallest peak's height a local maximum needs to count as a peak unless stated.
 */
const FLOOR = 0.05;

/**
 * Describes one point of an estimated density.
 */
export interface DensityPoint {
  /**
   * Probability density at the value, which integrates to 1 over every value, not a probability.
   */
  readonly density: number;

  /**
   * Value the density is sampled at.
   */
  readonly value: number;
}

/**
 * Describes how a density is estimated.
 */
export interface DensityOptions {
  /**
   * Standard deviation of the Gaussian kernel, in the values' own units. Silverman's bandwidth
   * unless stated.
   */
  readonly bandwidth?: number | undefined;

  /**
   * Number of points the density is sampled at, at least 2. 64 unless stated.
   */
  readonly resolution?: number | undefined;
}

/**
 * Describes a run of equal densities: its height and the values it spans.
 */
interface Run {
  /**
   * Smallest value of the run.
   */
  readonly from: number;

  /**
   * Density along the run.
   */
  readonly height: number;

  /**
   * Largest value of the run.
   */
  to: number;
}

/**
 * Returns the finite numbers among the values in ascending order.
 */
function sortedOf(values: readonly unknown[]): number[] {
  return values
    .flatMap((value) => finiteOf(value) ?? [])
    .toSorted((first, second) => first - second);
}

/**
 * Returns Silverman's bandwidth for a Gaussian kernel over the values: 0.9 times the smaller of the
 * standard deviation and the interquartile range over 1.34, times the count to the power of -1/5.
 *
 * @remarks
 *   The interquartile range keeps one far value from smoothing the whole shape flat, and the
 *   standard deviation replaces it while the middle half has no spread. Values without spread, one
 *   value or equal ones, have a bandwidth of 0. A value that is not a finite number is left out.
 * @param values - The values, of any type and in any order.
 */
export function silvermanBandwidth(values: readonly unknown[]): number {
  const sorted = sortedOf(values);
  const count = sorted.length;

  if (count < 2) return 0;

  const mean = sorted.reduce((total, value) => total + value, 0) / count;
  const variance = sorted.reduce((total, value) => total + (value - mean) ** 2, 0) / (count - 1);
  const iqr = quantile(sorted, 0.75) - quantile(sorted, 0.25);
  const spread = iqr > 0 ? Math.min(Math.sqrt(variance), iqr / 1.34) : Math.sqrt(variance);

  return 0.9 * spread * count ** -0.2;
}

/**
 * Returns a Gaussian kernel density of the values, sampled at even steps from the smallest value to
 * the largest, or no points without a finite value.
 *
 * @remarks
 *   A bandwidth of 0, as for equal values, has no shape to smooth, so the density is one point at
 *   the smallest value, with all the mass. A value that is not a finite number is left out.
 * @param values - The values, of any type and in any order.
 * @param options - The kernel's bandwidth and the number of points.
 */
export function kernelDensity(
  values: readonly unknown[],
  options: DensityOptions = {},
): DensityPoint[] {
  const sorted = sortedOf(values);

  if (sorted.length === 0) return [];

  const low = quantile(sorted, 0);
  const bandwidth = options.bandwidth ?? silvermanBandwidth(sorted);

  if (!(bandwidth > 0)) return [{ density: 1, value: low }];

  const steps = Math.max(2, Math.round(options.resolution ?? RESOLUTION));
  const span = quantile(sorted, 1) - low;
  const scale = 1 / (sorted.length * bandwidth * Math.sqrt(2 * Math.PI));

  return Array.from({ length: steps }, (_, at) => {
    const value = low + (span * at) / (steps - 1);
    const total = sorted.reduce(
      (sum, each) => sum + Math.exp(-0.5 * ((value - each) / bandwidth) ** 2),
      0,
    );

    return { density: total * scale, value };
  });
}

/**
 * Returns the values a density peaks at, in ascending order: each local maximum at least `floor`
 * of the tallest, a run of equal densities read as one peak at its middle.
 *
 * @remarks
 *   The floor is a height, not a test of significance. Two peaks of different widths differ in
 *   height even when both are plain to see, so the floor is low. No floor tells a real peak from
 *   one a narrow bandwidth invents.
 * @param density - The density, in ascending order of value.
 * @param floor - The share of the tallest peak's height a peak needs.
 */
export function densityPeaks(density: readonly DensityPoint[], floor = FLOOR): number[] {
  const tallest = density.reduce((most, point) => Math.max(most, point.density), 0);
  const runs: Run[] = [];

  for (const point of density) {
    const last = runs.at(-1);

    if (last?.height === point.density) last.to = point.value;
    else runs.push({ from: point.value, height: point.density, to: point.value });
  }

  return runs
    .filter(
      (run, at) =>
        run.height >= tallest * floor &&
        run.height > (runs[at - 1]?.height ?? -Infinity) &&
        run.height > (runs[at + 1]?.height ?? -Infinity),
    )
    .map((run) => (run.from + run.to) / 2);
}
