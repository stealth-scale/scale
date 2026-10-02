/**
 * Summarises values as a box plot renders them: the five numbers, Tukey's whiskers, and the
 * outliers past them.
 *
 * @remarks
 *   The whiskers are not the minimum and the maximum. Each extends to the furthest value still
 *   within `whisker` times the interquartile range of the box, and every value past a whisker is
 *   an outlier, so a box plot shows an outlier as its own point. A whisker ends at the box's edge
 *   when no value lies between the edge and its reach. Quartiles are type 7, as `quantile` reads
 *   them.
 */

import { finiteOf } from "#cartesian/finite.ts";
import { quantile } from "#stats/quantile.ts";

/**
 * Reach of a whisker in interquartile ranges unless stated, Tukey's 1.5.
 */
const TUKEY = 1.5;

/**
 * Describes the summary of a set of values that a box plot renders.
 */
export interface BoxSummary {
  /**
   * Number of values summarised. A box of four values is not a distribution.
   */
  readonly count: number;

  /**
   * Interquartile range, `q3 - q1`: the spread of the middle half.
   */
  readonly iqr: number;

  /**
   * Largest value, an outlier included.
   */
  readonly max: number;

  /**
   * Middle value.
   */
  readonly median: number;

  /**
   * Smallest value, an outlier included.
   */
  readonly min: number;

  /**
   * Values past the whiskers, in ascending order.
   */
  readonly outliers: readonly number[];

  /**
   * First quartile, the lower edge of the box.
   */
  readonly q1: number;

  /**
   * Third quartile, the upper edge of the box.
   */
  readonly q3: number;

  /**
   * Largest value within the whisker's reach above the box, or the third quartile.
   */
  readonly whiskerHigh: number;

  /**
   * Smallest value within the whisker's reach below the box, or the first quartile.
   */
  readonly whiskerLow: number;
}

/**
 * Returns the box plot's summary of the values, or nothing without a finite value.
 *
 * @remarks
 *   A value that is not a finite number is left out. A negative `whisker` reads as 0.
 * @param values - The values, of any type and in any order.
 * @param whisker - The whisker's reach in interquartile ranges.
 */
export function boxStats(values: readonly unknown[], whisker = TUKEY): BoxSummary | undefined {
  const sorted = values
    .flatMap((value) => finiteOf(value) ?? [])
    .toSorted((first, second) => first - second);

  if (sorted.length === 0) return undefined;

  const q1 = quantile(sorted, 0.25);
  const q3 = quantile(sorted, 0.75);
  const reach = Math.max(whisker, 0) * (q3 - q1);
  const whiskerHigh = Math.max(
    quantile(
      sorted.filter((value) => value <= q3 + reach),
      1,
    ),
    q3,
  );
  const whiskerLow = Math.min(
    quantile(
      sorted.filter((value) => value >= q1 - reach),
      0,
    ),
    q1,
  );

  return {
    count: sorted.length,
    iqr: q3 - q1,
    max: quantile(sorted, 1),
    median: quantile(sorted, 0.5),
    min: quantile(sorted, 0),
    outliers: sorted.filter((value) => value < whiskerLow || value > whiskerHigh),
    q1,
    q3,
    whiskerHigh,
    whiskerLow,
  };
}
