/**
 * Orders a stream graph's series inside out: the series whose mass arrives early in the middle of
 * the stack, the late ones outside.
 *
 * @remarks
 *   Recharts supplies the moving baseline (`stackOffset="wiggle"`). Without the order a series that
 *   appears late is threaded through the middle and moves every band above it. The order is Byron
 *   and Wattenberg's ("Stacked Graphs: Geometry and Aesthetics", 2008).
 */

import { finiteAt } from "#cartesian/finite.ts";

/**
 * Returns a series' positive value in a row, and 0 for any other value.
 */
function weightOf(row: unknown, key: string): number {
  const value = finiteAt(row, key);

  return value !== undefined && value > 0 ? value : 0;
}

/**
 * Returns where a series' mass is along the rows: the index of its centre of gravity, or NaN for
 * a series with no positive value.
 *
 * @param data - The rows, in order.
 * @param key - The series' field.
 */
export function streamOnset(data: readonly unknown[], key: string): number {
  let weight = 0;
  let moment = 0;

  for (const [at, row] of data.entries()) {
    weight += weightOf(row, key);
    moment += at * weightOf(row, key);
  }

  return weight === 0 ? Number.NaN : moment / weight;
}

/**
 * Returns the keys bottom of the stack first, ordered inside out.
 *
 * @remarks
 *   The keys are sorted by onset and dealt onto whichever of two piles is lighter, and the lower
 *   pile is reversed, so the earliest onset is at the join in the middle. A series without
 *   weight goes outermost. Fewer than three keys keep their order.
 * @param data - The rows, in order.
 * @param keys - The series' fields.
 */
export function insideOutOrder(data: readonly unknown[], keys: readonly string[]): string[] {
  if (keys.length < 3) return [...keys];

  const ranked = keys.map((key) => {
    const onset = streamOnset(data, key);

    return { key, onset: Number.isNaN(onset) ? Number.POSITIVE_INFINITY : onset };
  });
  const sorted = ranked.toSorted((first, second) =>
    first.onset === second.onset ? 0 : first.onset < second.onset ? -1 : 1,
  );
  const bottom: string[] = [];
  const top: string[] = [];
  let low = 0;
  let high = 0;

  for (const { key } of sorted) {
    const weight = data.reduce<number>((sum, row) => sum + weightOf(row, key), 0);

    if (high < low) {
      high += weight;
      top.push(key);
    } else {
      low += weight;
      bottom.push(key);
    }
  }

  return [...bottom.toReversed(), ...top];
}
