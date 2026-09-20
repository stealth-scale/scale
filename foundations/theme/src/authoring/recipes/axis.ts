/**
 * Writes an axis of a recipe from every value it can take and the styles one value states.
 *
 * @remarks
 *   Every axis helper answers the same two calls: nothing, for a component with a use for every
 *   value the theme states, and a list, for one with a use for some. The two calls are written
 *   once here, so a helper states its values and the styles of one value and nothing else, and a
 *   list that gains a value reaches every component that reads the helper.
 */

import type { SystemStyleObject } from "#generated/types/system.d.mts";
import { recordOf } from "#record.ts";

/**
 * Describes an axis helper: called with nothing it writes every value, and called with a list it
 * writes the values named.
 *
 * @typeParam Value - Every value the axis can take.
 */
export interface Axis<Value extends string> {
  /**
   * Writes every value the theme states.
   */
  (): Record<Value, SystemStyleObject>;

  /**
   * Writes the values a recipe names.
   *
   * @typeParam Offered - The values the recipe offers.
   */
  <const Offered extends Value>(offered: readonly Offered[]): Record<Offered, SystemStyleObject>;
}

/**
 * Writes an axis helper from every value the axis can take and the styles one value states.
 *
 * @param all - Every value, in the order a documentation page shows them.
 * @param write - Answers the styles one value holds, given the value.
 */
export function axis<Value extends string>(
  all: readonly Value[],
  write: (value: Value) => SystemStyleObject,
): Axis<Value> {
  return (offered: readonly Value[] = all) => recordOf(offered, write);
}
