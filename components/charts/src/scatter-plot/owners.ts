/**
 * Finds the series a scatter's point belongs to.
 *
 * @remarks
 *   Recharts passes the tooltip the point itself, and a scatter's series share no field that names
 *   them, so a point's identity finds its series.
 */

/**
 * Describes a series by its key and its points.
 */
export interface Owned {
  /**
   * Key of the series.
   */
  readonly key: string;

  /**
   * Points of the series.
   */
  readonly points: readonly object[];
}

/**
 * Returns a map from each point to the key of the series that contains it.
 *
 * @param series - The series, each with its points.
 */
export function ownersOf(series: readonly Owned[]): ReadonlyMap<unknown, string> {
  const owners = new Map<unknown, string>();

  for (const { key, points } of series) for (const point of points) owners.set(point, key);

  return owners;
}
