/**
 * Maps a key pressed on an angle slider's thumb to the event the machine takes for it.
 *
 * @remarks
 *   The map follows the slider pattern of the ARIA Authoring Practices: ArrowRight and ArrowUp step
 *   the value up, ArrowLeft and ArrowDown step it down, PageUp, PageDown and an arrow with Shift
 *   step it tenfold, and Home and End set the bounds. ArrowLeft and ArrowRight swap under `rtl`,
 *   where the dial turns the other way. The machine's own map steps the value down on ArrowUp and
 *   leaves the page keys out, so the thumb sends these events in its place.
 */

/**
 * Describes the event that steps the value up or down.
 */
export interface Stepped {
  /**
   * Degrees to step by.
   */
  readonly step: number;

  /**
   * Direction of the step.
   */
  readonly type: "THUMB.ARROW_DEC" | "THUMB.ARROW_INC";
}

/**
 * Describes the event that sets a bound.
 */
export interface Bounded {
  /**
   * The bound to set: 0 or 359.
   */
  readonly type: "THUMB.END" | "THUMB.HOME";
}

/**
 * Describes an event the thumb sends the machine for a key: a step up or down, or a bound.
 */
export type KeyEvent = Bounded | Stepped;

/**
 * Maps each key that steps the value to the direction it steps in: 1 up, -1 down.
 */
const STEPPED: Readonly<Record<string, number>> = {
  ArrowDown: -1,
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: 1,
  PageDown: -1,
  PageUp: 1,
};

/**
 * Lists the keys that step the value tenfold with or without Shift.
 */
const PAGES = new Set(["PageDown", "PageUp"]);

/**
 * Lists the keys whose direction swaps under `rtl`.
 */
const MIRRORED = new Set(["ArrowLeft", "ArrowRight"]);

/**
 * Number of steps a page key or a shifted arrow moves the value by.
 */
const LARGE = 10;

/**
 * Returns the event the machine takes for a key, or nothing for a key the thumb leaves alone.
 *
 * @param event - The key and whether Shift is held.
 * @param step - The machine's step, in degrees.
 * @param dir - The reading direction the machine runs in.
 * @returns The event to send.
 */
export function keyEvent(
  event: Readonly<Pick<KeyboardEvent, "key" | "shiftKey">>,
  step: number,
  dir: "ltr" | "rtl",
): KeyEvent | undefined {
  if (event.key === "Home") return { type: "THUMB.HOME" };
  if (event.key === "End") return { type: "THUMB.END" };

  const sign = STEPPED[event.key];

  if (sign === undefined) return undefined;

  const turned = dir === "rtl" && MIRRORED.has(event.key) ? -sign : sign;
  const steps = PAGES.has(event.key) || event.shiftKey ? LARGE : 1;

  return { step: step * steps, type: turned > 0 ? "THUMB.ARROW_INC" : "THUMB.ARROW_DEC" };
}
