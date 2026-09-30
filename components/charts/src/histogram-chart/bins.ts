/**
 * Counts values into the bins of a histogram.
 *
 * @remarks
 *   The bins decide what a histogram shows: too few hide the shape, too many turn it into noise.
 *   The count comes from Freedman–Diaconis' rule, which reads the interquartile range and so
 *   ignores a few outliers. The width snaps to the nearest of 1, 2 or 5 times a power of ten, as
 *   d3's and Vega's bins do, so the edges read as round numbers, and one step coarser where the
 *   bins would pass 30. Every bin is half-open, from its lower edge up to its upper edge, except
 *   the last, which includes its upper edge, so the largest value is counted.
 */

import { finiteOf } from "#cartesian/finite.ts";
import { quantile } from "#stats/quantile.ts";

/**
 * Largest number of bins: at 30 a bar in a 450px plot is 15px wide, and a narrower bar is a sliver.
 */
const MOST = 30;

/**
 * Step from which 2 is the nearest round step in ratio, √2, as in d3-array's `tickIncrement`.
 */
const TO_TWO = Math.SQRT2;

/**
 * Step from which 5 is the nearest round step in ratio, √10.
 */
const TO_FIVE = Math.sqrt(10);

/**
 * Step from which 10 is the nearest round step in ratio, √50.
 */
const TO_TEN = Math.sqrt(50);

/**
 * Significant digits an edge keeps, which drops the binary noise of decimal sums such as
 * `0.6000000000000001`.
 */
const DIGITS = 12;

/**
 * Describes one bin: its two edges and the count of values in it.
 */
export interface ChartBin {
  /**
   * Number of values in the bin.
   */
  readonly count: number;

  /**
   * Lower edge, which the bin includes.
   */
  readonly from: number;

  /**
   * Upper edge, which only the last bin includes.
   */
  readonly to: number;
}

/**
 * Describes how values are binned.
 */
export interface BinOptions {
  /**
   * Number of bins to aim for, at most 30. Freedman–Diaconis' count unless stated.
   */
  readonly bins?: number | undefined;

  /**
   * Range to bin, which the first bin starts at. The values' own range unless stated. A value
   * outside the bins is left out.
   */
  readonly domain?: readonly [number, number] | undefined;
}

/**
 * Returns the number of bins a set of values takes: Freedman–Diaconis' count, else Sturges' where
 * the middle half of the values has no spread, at most 30.
 *
 * @remarks
 *   Freedman–Diaconis sets the width to twice the interquartile range over the cube root of the
 *   count. Where a quarter or more of the values tie, the interquartile range is 0 and the rule
 *   asks for infinitely many bins, so Sturges' `log2(n) + 1` replaces it.
 * @param values - The values, in any order.
 */
export function binCount(values: readonly number[]): number {
  const count = values.length;

  if (count < 2) return 1;

  const sorted = values.toSorted((first, second) => first - second);
  const iqr = quantile(sorted, 0.75) - quantile(sorted, 0.25);

  if (iqr <= 0) return Math.min(MOST, Math.ceil(Math.log2(count)) + 1);

  const spread = quantile(sorted, 1) - quantile(sorted, 0);

  return Math.min(MOST, Math.ceil(spread / (2 * iqr * count ** (-1 / 3))));
}

/**
 * Returns the round width nearest a rough one in ratio: 1, 2, 5 or 10 times a power of ten.
 */
function niceWidth(rough: number): number {
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const step = rough / magnitude;

  if (step >= TO_FIVE) return (step >= TO_TEN ? 10 : 5) * magnitude;

  return (step >= TO_TWO ? 2 : 1) * magnitude;
}

/**
 * Returns a number rounded to 12 significant digits.
 */
function rounded(value: number): number {
  return Number(value.toPrecision(DIGITS));
}

/**
 * Returns the smallest and the largest of the values.
 *
 * @remarks
 *   A loop reads a million values, where `Math.min(...values)` overflows the call stack.
 */
function extentOf(values: readonly number[]): [number, number] {
  let low = Number.POSITIVE_INFINITY;
  let high = Number.NEGATIVE_INFINITY;

  for (const value of values) {
    low = Math.min(low, value);
    high = Math.max(high, value);
  }

  return [low, high];
}

/**
 * Describes a run of bins: the first edge, the width of each and how many there are.
 */
interface Run {
  /**
   * Number of bins.
   */
  readonly count: number;

  /**
   * Lower edge of the first bin.
   */
  readonly start: number;

  /**
   * Width of each bin.
   */
  readonly width: number;
}

/**
 * Returns the run's bins, each without a value yet.
 */
function shellsOf({ count, start, width }: Run): ChartBin[] {
  return Array.from({ length: count }, (_, at) => ({
    count: 0,
    from: rounded(start + at * width),
    to: rounded(start + (at + 1) * width),
  }));
}

/**
 * Returns whether a bin counts a value: from its lower edge up to its upper edge, and on the upper
 * edge only for the last bin, which leaves a value on an inner edge to the bin above it.
 *
 * @param value - The value, finite.
 * @param bin - The bin's edges.
 * @param last - Whether the bin is the last one.
 */
export function inBin(value: number, { from, to }: ChartBin, last: boolean): boolean {
  return value >= from && (value < to || (last && value === to));
}

/**
 * Returns the bins with every value counted into the one that contains it, and a value outside the
 * bins left out.
 *
 * @param numbers - The values, finite.
 * @param bins - The bins, in ascending order.
 */
function countInto(numbers: readonly number[], bins: readonly ChartBin[]): ChartBin[] {
  const last = bins.length - 1;

  return bins.map((bin, at) => ({
    count: numbers.filter((value) => inBin(value, bin, at === last)).length,
    from: bin.from,
    to: bin.to,
  }));
}

/**
 * Returns the run of bins of a round width over a range: from a multiple of the width without a
 * domain, from the domain's lower edge with one.
 *
 * @param extent - The smallest and the largest value.
 * @param domain - The range to bin, where the caller states one.
 * @param target - The number of bins to aim for.
 */
function runOf(
  [min, max]: readonly [number, number],
  domain: BinOptions["domain"],
  target: number,
): Run {
  const [low, high] = domain ?? [min, max];

  /**
   * Returns the run at a width.
   */
  const at = (width: number): Run => {
    const first = Math.floor(rounded(min / width));
    const count =
      domain === undefined
        ? Math.ceil(rounded(max / width)) - first
        : Math.round((high - low) / width);

    return { count, start: domain === undefined ? first * width : low, width };
  };
  const nearest = at(niceWidth((high - low) / target));

  return nearest.count > MOST ? at(niceWidth(nearest.width * 2)) : nearest;
}

/**
 * Returns the one bin of values that are all equal: a tenth of the value wide, snapped, or 1 wide
 * at zero.
 */
function single(value: number, count: number): ChartBin {
  const width = value === 0 ? 1 : niceWidth(Math.abs(value) / 10);
  const from = rounded(Math.floor(value / width) * width);

  return { count, from, to: rounded(from + width) };
}

/**
 * Returns the values counted into bins of a round width, in ascending order.
 *
 * @remarks
 *   A value that is not a finite number is left out. `bins` is a target, because the width snaps to
 *   a round number and the first edge to a multiple of it. A `domain` fixes the first edge and the
 *   range, and its width snaps too. A domain whose upper edge is not above its lower edge bins
 *   nothing. Values that are all equal make one bin a tenth of the value wide.
 * @param values - The values, of any type.
 * @param options - The number of bins to aim for and the range to bin.
 */
export function binValues(values: readonly unknown[], options: BinOptions = {}): ChartBin[] {
  const numbers = values.flatMap((value) => finiteOf(value) ?? []);
  const { domain } = options;

  if (numbers.length === 0) return [];

  const extent = extentOf(numbers);
  const [low, high] = domain ?? extent;

  if (domain === undefined && low === high) return [single(low, numbers.length)];

  if (high <= low) return [];

  const target = Math.min(
    MOST,
    Math.max(1, Math.floor(finiteOf(options.bins) ?? binCount(numbers))),
  );

  return countInto(numbers, shellsOf(runOf(extent, domain, target)));
}
