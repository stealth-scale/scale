/**
 * Reads a run's values into the rows recharts plots, and names a run for assistive technology.
 */

/**
 * Describes one value of a run: a number, or nothing where a reading is missing.
 */
export type SparkValue = null | number | undefined;

/**
 * Describes one row recharts plots: the value's place in the run and the value, or `null` for a
 * gap.
 */
export interface SparkRow {
  /**
   * Place of the value in the run, from 0.
   */
  readonly at: number;

  /**
   * The value, or `null` where the run has no finite number, which recharts renders as a gap.
   */
  readonly value: null | number;
}

/**
 * Describes the attributes that name a run or hide it from assistive technology.
 */
export interface Naming {
  /**
   * Hides a run without a name, which is placed beside the figure it belongs to.
   */
  readonly "aria-hidden"?: true;

  /**
   * Name of a run shown on its own.
   */
  readonly "aria-label"?: string;

  /**
   * Role of a named run, which is an image.
   */
  readonly role?: "img";
}

/**
 * Returns a row per value, with `null` where a value is not a finite number.
 *
 * @remarks
 *   A missing reading keeps its place in the run and renders as a gap, because a zero in its place
 *   would plot a fall that never happened, and dropping it would move every later value earlier.
 * @param values - The run, oldest first.
 */
export function rowsOf(values: readonly SparkValue[]): SparkRow[] {
  return values.map((value, at) => ({
    at,
    value: typeof value === "number" && Number.isFinite(value) ? value : null,
  }));
}

/**
 * Returns the attributes of a run: an image named by the label, or hidden without one.
 *
 * @param label - The run's name, for a run shown on its own.
 */
export function namingOf(label?: string): Naming {
  return label === undefined ? { "aria-hidden": true } : { "aria-label": label, role: "img" };
}
