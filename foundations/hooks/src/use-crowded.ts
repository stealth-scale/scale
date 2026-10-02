/**
 * Reports whether the children of an element need more room than the element has at their natural
 * width, for a component that switches to a narrower layout while they do not fit.
 *
 * @remarks
 *   The hook lays the children out at their natural width for one synchronous measurement: it
 *   removes `data-crowded`, sets `data-measuring`, reads whether the element overflows, and
 *   restores both attributes before the browser paints. A recipe renders the natural layout while
 *   `data-measuring` is set and the narrower one while `data-crowded` is set, so every measurement
 *   reads the natural width whichever layout shows, and the result does not flip between the two.
 *   The element is measured again whenever its size changes.
 */

import { type RefCallback, useState } from "react";

import { useSafeLayoutEffect } from "#use-safe-layout-effect.ts";

/**
 * Returns whether the element's children, laid out at their natural width, overflow it.
 *
 * @remarks
 *   A pixel of tolerance, because sub-pixel layout leaves the scroll width a fraction over the
 *   client width for children that fit.
 * @param element - The element whose children are measured.
 * @returns `true` when the children need more room than the element has.
 */
export function crowded(element: HTMLElement): boolean {
  const was = element.dataset["crowded"];

  delete element.dataset["crowded"];
  element.dataset["measuring"] = "";

  const overflowing = element.scrollWidth - element.clientWidth > 1;

  delete element.dataset["measuring"];
  if (was !== undefined) element.dataset["crowded"] = was;

  return overflowing;
}

/**
 * Measures an element whenever its size changes and reports the result.
 *
 * @param element - The element to measure.
 * @param report - Receives whether the element is crowded after each change of size.
 * @returns The function that stops observing the element.
 */
export function observed(element: HTMLElement, report: (crowded: boolean) => void): () => void {
  const observer = new ResizeObserver(() => {
    report(crowded(element));
  });

  observer.observe(element);

  return (): void => {
    observer.disconnect();
  };
}

/**
 * Observes an element's size and returns whether its children do not fit at their natural width,
 * with the ref callback that attaches the element.
 *
 * @remarks
 *   The caller sets `data-crowded` on the element from the result, and its recipe reads the
 *   attribute. The result is `false` until the first measurement.
 * @returns Whether the element is crowded, and the ref callback for the element.
 */
export function useCrowded(): readonly [boolean, RefCallback<HTMLElement>] {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [isCrowded, setCrowded] = useState(false);

  useSafeLayoutEffect(
    () => (element === null ? undefined : observed(element, setCrowded)),
    [element],
  );

  return [isCrowded, setElement];
}
