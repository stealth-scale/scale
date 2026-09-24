import { type ReactElement, type ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Window } from "#listbox/window.tsx";
import { type Windowed, WindowedProvider } from "#listbox/windowed.ts";

/**
 * Row height of every case, in pixels.
 */
const ROW = 40;

/**
 * Returns a slot that discards the window's scroll function.
 */
function ignored(): Windowed["hold"] {
  return vi.fn<Windowed["hold"]>();
}

/**
 * Renders a window inside a scroll container, with a slot for its scroll function.
 *
 * @param children - The window under test.
 * @param hold - The slot the window passes its scroll function to.
 * @returns The scroll container with the window inside it.
 */
function scrolling(children: ReactNode, hold: Windowed["hold"] = ignored()): ReactElement {
  return (
    <WindowedProvider value={{ hold }}>
      <div data-testid="scroller">{children}</div>
    </WindowedProvider>
  );
}

/**
 * Returns the text the window rendered.
 */
function drawn(): string {
  return screen.getByTestId("scroller").textContent ?? "";
}

/**
 * Renders a window in a 400px scroll container, scrolls to one row, and returns the scroll
 * position the window set.
 *
 * @remarks
 *   Happy-dom has no layout, so the case states the container's height, its scroll position and
 *   both rectangles. The window's rectangle is offset above the container's by the scroll
 *   position.
 * @param index - The row to scroll to.
 * @param from - The scroll position before the call.
 * @returns The options the window passed to `scrollTo`.
 */
function reached(index: number, from = 0): unknown {
  let held: ((index: number) => void) | null = null;

  render(
    scrolling(
      <Window count={1000} rowHeight={ROW}>
        {() => null}
      </Window>,
      (scroll) => {
        held = scroll;
      },
    ),
  );

  const scroller = screen.getByTestId("scroller");
  const room = scroller.firstElementChild;

  Object.defineProperty(scroller, "clientHeight", { configurable: true, value: 400 });
  Object.defineProperty(scroller, "scrollTop", { configurable: true, value: from });
  vi.spyOn(scroller, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 200, 400));
  vi.spyOn(room as Element, "getBoundingClientRect").mockReturnValue(
    new DOMRect(0, -from, 200, 40_000),
  );

  const went = vi.spyOn(scroller, "scrollTo").mockImplementation(() => {});

  (held as ((index: number) => void) | null)?.(index);

  return went.mock.calls[0]?.[0];
}

describe("Window", () => {
  it("sets its height to the row count times the row height", () => {
    const { container } = render(
      scrolling(
        <Window count={1000} rowHeight={ROW}>
          {() => null}
        </Window>,
      ),
    );

    expect(container.querySelector<HTMLElement>("[style*=block-size]")?.style.blockSize).toBe(
      "40000px",
    );
  });

  it("renders the overscan rows at the top of an unscrolled list", () => {
    render(
      scrolling(
        <Window count={1000} overscan={2} rowHeight={ROW}>
          {({ first, last }) => `${String(first)}:${String(last)}`}
        </Window>,
      ),
    );

    expect(drawn()).toBe("0:2");
  });

  it("renders more rows with a larger overscan", () => {
    render(
      scrolling(
        <Window count={1000} overscan={9} rowHeight={ROW}>
          {({ first, last }) => `${String(first)}:${String(last)}`}
        </Window>,
      ),
    );

    expect(drawn()).toBe("0:9");
  });

  it("stops the range at the row count", () => {
    render(
      scrolling(
        <Window count={3} overscan={9} rowHeight={ROW}>
          {({ first, last }) => `${String(first)}:${String(last)}`}
        </Window>,
      ),
    );

    expect(drawn()).toBe("0:3");
  });

  it("passes a scroll function to the slot", () => {
    const hold = vi.fn<Windowed["hold"]>();

    render(
      scrolling(
        <Window count={1000} rowHeight={ROW}>
          {() => null}
        </Window>,
        hold,
      ),
    );

    expect(hold).toHaveBeenCalledWith(expect.any(Function));
  });

  it("clears the slot on unmount", () => {
    const hold = vi.fn<Windowed["hold"]>();
    const { unmount } = render(
      scrolling(
        <Window count={1000} rowHeight={ROW}>
          {() => null}
        </Window>,
        hold,
      ),
    );

    unmount();

    expect(hold).toHaveBeenLastCalledWith(null);
  });

  it("scrolls down to bring a row below the viewport into view", () => {
    expect(reached(12)).toStrictEqual({ top: 120 });
  });

  it("keeps the scroll position for a row in view", () => {
    expect(reached(2)).toStrictEqual({ top: 0 });
  });

  it("scrolls up to a row above the viewport", () => {
    expect(reached(1, 400)).toStrictEqual({ top: 40 });
  });

  it("does not scroll while the row height is unknown", () => {
    let held: ((index: number) => void) | null = null;

    render(
      scrolling(<Window count={1000}>{() => null}</Window>, (scroll) => {
        held = scroll;
      }),
    );

    const scroller = screen.getByTestId("scroller");
    const went = vi.spyOn(scroller, "scrollTo").mockImplementation(() => {});

    (held as ((index: number) => void) | null)?.(12);

    expect(went).not.toHaveBeenCalled();
  });
});
