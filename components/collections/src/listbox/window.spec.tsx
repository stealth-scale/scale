import { type ReactElement, type ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Window } from "#listbox/window.tsx";
import { type Windowed, WindowedProvider } from "#listbox/windowed.ts";

/**
 * How tall one row of every case is.
 */
const ROW = 40;

/**
 * Takes a window's way of scrolling and drops it, which is all a case needs of a list.
 */
function ignored(): Windowed["hold"] {
  return vi.fn<Windowed["hold"]>();
}

/**
 * Draws a window inside a list that reports what the window hands it.
 *
 * @param children - The window under test.
 * @param hold - What the list does with the window's way of scrolling.
 * @returns The scrolling box, holding the window.
 */
function scrolling(children: ReactNode, hold: Windowed["hold"] = ignored()): ReactElement {
  return (
    <WindowedProvider value={{ hold }}>
      <div data-testid="scroller">{children}</div>
    </WindowedProvider>
  );
}

/**
 * Names the rows a window drew.
 */
function drawn(): string {
  return screen.getByTestId("scroller").textContent ?? "";
}

/**
 * Draws a window in a box of a stated height, asks it to reach one row, and reports where it
 * scrolled to.
 *
 * @remarks
 *   The height, the scroll position and both rectangles are stated because a document with no
 *   layout reports every one of them as nothing, and a window told the box shows none of itself
 *   scrolls to every row. The room's rectangle sits as far above the box's as the list is scrolled,
 *   which is where a browser puts it.
 * @param index - The row to reach.
 * @param from - Where the list is scrolled to before the row is reached.
 * @returns What the window asked the box to scroll to.
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
  it("holds the room every row of the list would take", () => {
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

  it("draws the rows at the start of a list nobody has scrolled", () => {
    render(
      scrolling(
        <Window count={1000} overscan={2} rowHeight={ROW}>
          {({ first, last }) => `${String(first)}:${String(last)}`}
        </Window>,
      ),
    );

    expect(drawn()).toBe("0:2");
  });

  it("draws further past each end where a caller asks for more room to spare", () => {
    render(
      scrolling(
        <Window count={1000} overscan={9} rowHeight={ROW}>
          {({ first, last }) => `${String(first)}:${String(last)}`}
        </Window>,
      ),
    );

    expect(drawn()).toBe("0:9");
  });

  it("draws no further than the list is long", () => {
    render(
      scrolling(
        <Window count={3} overscan={9} rowHeight={ROW}>
          {({ first, last }) => `${String(first)}:${String(last)}`}
        </Window>,
      ),
    );

    expect(drawn()).toBe("0:3");
  });

  it("hands the list a way to scroll to a row the list has not drawn", () => {
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

  it("takes that way back when the window goes, so the list scrolls by its own means again", () => {
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

  it("scrolls far enough to bring a row below the window on to the screen", () => {
    expect(reached(12)).toStrictEqual({ top: 120 });
  });

  it("leaves the list where it is for a row already on the screen", () => {
    expect(reached(2)).toStrictEqual({ top: 0 });
  });

  it("scrolls back to a row above the window", () => {
    expect(reached(1, 400)).toStrictEqual({ top: 40 });
  });

  it("scrolls nowhere until it knows how tall a row is", () => {
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
