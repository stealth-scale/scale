/**
 * Scrolls a sideways scroller until an element inside it is in view, and leaves the page where it
 * is.
 */

/**
 * Lists the values of `overflow-x` under which an element scrolls sideways.
 */
const SCROLLING = new Set(["auto", "scroll"]);

/**
 * Scrolls the first element in a frame that contains an element and scrolls sideways until the
 * element is inside it, by the least distance.
 *
 * @remarks
 *   The scroller is the first element in the frame that contains the element, scrolls sideways and
 *   is wider inside than it is, so a row that fits scrolls nothing. Chromium also reports a scroll
 *   area's overflow on the elements around it, which do not scroll. The element's own
 *   `scrollIntoView` also scrolls the page, and Firefox 155 ignores its `container: "nearest"`. An
 *   element under a sticky part of the scroller is revealed only up to the scroller's edge.
 * @param element - An element inside the scroller.
 * @param frame - The element the scroller is in.
 */
export function revealSideways(element: HTMLElement, frame: Element): void {
  const view = [...frame.querySelectorAll("*")].find(
    (candidate) =>
      candidate.contains(element) &&
      candidate.scrollWidth > candidate.clientWidth &&
      SCROLLING.has(getComputedStyle(candidate).overflowX),
  );

  if (view === undefined) return;

  const at = element.getBoundingClientRect();
  const box = view.getBoundingClientRect();

  view.scrollLeft += Math.max(0, at.right - box.right) - Math.max(0, box.left - at.left);
}
