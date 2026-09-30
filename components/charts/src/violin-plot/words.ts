/**
 * Names the numbers of a violin plot's tooltip and the parts of its key, and writes the tooltip's
 * rows.
 */

import { type ReactNode } from "react";

import { type TooltipEntry, type TooltipRow } from "#chart/tooltip.tsx";
import { type ViolinRow } from "#violin-plot/violin-shape.tsx";

/**
 * Most decimals a peak is written with.
 */
const DIGITS = 6;

/**
 * Describes the names of a violin plot's numbers and parts, which the tooltip's rows and the key
 * share.
 */
export interface ViolinWords {
  /**
   * Name of the number of values, such as "Count".
   */
  readonly count: ReactNode;

  /**
   * Name of the outline in the key, such as "Density".
   */
  readonly density: ReactNode;

  /**
   * Name of the median, such as "Median".
   */
  readonly median: ReactNode;

  /**
   * Name of the values the density peaks at, such as "Peaks".
   */
  readonly peaks: ReactNode;

  /**
   * Name of the first quartile to the third, such as "Middle half".
   */
  readonly quartiles: ReactNode;

  /**
   * Name of the smallest value to the largest, such as "Range".
   */
  readonly range: ReactNode;
}

/**
 * Describes the formatters of a violin plot's tooltip.
 */
export interface ViolinFormats {
  /**
   * Writes a count, such as the number of values.
   */
  readonly count: (value: unknown) => string;

  /**
   * Writes a value, and a pair of values as a range, as the value axis writes them.
   */
  readonly value: (value: unknown) => string;
}

/**
 * Returns the decimals a peak of a row's density is written with: those of the grid's step, because
 * a peak is a grid point and no more precise than the step. A density of one point takes none.
 */
function digitsOf({ density, range }: ViolinRow): number {
  const step = (range[1] - range[0]) / (density.length - 1);

  return step > 0 && step < 1 ? Math.min(DIGITS, Math.ceil(-Math.log10(step))) : 0;
}

/**
 * Returns a function that writes the tooltip's rows for the group its entries were read from: the
 * median, the middle half, the range, the peaks and the number of values. The function returns no
 * rows without an entry.
 *
 * @param words - The names of the numbers.
 * @param formats - The formatters of the values and the counts.
 */
export function factsOf(
  words: ViolinWords,
  formats: ViolinFormats,
): (entries: readonly TooltipEntry[]) => TooltipRow[] {
  return (entries) => {
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- recharts passes each entry the row its bar was rendered from
    const row = entries[0]?.payload as undefined | ViolinRow;

    if (row === undefined) return [];

    const { count, value } = formats;
    const { summary } = row;
    const digits = digitsOf(row);

    return [
      { key: "median", name: words.median, value: value(summary.median) },
      { key: "quartiles", name: words.quartiles, value: value([summary.q1, summary.q3]) },
      { key: "range", name: words.range, value: value([summary.min, summary.max]) },
      {
        key: "peaks",
        name: words.peaks,
        value: row.peaks.map((peak) => value(Number(peak.toFixed(digits)))).join(", "),
      },
      { key: "count", name: words.count, value: count(summary.count) },
    ];
  };
}
