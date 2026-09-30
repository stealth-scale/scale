/**
 * Fits the least-squares line through a scatter's points, read from two fields of each point.
 */

import { finiteAt } from "#cartesian/finite.ts";
import { type LinearFit, linearFit, type Point } from "#cartesian/fit.ts";

/**
 * Returns the least-squares line through the points and how much of the variance it accounts for,
 * or nothing where no line fits.
 *
 * @remarks
 *   A point whose x or y is not a finite number is left out. No line fits fewer than two points, or
 *   points on one vertical line. `r2` is the page's evidence for rendering the line at all: a line
 *   through a cloud with an r² of 0.04 pictures a relationship that is not there.
 * @param points - The points, in any order.
 * @param xKey - The field each point's x is read from.
 * @param yKey - The field each point's y is read from.
 */
export function linearRegression(
  points: readonly unknown[],
  xKey: string,
  yKey: string,
): LinearFit | undefined {
  const fitted: Point[] = [];

  for (const point of points) {
    const x = finiteAt(point, xKey);
    const y = finiteAt(point, yKey);

    if (x !== undefined && y !== undefined) fitted.push({ x, y });
  }

  return linearFit(fitted);
}
