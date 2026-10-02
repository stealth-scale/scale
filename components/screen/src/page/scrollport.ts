/**
 * Measures the height of the area that scrolls an element, for a sticky element that must fit it.
 *
 * @remarks
 *   A sticky element taller than the area that scrolls it cannot show its end until the page ends.
 *   CSS has no unit for a scroll container's height, so the hook measures it when the element
 *   mounts, and again whenever the container or the window resizes.
 */

import { useLayoutEffect } from "react";

/**
 * Returns the nearest ancestor that scrolls on the block axis, or `null` when the window scrolls.
 *
 * @param element - The element whose ancestors are searched.
 */
function scrollerOf(element: HTMLElement): HTMLElement | null {
  for (let node = element.parentElement; node !== null; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node);

    if (overflowY === "auto" || overflowY === "scroll") return node;
  }

  return null;
}

/**
 * Keeps a custom property on the element at the height, in pixels, of the nearest ancestor that
 * scrolls it, or of the window.
 *
 * @param element - The element, or `null` while nothing is mounted.
 * @param property - The custom property the element's recipe reads.
 */
export function useScrollport(element: HTMLElement | null, property: string): void {
  useLayoutEffect((): (() => void) | undefined => {
    if (element === null) return undefined;

    const scroller = scrollerOf(element);

    /**
     * Writes the height of the scroller, or of the window, on the element.
     */
    const measure = (): void => {
      const height = scroller === null ? window.innerHeight : scroller.clientHeight;

      element.style.setProperty(property, `${String(height)}px`);
    };

    measure();
    if (scroller === null) {
      window.addEventListener("resize", measure);

      return (): void => {
        window.removeEventListener("resize", measure);
      };
    }

    const observer = new ResizeObserver(measure);

    observer.observe(scroller);

    return (): void => {
      observer.disconnect();
    };
  }, [element, property]);
}
