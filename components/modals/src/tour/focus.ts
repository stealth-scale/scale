/**
 * Returns focus to the element that had it when a tour started, once the tour ends.
 *
 * @remarks
 *   The machine's focus trap moves focus into the card and leaves it there when the tour ends, and
 *   the card then leaves the document. The element is recorded when the machine reports the start,
 *   before the trap moves focus, and focused once the card has closed. Focus that a person moved to
 *   another element outside the card, such as a control whose press dismissed the tour, remains
 *   where it is.
 */

import { type StepStatus } from "@zag-js/tour";

import { useSafeLayoutEffect } from "@stealthscale/hooks";

/**
 * Maps a tour's id to the element that had focus when the tour started.
 */
const openers = new Map<string, Element | null>();

/**
 * Contains the ids of the tours that ended and have not returned focus yet.
 */
const ended = new Set<string>();

/**
 * Statuses that end a tour.
 */
const ENDINGS: ReadonlySet<StepStatus> = new Set([
  "completed",
  "dismissed",
  "not-found",
  "skipped",
]);

/**
 * Selector of a tour's card, which the machine marks with its anatomy's attributes.
 */
const CARD = "[data-scope=tour][data-part=content]";

/**
 * Records the element that has focus when a tour starts, and marks a tour that ends.
 *
 * @param id - The tour's id.
 * @param status - The status the machine reports.
 */
export function recordStatus(id: string, status: StepStatus): void {
  if (status === "started") openers.set(id, globalThis.document.activeElement);
  if (ENDINGS.has(status)) ended.add(id);
}

/**
 * Returns true when no element has focus or the focused element is inside a tour's card.
 *
 * @param active - The document's focused element.
 */
function stranded(active: Element | null): boolean {
  return active === null || active === active.ownerDocument.body || active.closest(CARD) !== null;
}

/**
 * Focuses the element that had focus when the tour started, once the tour has ended and its card
 * has closed.
 *
 * @remarks
 *   A wait step closes the card without ending the tour, so focus remains where the person puts it.
 * @param id - The tour's id.
 * @param open - Whether the card is open.
 */
export function useReturnedFocus(id: string, open: boolean): void {
  useSafeLayoutEffect(() => {
    if (open || !ended.delete(id)) return;

    const opener = openers.get(id);
    const connected = opener instanceof HTMLElement && opener.isConnected;

    openers.delete(id);

    if (connected && stranded(globalThis.document.activeElement)) opener.focus();
  }, [id, open]);
}
