/**
 * Renders the scroll areas the part specifications test, and lays out their viewports so the
 * machine measures an overflow.
 */

import { type ReactElement } from "react";

import { act } from "@testing-library/react";
import { vi } from "vitest";

import * as ScrollArea from "#scroll-area/index.ts";

/**
 * Side of the viewport, in pixels.
 */
const SIDE = 100;

/**
 * Renders a scroll area with a vertical bar, a horizontal bar and the corner, its viewport named
 * "Notes".
 *
 * @param props - The props the case sets on the root.
 * @param viewport - The props the case sets on the viewport.
 * @returns The scroll area.
 */
export function scrolled(
  props: Partial<ScrollArea.RootProps> = {},
  viewport: Partial<ScrollArea.ViewportProps> = {},
): ReactElement {
  return (
    <ScrollArea.Root {...props}>
      <ScrollArea.Viewport aria-label="Notes" {...viewport}>
        <ScrollArea.Content>
          <p>Exports run in the background.</p>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar />
      <ScrollArea.Scrollbar orientation="horizontal" />
      <ScrollArea.Corner />
    </ScrollArea.Root>
  );
}

/**
 * Describes the axes a case lets the content overflow.
 */
interface Overflow {
  /**
   * Whether the content is wider than the viewport.
   */
  readonly x?: boolean;

  /**
   * Whether the content is taller than the viewport.
   */
  readonly y?: boolean;
}

/**
 * Lays every element out at 100 by 100 pixels around content that overflows the named axes, and
 * replaces `IntersectionObserver` with a stub whose callback a case runs by hand.
 *
 * @remarks
 *   Happy-dom lays out nothing and never reports an intersection, so the machine never measures.
 *   The shared test preset restores the spies and unstubs the globals after every case.
 * @param overflow - The axes the content overflows.
 * @returns The function that reports the viewport as in view, which makes the machine measure.
 */
export function overflowing(overflow: Overflow): () => void {
  const held: { callback?: IntersectionObserverCallback; targets: Element[] } = { targets: [] };

  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(SIDE);
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(SIDE);
  vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(
    overflow.x === true ? SIDE * 4 : SIDE,
  );
  vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(
    overflow.y === true ? SIDE * 4 : SIDE,
  );

  /**
   * Replaces `IntersectionObserver`, keeping its callback and its targets.
   */
  class Stub {
    /**
     * Keeps the callback the observer runs on a change of intersection.
     *
     * @param callback - The callback.
     */
    constructor(callback: IntersectionObserverCallback) {
      held.callback = callback;
    }

    /**
     * Accepts the end of observation, as the real observer does.
     */
    disconnect(): void {
      held.targets = [];
    }

    /**
     * Keeps an observed element.
     *
     * @param target - The element.
     */
    observe(target: Element): void {
      held.targets.push(target);
    }
  }

  vi.stubGlobal("IntersectionObserver", Stub);

  return () => {
    const entries = held.targets.map((target) => ({ intersectionRatio: 1, target }));

    act(() => {
      // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the machine reads intersectionRatio, which each entry contains
      held.callback?.(
        entries as unknown as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      );
    });
  };
}
