import { createRef, type ReactNode, type RefObject } from "react";

import { act, renderHook, type RenderHookResult } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useNarrow } from "#narrow.ts";
import { ViewportProvider } from "#provider.tsx";
import { type Breakpoint } from "#size.ts";

/**
 * The width under which the hook calls an element narrow, in every case here.
 */
const THRESHOLD = 600;

/**
 * Reaches the observers the hook built, so a case can report a size change or count the stops.
 */
interface Observers {
  resize: () => void;
  stopped: () => number;
}

/**
 * Reaches an element and the width it reports.
 */
interface Measured {
  ref: RefObject<HTMLElement | null>;
  reports: (width: number) => void;
}

/**
 * Puts a resize observer in place of the page's own, which this document implementation lacks.
 *
 * @remarks
 *   Observing reports the size at once, as the browser's own does, so a hook that measures on
 *   mount has something to measure.
 */
function observing(): Observers {
  const callbacks = new Set<() => void>();
  let stopped = 0;

  class Observer {
    readonly onResize: () => void;

    constructor(onResize: () => void) {
      this.onResize = onResize;
      callbacks.add(onResize);
    }

    disconnect(): void {
      stopped += 1;
      callbacks.delete(this.onResize);
    }

    observe(): void {
      this.onResize();
    }
  }

  vi.stubGlobal("ResizeObserver", Observer);

  return {
    resize: () => {
      for (const one of callbacks) one();
    },
    stopped: () => stopped,
  };
}

/**
 * Puts a resize observer in place that reports nothing on its own, so a case can tell a
 * measurement the hook took itself from one the observer reported.
 */
function silent(): void {
  vi.stubGlobal(
    "ResizeObserver",
    vi.fn(function Observer() {
      return { disconnect: vi.fn(), observe: vi.fn() };
    }),
  );
}

/**
 * Holds an element reporting the width a case gives it.
 */
function measuring(width: number): Measured {
  const element = document.createElement("div");
  const ref = createRef<HTMLElement>();
  let held = width;

  vi.spyOn(element, "getBoundingClientRect").mockImplementation(
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the hook reads the width alone off what the element reports
    () => ({ width: held }) as DOMRect,
  );

  ref.current = element;

  return {
    ref,
    reports: (next) => {
      held = next;
    },
  };
}

/**
 * Reads the hook under a provider laid out for a width.
 */
function under(
  ref: RefObject<HTMLElement | null>,
  viewport: number,
  below?: Breakpoint,
): RenderHookResult<boolean, unknown> {
  return renderHook(() => useNarrow(ref, THRESHOLD, below), {
    wrapper: ({ children }: { children?: ReactNode }) => (
      <ViewportProvider width={viewport}>{children}</ViewportProvider>
    ),
  });
}

describe("useNarrow", () => {
  it("answers from the element's own width once it has been measured", () => {
    observing();

    expect(under(measuring(400).ref, 4000).result.current).toBe(true);
  });

  it("calls an element wider than the width wide", () => {
    observing();

    expect(under(measuring(900).ref, 320).result.current).toBe(false);
  });

  it("measures the element itself before the observer reports", () => {
    silent();

    expect(under(measuring(900).ref, 320).result.current).toBe(false);
  });

  it("keeps the viewport's word for an element that has no box", () => {
    observing();

    expect(under(measuring(0).ref, 4000).result.current).toBe(false);
    expect(under(measuring(0).ref, 320).result.current).toBe(true);
  });

  it("measures again when the element changes size", () => {
    const observers = observing();
    const element = measuring(900);
    const { result } = under(element.ref, 320);

    element.reports(400);

    act(() => {
      observers.resize();
    });

    expect(result.current).toBe(true);
  });

  it("stops watching the element when the component unmounts", () => {
    const observers = observing();
    const { unmount } = under(measuring(900).ref, 320);

    unmount();

    expect(observers.stopped()).toBe(1);
  });

  it("takes the viewport's word while the ref holds nothing to measure", () => {
    observing();

    expect(under(createRef<HTMLElement>(), 320).result.current).toBe(true);
  });

  it("measures an element that arrives after the first layout", () => {
    observing();

    const ref = createRef<HTMLElement>();
    const { rerender, result } = under(ref, 4000);

    ref.current = measuring(400).ref.current;
    rerender();

    expect(result.current).toBe(true);
  });

  it("keeps watching one element across renders that change nothing", () => {
    const observers = observing();
    const { rerender } = under(measuring(900).ref, 320);

    rerender();
    rerender();

    expect(observers.stopped()).toBe(0);
  });

  it("measures again against a width the caller moves", () => {
    observing();

    const { ref } = measuring(700);
    const { rerender, result } = renderHook(
      ({ width }: { width: number }) => useNarrow(ref, width),
      {
        initialProps: { width: 600 },
        wrapper: ({ children }: { children?: ReactNode }) => (
          <ViewportProvider width={4000}>{children}</ViewportProvider>
        ),
      },
    );

    rerender({ width: 800 });

    expect(result.current).toBe(true);
  });

  it("calls a wide viewport wide while the ref holds nothing", () => {
    observing();

    expect(under(createRef<HTMLElement>(), 4000).result.current).toBe(false);
  });

  it("guesses under the breakpoint a caller names in place of md", () => {
    observing();

    expect(under(createRef<HTMLElement>(), 800, "lg").result.current).toBe(true);
  });
});
