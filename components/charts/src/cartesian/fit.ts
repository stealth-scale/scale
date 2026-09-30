/**
 * Fits the least-squares line through a set of points.
 */

/**
 * Describes a point of a fit.
 */
export interface Point {
  /**
   * Position along the horizontal axis.
   */
  readonly x: number;

  /**
   * Position along the vertical axis.
   */
  readonly y: number;
}

/**
 * Describes the least-squares line through a set of points.
 */
export interface LinearFit {
  /**
   * Value of the line where `x` is 0.
   */
  readonly intercept: number;

  /**
   * Share of the variance the line accounts for, from 0 to 1.
   */
  readonly r2: number;

  /**
   * Change of the line's value per unit of `x`.
   */
  readonly slope: number;
}

/**
 * Returns the least-squares line through the points, or nothing where no line fits.
 *
 * @remarks
 *   No line fits fewer than two points, or points on one vertical line, where the slope is
 *   infinite. Points on one horizontal line fit with an `r2` of 1.
 * @param points - The points, in any order.
 */
export function linearFit(points: readonly Point[]): LinearFit | undefined {
  const count = points.length;

  if (count < 2) return undefined;

  const meanX = points.reduce((sum, point) => sum + point.x, 0) / count;
  const meanY = points.reduce((sum, point) => sum + point.y, 0) / count;
  let xx = 0;
  let xy = 0;
  let yy = 0;

  for (const point of points) {
    xx += (point.x - meanX) ** 2;
    xy += (point.x - meanX) * (point.y - meanY);
    yy += (point.y - meanY) ** 2;
  }

  if (xx === 0) return undefined;

  const slope = xy / xx;

  return { intercept: meanY - slope * meanX, r2: yy === 0 ? 1 : (xy * xy) / (xx * yy), slope };
}
