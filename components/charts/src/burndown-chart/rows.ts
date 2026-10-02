/**
 * Turns a burndown's readings into rows with the ideal line and the projection past the last
 * reading, and names the period the projection falls to zero.
 */

import { finiteOf } from "#cartesian/finite.ts";
import { linearFit, type Point } from "#cartesian/fit.ts";

/**
 * Describes one period of a burndown.
 */
export interface BurndownPoint {
  /**
   * Name of the period, such as a day of a sprint.
   */
  readonly at: string;

  /**
   * Work left at the end of the period. Missing for a period that has not happened.
   */
  readonly remaining?: number | undefined;
}

/**
 * Describes one row a burndown chart plots.
 */
export interface BurndownRow {
  /**
   * Name of the period.
   */
  readonly at: string;

  /**
   * Work a constant rate leaves at the end of the period.
   */
  readonly ideal: number;

  /**
   * Work the trend leaves at the end of the period, from the last reading on.
   */
  readonly projected?: number | undefined;

  /**
   * Work left at the end of the period, where it was read.
   */
  readonly remaining?: number | undefined;
}

/**
 * Describes the plan a burndown is measured against.
 */
export interface BurndownOptions {
  /**
   * Number of periods the plan covers. The number of points unless stated.
   */
  readonly periods?: number | undefined;

  /**
   * Work at the start. The first reading unless stated.
   */
  readonly total?: number | undefined;
}

/**
 * Returns the readings that happened, each at its period's index.
 */
function readings(points: readonly BurndownPoint[]): Point[] {
  return points.flatMap((point, x) => {
    const y = finiteOf(point.remaining);

    return y === undefined ? [] : [{ x, y }];
  });
}

/**
 * Returns the trend's slope per period, or nothing where the work does not fall.
 *
 * @remarks
 *   A flat or rising trend has no finish, so it has no projection and no period.
 */
function burnOf(done: readonly Point[]): number | undefined {
  const fit = linearFit(done);

  return fit !== undefined && fit.slope < 0 ? fit.slope : undefined;
}

/**
 * Returns the period's index at which the trend, projected from the last reading, falls to zero.
 *
 * @remarks
 *   The index is fractional and can lie past the end of the plan, which is the finding a caption
 *   states. Nothing comes back with fewer than two readings, or where the work does not fall.
 * @param points - The periods, in order.
 */
export function burndownFinish(points: readonly BurndownPoint[]): number | undefined {
  const done = readings(points);
  const slope = burnOf(done);
  const last = done.at(-1);

  return slope === undefined || last === undefined ? undefined : last.x - last.y / slope;
}

/**
 * Returns a row per period with the ideal line, the readings and the projection.
 *
 * @remarks
 *   The ideal line runs straight from the total to zero over the plan's periods. The projection
 *   starts at the last reading and falls at the trend's rate, never below zero, so it meets the
 *   readings' line.
 * @param points - The periods, in order.
 * @param options - The plan's periods and total.
 */
export function burndownRows(
  points: readonly BurndownPoint[],
  options: BurndownOptions = {},
): BurndownRow[] {
  const done = readings(points);
  const slope = burnOf(done);
  const last = done.at(-1);
  const periods = options.periods ?? points.length;
  const total = options.total ?? done[0]?.y ?? 0;

  return points.map((point, index) => ({
    at: point.at,
    ideal: periods <= 1 ? 0 : Math.max(0, total * (1 - index / (periods - 1))),
    projected:
      slope === undefined || last === undefined || index < last.x
        ? undefined
        : Math.max(0, last.y + slope * (index - last.x)),
    remaining: finiteOf(point.remaining),
  }));
}
