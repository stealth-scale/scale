/**
 * Moves focus between the timer's action triggers when the machine hides the focused one.
 *
 * @remarks
 *   The machine hides a trigger while its action does not apply, so a press on Start, a completed
 *   count or a new `startMs` hides the button that has focus. Chromium moves focus to the body in
 *   the write that hides the button, before React shows the next trigger. React dispatches no
 *   event during its DOM writes, so the trigger keeps its record of focus. The hidden trigger moves
 *   focus in its layout effect, once React has updated every trigger.
 */

/**
 * Selects a timer's root.
 */
const ROOT = '[data-scope="timer"][data-part="root"]';

/**
 * Selects an action trigger of a timer that shows.
 */
const SHOWN = '[data-scope="timer"][data-part="action-trigger"]:not([hidden])';

/**
 * Contains each trigger that has focus, and each trigger that had focus as the machine hid it.
 */
const focused = new WeakSet<Element>();

/**
 * Describes the part of a focus event the records read.
 */
export interface Focused {
  /**
   * Trigger that gained or lost focus.
   */
  readonly currentTarget: Element;
}

/**
 * Records that a trigger has focus.
 */
export function track({ currentTarget }: Focused): void {
  focused.add(currentTarget);
}

/**
 * Deletes the record of a trigger that loses focus.
 */
export function untrack({ currentTarget }: Focused): void {
  focused.delete(currentTarget);
}

/**
 * Moves focus from a hidden trigger to the first trigger of its timer that shows, when the hidden
 * trigger has a record or still has the document's focus.
 *
 * @remarks
 *   When its window loses focus, the browser dispatches a blur to the trigger and leaves it the
 *   active element. The trigger then has the document's focus without a record.
 */
export function handOff(from: HTMLElement): void {
  if (!focused.delete(from) && from !== from.ownerDocument.activeElement) return;

  from.closest(ROOT)?.querySelector<HTMLElement>(SHOWN)?.focus();
}
