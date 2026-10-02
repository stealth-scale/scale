/**
 * Turns a waterfall's steps into floating bars on the running total.
 */

import { finiteOf } from "#cartesian/finite.ts";

/**
 * Describes one step of a waterfall.
 */
export interface WaterfallStep {
  /**
   * Key of the step.
   */
  readonly key: string;

  /**
   * Name of the step on the category axis, such as "Refunds".
   */
  readonly label: string;

  /**
   * Whether the step is a total, which rises from zero in place of floating on the running total.
   */
  readonly total?: boolean | undefined;

  /**
   * Change the step makes, where a negative value subtracts. A total's `value` sets the running
   * total, such as an opening balance, and a total without one shows the running total. A value
   * that is not a finite number makes no change.
   */
  readonly value?: number | undefined;
}

/**
 * Describes one bar a waterfall chart renders.
 */
export interface WaterfallBar {
  /**
   * Change the step made, signed, or the running total for a total.
   */
  readonly change: number;

  /**
   * Whether the step rose, fell or shows the total.
   */
  readonly direction: "down" | "total" | "up";

  /**
   * Running total after the step.
   */
  readonly end: number;

  /**
   * Key of the step.
   */
  readonly key: string;

  /**
   * Name of the step.
   */
  readonly label: string;

  /**
   * Values the bar floats between, the lower first: the running totals before and after the step,
   * or zero and the total.
   */
  readonly span: readonly [number, number];

  /**
   * Running total before the step, or zero for a total.
   */
  readonly start: number;
}

/**
 * Returns the interval between two values, the lower first.
 *
 * @remarks
 *   A bar rendered from its lower value up has its value at its top edge, so every bar's label is
 *   at the bar's upper edge, a fall's too.
 */
function spanOf(first: number, second: number): readonly [number, number] {
  return [Math.min(first, second), Math.max(first, second)];
}

/**
 * Returns a bar per step: a change floats from the running total before it to the total after it,
 * and a total rises from zero.
 *
 * @remarks
 *   The running total is the chart's content, so a caption reads these numbers and does not
 *   compute its own. The running total starts at zero, and a total with a value sets it, so a
 *   bridge opens on a balance. The steps keep their order, because the order is what happened.
 * @param steps - The steps, in order.
 */
export function waterfallBars(steps: readonly WaterfallStep[]): WaterfallBar[] {
  const bars: WaterfallBar[] = [];
  let running = 0;

  for (const { key, label, total, value } of steps) {
    if (total === true) {
      running = finiteOf(value) ?? running;
      bars.push({
        change: running,
        direction: "total",
        end: running,
        key,
        label,
        span: spanOf(0, running),
        start: 0,
      });
    } else {
      const start = running;
      const change = finiteOf(value) ?? 0;

      running += change;
      bars.push({
        change,
        direction: change < 0 ? "down" : "up",
        end: running,
        key,
        label,
        span: spanOf(start, running),
        start,
      });
    }
  }

  return bars;
}
