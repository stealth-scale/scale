import { type FocusEvent } from "react";

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { tableOf } from "#data-table/data-table.fixtures.tsx";
import { useWindow, type WindowOptions } from "#data-table/use-window.ts";
import { boxed, centerOf, entriesOf, observer } from "#data-table/windowed.fixtures.ts";

/**
 * Returns a viewport of the height given, in the document.
 */
function viewportAt(height = 400): HTMLDivElement {
  const viewport = document.createElement("div");

  Object.defineProperty(viewport, "offsetHeight", { value: height });
  document.body.append(viewport);

  return viewport;
}

/**
 * Returns the options of a window over rows of entries.
 */
function optionsOf(given: Partial<WindowOptions> = {}, count = 100): WindowOptions {
  const lines = centerOf(tableOf({ data: entriesOf(count) }));

  return {
    estimateSize: 40,
    kept: undefined,
    lines,
    onEndReached: undefined,
    overscan: 2,
    rows: lines.length,
    viewport: null,
    ...given,
  };
}

/**
 * Returns a focus event whose target and related target are the elements given.
 */
function focusOf(
  target: Element,
  relatedTarget: Element | null = null,
): FocusEvent<HTMLTableSectionElement> {
  const currentTarget = document.createElement("tbody");

  currentTarget.append(target);

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the handlers read these three fields only
  return { currentTarget, relatedTarget, target } as unknown as FocusEvent<HTMLTableSectionElement>;
}

/**
 * Returns a line's row with the key given.
 */
function lineKeyed(key: string): HTMLTableRowElement {
  const row = document.createElement("tr");

  row.dataset["key"] = key;

  return row;
}

describe("useWindow", () => {
  it("returns no lines before the viewport exists", () => {
    const options = optionsOf();
    const { result } = renderHook(() => useWindow(options));

    expect(result.current.items).toStrictEqual([]);
  });

  it("returns the estimate per line as the total height", () => {
    const options = optionsOf();
    const { result } = renderHook(() => useWindow(options));

    expect(result.current.total).toBe(4000);
  });

  it("returns the lines in view and the overscan", () => {
    observer();
    const options = optionsOf({ viewport: viewportAt() });
    const { result } = renderHook(() => useWindow(options));

    expect(result.current.items.map((item) => item.index)).toStrictEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    ]);
  });

  it("takes the first measured line's height for every line after", () => {
    observer();
    const options = optionsOf({ viewport: viewportAt() });
    const { result } = renderHook(() => useWindow(options));
    const row = document.createElement("tr");

    row.dataset["index"] = "0";
    Object.defineProperty(row, "offsetHeight", { value: 50 });
    act(() => {
      result.current.measure(row);
    });

    expect(result.current.total).toBe(5000);
  });

  it("calls onEndReached once while the last line is within the overscan", () => {
    observer();
    const onEndReached = vi.fn<() => void>();
    const options = optionsOf({ onEndReached, viewport: viewportAt() }, 12);
    const { rerender } = renderHook(() => useWindow(options));

    rerender();

    expect(onEndReached.mock.calls).toStrictEqual([[]]);
  });

  it("calls onEndReached again once the number of rows changes", () => {
    observer();
    const onEndReached = vi.fn<() => void>();
    const options = optionsOf({ onEndReached, viewport: viewportAt() }, 12);
    const { rerender } = renderHook((rows: number) => useWindow({ ...options, rows }), {
      initialProps: 12,
    });

    rerender(13);

    expect(onEndReached).toHaveBeenCalledTimes(2);
  });

  it("calls no onEndReached while the last line is past the overscan", () => {
    observer();
    const onEndReached = vi.fn<() => void>();
    const options = optionsOf({ onEndReached, viewport: viewportAt() });

    renderHook(() => useWindow(options));

    expect(onEndReached).not.toHaveBeenCalled();
  });

  it("keeps the line that contains focus among the lines to render", () => {
    observer();
    const options = optionsOf({ viewport: viewportAt() });
    const { result } = renderHook(() => useWindow(options));

    act(() => {
      result.current.onFocus(focusOf(lineKeyed("record:Entry 050")));
    });

    expect(result.current.items.at(-1)?.index).toBe(49);
  });

  it("keeps the kept record's row among the lines to render", () => {
    observer();
    const options = optionsOf({ kept: "Entry 060", viewport: viewportAt() });
    const { result } = renderHook(() => useWindow(options));

    expect(result.current.items.at(-1)?.index).toBe(59);
  });

  it("keeps both the focused line and the kept record's row", () => {
    observer();
    const options = optionsOf({ kept: "Entry 060", viewport: viewportAt() });
    const { result } = renderHook(() => useWindow(options));

    act(() => {
      result.current.onFocus(focusOf(lineKeyed("record:Entry 050")));
    });

    expect(result.current.items.slice(-2).map((item) => item.index)).toStrictEqual([49, 59]);
  });

  it("forgets the focused line once focus leaves the rows", () => {
    observer();
    const options = optionsOf({ viewport: viewportAt() });
    const { result } = renderHook(() => useWindow(options));

    act(() => {
      result.current.onFocus(focusOf(lineKeyed("record:Entry 050")));
    });
    act(() => {
      result.current.onBlur(focusOf(document.createElement("tr"), document.body));
    });

    expect(result.current.items.at(-1)?.index).toBe(11);
  });

  it("keeps the focused line while focus moves inside the rows", () => {
    observer();
    const options = optionsOf({ viewport: viewportAt() });
    const { result } = renderHook(() => useWindow(options));
    const line = lineKeyed("record:Entry 050");
    const next = document.createElement("tr");

    act(() => {
      result.current.onFocus(focusOf(line));
    });
    act(() => {
      const event = focusOf(line, next);

      event.currentTarget.append(next);
      result.current.onBlur(event);
    });

    expect(result.current.items.at(-1)?.index).toBe(49);
  });

  it("measures where the rows start after a resize of their table", () => {
    const resized = observer();
    const viewport = viewportAt();
    const sheet = document.createElement("table");
    const options = optionsOf({ viewport });
    const { result } = renderHook(() => useWindow(options));

    sheet.createTHead();
    viewport.append(sheet);
    boxed({
      div: new DOMRect(0, 0, 400, 400),
      tbody: new DOMRect(0, 37, 400, 400),
      thead: new DOMRect(0, 0, 400, 37),
    });
    act(() => {
      result.current.body(sheet.createTBody());
    });
    resized();

    expect(result.current.placement).toStrictEqual({ head: 37, margin: 37 });
  });

  it("measures nothing without a viewport", () => {
    const resized = observer();
    const sheet = document.createElement("table");
    const options = optionsOf();
    const { result } = renderHook(() => useWindow(options));

    sheet.createTHead();
    act(() => {
      result.current.body(sheet.createTBody());
    });
    resized();

    expect(result.current.placement).toStrictEqual({ head: 0, margin: 0 });
  });
});
