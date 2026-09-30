/**
 * Resolves the value a radial chart measures each mark against: a full turn of a ring, the full
 * radius of a wedge.
 */

/**
 * Returns the value of a full measure: `max` where it is above zero, else the largest of the
 * values, else 1.
 *
 * @remarks
 *   Without `max` the largest mark fills its measure whatever it is worth, so the picture changes
 *   when the data moves rather than when the measure does. A chart with no value above zero
 *   measures against 1, because any other value is as arbitrary and zero divides.
 * @param values - The values of the marks shown.
 * @param max - The caller's value of a full measure.
 */
export function ceilingOf(values: readonly number[], max?: number): number {
  if (max !== undefined && max > 0) return max;

  const largest = Math.max(0, ...values);

  return largest > 0 ? largest : 1;
}
