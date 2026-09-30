/**
 * Maps the keys that move a carousel a page to the machine's page events.
 *
 * @remarks
 *   The keys follow the carousel's orientation and direction: Left and Right page a horizontal
 *   carousel, swapped under `dir="rtl"`, and Up and Down page a vertical one. Home and End move to
 *   the first and the last page. The machine writes `dir` and `data-orientation` on the element
 *   that receives the key, so the map reads both from it.
 */

import { getEventKey } from "@zag-js/dom-query";

/**
 * Describes a move to a page by its index.
 */
interface PageSet {
  /**
   * Index of the page, from zero.
   */
  readonly index: number;

  /**
   * Machine event that moves to the page.
   */
  readonly type: "PAGE.SET";
}

/**
 * Describes a step to the next or the previous page.
 */
interface PageStep {
  /**
   * Machine event that takes the step.
   */
  readonly type: "PAGE.NEXT" | "PAGE.PREV";
}

/**
 * Describes a page event the map returns.
 */
export type Paged = PageSet | PageStep;

/**
 * Lists the arrow keys that step a page, per orientation, after the swap for a right-to-left
 * carousel.
 */
const STEPS: Readonly<
  Record<"horizontal" | "vertical", Readonly<Record<string, "PAGE.NEXT" | "PAGE.PREV">>>
> = {
  horizontal: { ArrowLeft: "PAGE.PREV", ArrowRight: "PAGE.NEXT" },
  vertical: { ArrowDown: "PAGE.NEXT", ArrowUp: "PAGE.PREV" },
};

/**
 * Returns the page event for a key, or undefined for a key that moves no page.
 *
 * @param key - The key's `key` value.
 * @param element - The part that received the key, with the machine's `dir` and
 *   `data-orientation` on it.
 * @param last - The index of the last page.
 * @returns The page event.
 */
export function paged(key: string, element: HTMLElement, last: number): Paged | undefined {
  const orientation = element.dataset["orientation"] === "vertical" ? "vertical" : "horizontal";
  const pressed = getEventKey({ key }, { dir: element.dir === "rtl" ? "rtl" : "ltr", orientation });

  if (pressed === "Home") return { index: 0, type: "PAGE.SET" };
  if (pressed === "End") return { index: last, type: "PAGE.SET" };

  const type = STEPS[orientation][pressed];

  return type === undefined ? undefined : { type };
}
