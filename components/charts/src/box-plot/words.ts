/**
 * Names the numbers of a box plot's tooltip and the parts of its key, and writes the tooltip's
 * rows.
 */

import { type ReactNode } from "react";

import { type BoxRow } from "#box-plot/box-shape.tsx";
import { type TooltipEntry, type TooltipRow } from "#chart/tooltip.tsx";

/**
 * Describes the names of a box plot's numbers, which the tooltip's rows and the key share.
 */
export interface BoxWords {
  /**
   * Name of the number of values, such as "Count".
   */
  readonly count: ReactNode;

  /**
   * Name of the median, such as "Median".
   */
  readonly median: ReactNode;

  /**
   * Name of the outliers, such as "Outliers".
   */
  readonly outliers: ReactNode;

  /**
   * Name of the box, the first quartile to the third, such as "Middle half".
   */
  readonly quartiles: ReactNode;

  /**
   * Name of the whiskers' reach, such as "Whiskers".
   */
  readonly whiskers: ReactNode;
}

/**
 * Describes the formatters of a box plot's tooltip.
 */
export interface BoxFormats {
  /**
   * Writes a count, such as the number of outliers.
   */
  readonly count: (value: unknown) => string;

  /**
   * Writes a value, and a pair of values as a range, as the value axis writes them.
   */
  readonly value: (value: unknown) => string;
}

/**
 * Returns a function that writes the tooltip's rows for the group its entries were read from: the
 * median, the box, the whiskers' reach, the number of outliers and the number of values. The
 * function returns no rows without an entry.
 *
 * @param words - The names of the numbers.
 * @param formats - The formatters of the values and the counts.
 */
export function factsOf(
  words: BoxWords,
  formats: BoxFormats,
): (entries: readonly TooltipEntry[]) => TooltipRow[] {
  return (entries) => {
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- recharts passes each entry the row its bar was rendered from
    const summary = (entries[0]?.payload as BoxRow | undefined)?.summary;

    if (summary === undefined) return [];

    const { count, value } = formats;

    return [
      { key: "median", name: words.median, value: value(summary.median) },
      { key: "quartiles", name: words.quartiles, value: value([summary.q1, summary.q3]) },
      {
        key: "whiskers",
        name: words.whiskers,
        value: value([summary.whiskerLow, summary.whiskerHigh]),
      },
      { key: "outliers", name: words.outliers, value: count(summary.outliers.length) },
      { key: "count", name: words.count, value: count(summary.count) },
    ];
  };
}
