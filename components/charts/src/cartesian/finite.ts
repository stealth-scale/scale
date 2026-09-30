/**
 * Reads a row's field as a number a chart can plot, and states the value domain that keeps zero in
 * view.
 */

/**
 * Domain of a value axis that includes zero: the data's range, widened to zero where the range is
 * on one side of it, because a bar is read by its length from zero.
 */
export const FROM_ZERO: [(low: number) => number, (high: number) => number] = [
  (low) => Math.min(0, low),
  (high) => Math.max(0, high),
];

/**
 * Returns the value when it is a finite number, and nothing for any other value.
 *
 * @remarks
 *   A missing reading is not a zero: a zero plots a fall that never happened, so a caller decides
 *   what nothing means where it reads a field.
 */
export function finiteOf(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

/**
 * Returns a row's field as a finite number, or nothing where the row has no finite number there.
 *
 * @param row - The row, of any shape.
 * @param key - The field to read.
 */
export function finiteAt(row: unknown, key: string): number | undefined {
  const value: unknown =
    typeof row === "object" && row !== null ? Reflect.get(row, key) : undefined;

  return finiteOf(value);
}
