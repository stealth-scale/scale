/**
 * Sorts a Pareto chart's rows by size and adds each row's share and the running share of the
 * total.
 */

import { finiteOf } from "#cartesian/finite.ts";

/**
 * Describes the shares a Pareto chart adds to each row.
 */
export interface ParetoShares {
  /**
   * Running share of the total after this row, from 0 to 1.
   */
  readonly cumulative: number;

  /**
   * This row's share of the total, from 0 to 1.
   */
  readonly share: number;
}

/**
 * Tolerance a running share is compared with a threshold within, so 0.8 read from a sum of
 * fractions still counts as 80%.
 */
const EPSILON = 1e-9;

/**
 * Returns the rows sorted largest first, each with its share and the running share of the total.
 *
 * @remarks
 *   The sort and the running share are the analysis, so a caption or a table reads these numbers
 *   and does not compute its own. A value that is not a finite number counts as zero. Without a
 *   total every share is zero.
 * @typeParam Row - One row of the data.
 * @param rows - The rows, in any order.
 * @param valueKey - The field each row's value is read from.
 */
export function paretoRows<Row extends object>(
  rows: readonly Row[],
  valueKey: Extract<keyof Row, string>,
): Array<ParetoShares & Row> {
  /**
   * Returns a row's value, or 0 for a value that is not a finite number.
   */
  const valueOf = (row: Row): number => finiteOf(row[valueKey]) ?? 0;
  const sorted = rows.toSorted((first, second) => valueOf(second) - valueOf(first));
  const total = sorted.reduce((sum, row) => sum + valueOf(row), 0);
  const shared: Array<ParetoShares & Row> = [];
  let running = 0;

  for (const row of sorted) {
    running += valueOf(row);
    shared.push({
      ...row,
      cumulative: total > 0 ? running / total : 0,
      share: total > 0 ? valueOf(row) / total : 0,
    });
  }

  return shared;
}

/**
 * Returns how many rows it takes to add up to a share of the total, such as the four causes of
 * nineteen that account for 80% of the failures.
 *
 * @param rows - The rows `paretoRows` returns.
 * @param threshold - The share the running share must meet, from 0 to 1.
 */
export function paretoCutoff(rows: readonly ParetoShares[], threshold = 0.8): number {
  const at = rows.findIndex((row) => row.cumulative >= threshold - EPSILON);

  return at === -1 ? rows.length : at + 1;
}
