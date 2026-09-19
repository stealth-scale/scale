/**
 * Measures an element against a width, rather than measuring the window.
 */

import { type RefObject, useLayoutEffect, useRef, useState } from "react";

import { useBreakpoint } from "#breakpoint.ts";
import { type Breakpoint } from "#size.ts";

/**
 * The breakpoint under which the viewport counts as narrow before an element has been measured.
 */
const BELOW: Breakpoint = "md";

/**
 * Describes what the hook is watching: the element, and the width it is measured against.
 */
interface Watched {
  /**
   * The element being measured.
   */
  readonly element: HTMLElement;

  /**
   * The width it is measured against.
   */
  readonly width: number;
}

/**
 * Reads whether an element is narrower than a width.
 *
 * @remarks
 *   The element is measured once it is laid out and again whenever its size changes, so a page
 *   beside an open sidebar answers for its own width rather than the window's. Before it is
 *   measured, and while the ref holds nothing, the answer comes from the viewport: narrow under the
 *   breakpoint given, which is what a phone is, so a phone never lays out wide first.
 *   The first measurement is taken in the layout effect itself and not left to the observer. The
 *   viewport's own first answer is its fallback, because the window is read in an effect, so the
 *   first render of every measured component is the narrow one. A measurement taken before the
 *   browser paints redraws the component wide in the same frame. Left to the observer, the narrow
 *   layout was painted first and the wide one a frame later, which read as the page's header
 *   sliding into place on every page opened.
 *   An element that measures no width has no box to compare, because it is not laid out or the
 *   document has no layout at all, and the answer it had stands.
 *   The wiring effect names no dependencies, because a ref changing is not a render and nothing
 *   else would notice an element that arrives after the first layout. It rewires only when the
 *   element or the width differs from what it is already watching, so running on every render
 *   costs one comparison. The teardown is held in a ref and run by a second effect, because the
 *   wiring effect returning it would stop watching on every render.
 * @param ref - The element to measure, which may hold nothing yet.
 * @param width - The width in pixels under which the element counts as narrow.
 * @param below - The breakpoint under which the viewport counts as narrow before the element is
 *   measured.
 * @returns Whether the element is narrower than the width.
 */
export function useNarrow(
  ref: RefObject<HTMLElement | null>,
  width: number,
  below: Breakpoint = BELOW,
): boolean {
  const at = useBreakpoint({ breakpoints: [below] });
  const guessed = at !== below;
  const [measured, setMeasured] = useState<boolean | undefined>();
  const watched = useRef<null | Watched>(null);
  const unwire = useRef<(() => void) | null>(null);

  useLayoutEffect(() => {
    const element = ref.current;

    if (element === watched.current?.element && width === watched.current.width) return;

    unwire.current?.();
    unwire.current = null;
    watched.current = element === null ? null : { element, width };

    if (element === null) return;

    /**
     * Measures the element and stores whether it is narrower than the width, unless it has no box.
     */
    const read = (): void => {
      const box = element.getBoundingClientRect().width;

      if (box > 0) setMeasured(box < width);
    };

    read();

    const observer = new ResizeObserver(read);

    observer.observe(element);

    unwire.current = (): void => {
      observer.disconnect();
    };
  });

  useLayoutEffect(() => {
    return (): void => {
      unwire.current?.();
      unwire.current = null;
    };
  }, []);

  return measured ?? guessed;
}
