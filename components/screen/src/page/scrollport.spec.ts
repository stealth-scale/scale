import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useScrollport } from "#page/scrollport.ts";

/**
 * Custom property every case measures into.
 */
const PROPERTY = "--scrollport";

/**
 * Callbacks the stubbed `ResizeObserver` instances were created with.
 */
const observed: ResizeObserverCallback[] = [];

/**
 * Elements the stubbed observers watch, emptied when one disconnects.
 */
const watched: Element[] = [];

/**
 * Replaces `ResizeObserver` with one that records its callback for a case to run.
 */
function stubbed(): void {
  observed.length = 0;
  watched.length = 0;
  vi.stubGlobal(
    "ResizeObserver",
    class {
      /**
       * Records the callback.
       */
      constructor(callback: ResizeObserverCallback) {
        observed.push(callback);
      }

      /**
       * Forgets every watched element.
       */
      disconnect(): void {
        watched.length = 0;
      }

      /**
       * Records the element to watch.
       */
      observe(target: Element): void {
        watched.push(target);
      }
    },
  );
}

/**
 * Runs the first recorded observer's callback, as a resize does.
 */
function resized(): void {
  act(() => {
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the hook's callback reads neither argument
    observed[0]?.([], {} as ResizeObserver);
  });
}

/**
 * Returns an element inside a scrolling container of the given height, both in the document.
 */
function nested(height: number): { container: HTMLElement; element: HTMLElement } {
  const container = document.createElement("div");
  const element = document.createElement("div");

  container.style.overflowY = "auto";
  Object.defineProperty(container, "clientHeight", { configurable: true, value: height });
  container.append(element);
  document.body.append(container);

  return { container, element };
}

describe("useScrollport", () => {
  it("sets the height of the nearest ancestor that scrolls", () => {
    stubbed();
    const { element } = nested(480);

    renderHook(() => {
      useScrollport(element, PROPERTY);
    });

    expect(element.style.getPropertyValue(PROPERTY)).toBe("480px");
  });

  it("measures again when the scrolling ancestor resizes", () => {
    stubbed();
    const { container, element } = nested(480);

    renderHook(() => {
      useScrollport(element, PROPERTY);
    });
    Object.defineProperty(container, "clientHeight", { configurable: true, value: 320 });
    resized();

    expect(element.style.getPropertyValue(PROPERTY)).toBe("320px");
  });

  it("sets the window's height without an ancestor that scrolls", () => {
    const element = document.createElement("div");

    document.body.append(element);
    renderHook(() => {
      useScrollport(element, PROPERTY);
    });

    expect(element.style.getPropertyValue(PROPERTY)).toBe(`${String(window.innerHeight)}px`);
  });

  it("measures again when the window resizes", () => {
    const element = document.createElement("div");

    document.body.append(element);
    renderHook(() => {
      useScrollport(element, PROPERTY);
    });
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(610);
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(element.style.getPropertyValue(PROPERTY)).toBe("610px");
  });

  it("stops following the window once unmounted", () => {
    const element = document.createElement("div");

    document.body.append(element);
    const { unmount } = renderHook(() => {
      useScrollport(element, PROPERTY);
    });
    const before = element.style.getPropertyValue(PROPERTY);

    unmount();
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(1);
    window.dispatchEvent(new Event("resize"));

    expect(element.style.getPropertyValue(PROPERTY)).toBe(before);
  });

  it("watches the scrolling ancestor", () => {
    stubbed();
    const { container, element } = nested(480);

    renderHook(() => {
      useScrollport(element, PROPERTY);
    });

    expect(watched).toStrictEqual([container]);
  });

  it("stops watching the scrolling ancestor once unmounted", () => {
    stubbed();
    const { element } = nested(480);
    const { unmount } = renderHook(() => {
      useScrollport(element, PROPERTY);
    });

    unmount();

    expect(watched).toHaveLength(0);
  });

  it("does nothing without an element", () => {
    const { result } = renderHook(() => {
      useScrollport(null, PROPERTY);
    });

    expect(result.current).toBeUndefined();
  });
});
