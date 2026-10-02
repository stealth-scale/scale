/**
 * Moves focus into content a screen component uncovers, and returns focus when the content closes.
 *
 * @remarks
 *   The app shell opens a panel over the page, and the toolbar opens a search field over its row.
 *   The shell makes the rest of the page inert and the toolbar covers the row's controls, so focus
 *   leaves the control that opened them. Both components move focus into the uncovered content and
 *   return it on close. Neither needs a dialog role: the page behind is unreachable, a key closes
 *   the content, and the control that opened it has focus again afterwards.
 */

import { type RefObject, useEffect, useRef } from "react";

/**
 * Moves focus to an element without scrolling the page.
 */
function enter(element: HTMLElement): void {
  element.focus({ preventScroll: true });
}

/**
 * Returns the focused element, or null when focus is on no HTML element.
 */
function standing(): HTMLElement | null {
  const held = document.activeElement;

  return held instanceof HTMLElement ? held : null;
}

/**
 * Returns whether focus is on no element, on the body, or inside the element that closed.
 *
 * @remarks
 *   Focus returns to the opening control only in those cases. A reader who closed the element by
 *   moving focus to another control keeps focus on that control.
 */
function stranded(closed: HTMLElement): boolean {
  const held = document.activeElement;

  return held === null || held === document.body || closed.contains(held);
}

/**
 * Returns the element inside the uncovered one that the selector names, or null for a null
 * selector.
 *
 * @param uncovered - The uncovered element.
 * @param into - Selector of the element that receives focus, or null to move none.
 */
function entered(uncovered: HTMLElement, into: null | string): HTMLElement | null {
  return into === null ? null : uncovered.querySelector<HTMLElement>(into);
}

/**
 * Moves focus into the uncovered element while it is shown, and returns focus when it closes.
 *
 * @remarks
 *   Focus that is already inside the element when it opens stays where it is, so a part inside it
 *   that took focus in the same commit, such as a sidebar's search opened by its shortcut, keeps
 *   it. When the opening control has left the document by the time the element closes, focus is not
 *   moved. A component that makes the rest of itself inert passes `from`: a browser takes focus off
 *   an element as it becomes inert, so the active element at this point is the body. That component
 *   records the control while the press is handled. A component that makes nothing inert passes no
 *   `from`, and the hook reads the active element when the element opens.
 * @param ref - The uncovered element, null until it renders.
 * @param shown - Whether the element is uncovered.
 * @param into - Selector of the element that receives focus inside it. The uncovered element itself
 *   receives focus when this is absent, as a panel of destinations does, and a search passes its
 *   field. `null` leaves focus where it is and only returns it, as the action bar does.
 * @param from - The control that opened the element, for a component that has made it inert since.
 */
export function useFocused(
  ref: RefObject<HTMLElement | null>,
  shown: boolean,
  into?: null | string,
  from?: RefObject<HTMLElement | null>,
): void {
  const returning = useRef<HTMLElement | null>(null);

  useEffect((): (() => void) | undefined => {
    const uncovered = ref.current;

    if (!shown || uncovered === null) return undefined;

    const element = into === undefined ? uncovered : entered(uncovered, into);

    returning.current = from?.current ?? standing();

    if (element !== null && !uncovered.contains(document.activeElement)) enter(element);

    return (): void => {
      const back = returning.current;

      returning.current = null;

      if (back !== null && back.isConnected && stranded(uncovered)) enter(back);
    };
  }, [from, into, ref, shown]);
}
