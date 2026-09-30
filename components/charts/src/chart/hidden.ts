/**
 * Computes which series a chart hides after a press in its legend.
 *
 * @remarks
 *   A plain press switches one series and never hides the last one shown, so the plot always has a
 *   series. A press with Ctrl or Cmd shows the pressed series alone, and a second one on that
 *   series shows every series again.
 */

/**
 * Returns the keys hidden after a press with Ctrl or Cmd: every other key, or none when the pressed
 * series is already the only one shown.
 *
 * @param hidden - The keys hidden before the press.
 * @param key - The key of the pressed series.
 * @param keys - Every series key, in order.
 */
export function isolated(
  hidden: readonly string[],
  key: string,
  keys: readonly string[],
): readonly string[] {
  const alone = keys.every((each) => each === key || hidden.includes(each));

  return alone ? [] : keys.filter((each) => each !== key);
}

/**
 * Returns the keys hidden after a plain press: the pressed key switched, unless that hides the last
 * series shown.
 *
 * @param hidden - The keys hidden before the press.
 * @param key - The key of the pressed series.
 * @param keys - Every series key, in order.
 */
export function toggled(
  hidden: readonly string[],
  key: string,
  keys: readonly string[],
): readonly string[] {
  const next = hidden.includes(key) ? hidden.filter((each) => each !== key) : [...hidden, key];

  return next.length >= keys.length ? hidden : next;
}
