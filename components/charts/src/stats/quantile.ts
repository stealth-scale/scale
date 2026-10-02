/**
 * Reads a quantile of sorted values, the one definition every distribution chart in the package
 * shares.
 */

/**
 * Returns the value below which a share of the sorted values falls, interpolated between the two
 * nearest values.
 *
 * @remarks
 *   This is R's type 7, Excel's `PERCENTILE.INC`, SQL's `PERCENTILE_CONT` and NumPy's default.
 *   Nine definitions are in common use, and they disagree on small samples, so a caller that
 *   summarises values elsewhere reads this one to match the chart. A share outside 0 to 1 reads the
 *   nearest end. No values return `NaN`.
 * @param sorted - The values, in ascending order.
 * @param share - The share of values below the quantile, from 0 to 1.
 */
export function quantile(sorted: readonly number[], share: number): number {
  const at = Math.min(Math.max(share, 0), 1) * (sorted.length - 1);
  const low = Math.floor(at);
  const lower = sorted[low] ?? Number.NaN;
  const upper = sorted[Math.ceil(at)] ?? lower;

  return lower + (at - low) * (upper - lower);
}
