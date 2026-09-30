import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PLACES, walkedGrid } from "#heat/walk.fixtures.tsx";
import { cellIn, type Press, reveal, stepOf } from "#heat/walk.ts";

/**
 * Returns a press of a key with no modifier.
 */
function pressOf(key: string, changes: Partial<Press> = {}): Press {
  return { ctrlKey: false, key, metaKey: false, ...changes };
}

/**
 * Returns the cell with a key, which is its text.
 */
function cell(key: string): HTMLElement {
  return screen.getByText(key, { selector: "td" });
}

/**
 * Returns the key of the cell the readout shows, or "none".
 */
function shown(): string {
  return screen.getByRole("status").textContent;
}

/**
 * Describes a frame around a view 200px wide around a target cell: the three elements.
 */
interface Scrolled {
  readonly frame: HTMLElement;
  readonly target: HTMLElement;
  readonly view: HTMLElement;
}

/**
 * Builds a frame around a view 200px wide at the page's start, 600px wide inside unless stated,
 * around a target cell at a box, with the view's `overflow-x` as stated.
 */
function scrolled(box: DOMRect, overflowX = "auto", inside = 600): Scrolled {
  const frame = document.createElement("div");
  const view = document.createElement("div");
  const target = document.createElement("span");

  view.style.overflowX = overflowX;
  Object.defineProperty(view, "clientWidth", { value: 200 });
  Object.defineProperty(view, "scrollWidth", { value: inside });
  Object.defineProperty(view, "scrollLeft", { value: 100, writable: true });
  vi.spyOn(view, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 200, 300));
  vi.spyOn(target, "getBoundingClientRect").mockReturnValue(box);
  view.append(target);
  frame.append(view);
  document.body.append(frame);

  return { frame, target, view };
}

/**
 * Focuses a cell as a key or a press would.
 */
function focused(key: string): HTMLElement {
  const target = cell(key);

  act(() => {
    target.focus();
  });

  return target;
}

describe("walk", () => {
  it.each([
    { from: "a1", key: "ArrowRight", want: "a2" },
    { from: "b1", key: "ArrowRight", want: "b3" },
    { from: "a3", key: "ArrowRight", want: "a3" },
    { from: "a2", key: "ArrowLeft", want: "a1" },
    { from: "a3", key: "ArrowLeft", want: "a2" },
    { from: "b3", key: "ArrowLeft", want: "b1" },
    { from: "a1", key: "ArrowLeft", want: "a1" },
    { from: "a1", key: "ArrowDown", want: "b1" },
    { from: "b3", key: "ArrowDown", want: "b3" },
    { from: "b3", key: "ArrowUp", want: "a3" },
    { from: "a2", key: "ArrowUp", want: "a2" },
    { from: "a2", key: "Home", want: "a1" },
    { from: "b1", key: "End", want: "b3" },
  ])("moves $key from $from to $want", ({ from, key, want }) => {
    expect(stepOf(PLACES, from, pressOf(key), false)).toBe(want);
  });

  it("keeps focus on a cell with no cell under it", () => {
    expect(stepOf(PLACES, "a2", pressOf("ArrowDown"), false)).toBe("a2");
  });

  it("moves ArrowRight towards the start of a row laid out right to left", () => {
    expect(stepOf(PLACES, "a2", pressOf("ArrowRight"), true)).toBe("a1");
  });

  it("moves ArrowLeft towards the end of a row laid out right to left", () => {
    expect(stepOf(PLACES, "a2", pressOf("ArrowLeft"), true)).toBe("a3");
  });

  it("moves Home with Control to the grid's first cell", () => {
    expect(stepOf(PLACES, "b3", pressOf("Home", { ctrlKey: true }), false)).toBe("a1");
  });

  it("moves End with Command to the grid's last cell", () => {
    expect(stepOf(PLACES, "a1", pressOf("End", { metaKey: true }), false)).toBe("b3");
  });

  it("returns undefined for a key the walk does not handle", () => {
    expect(stepOf(PLACES, "a1", pressOf("Tab"), false)).toBeUndefined();
  });

  it("returns from for an arrow when from is not a key of places", () => {
    expect(stepOf(PLACES, "z9", pressOf("ArrowRight"), false)).toBe("z9");
  });

  it("finds a cell whose key contains a selector's characters", () => {
    const root = document.createElement("div");
    const pair = document.createElement("span");

    pair.dataset["cell"] = '["tue","10"]';
    root.append(pair);

    expect(cellIn(root, '["tue","10"]')).toBe(pair);
  });

  it("finds no cell for a key no cell has", () => {
    const root = document.createElement("div");

    expect(cellIn(root, "a1")).toBeUndefined();
  });

  it("scrolls the view until a cell past its end is inside it", () => {
    const { frame, target, view } = scrolled(new DOMRect(300, 0, 40, 30));

    reveal(target, frame);
    frame.remove();

    expect(view.scrollLeft).toBe(240);
  });

  it("scrolls the view back until a cell before its start is inside it", () => {
    const { frame, target, view } = scrolled(new DOMRect(-60, 0, 40, 30));

    reveal(target, frame);
    frame.remove();

    expect(view.scrollLeft).toBe(40);
  });

  it("scrolls the view around the cell over another view in the frame", () => {
    const { frame, target, view } = scrolled(new DOMRect(300, 0, 40, 30));
    const other = document.createElement("div");

    other.style.overflowX = "auto";
    Object.defineProperty(other, "clientWidth", { value: 200 });
    Object.defineProperty(other, "scrollWidth", { value: 600 });
    frame.prepend(other);
    reveal(target, frame);
    frame.remove();

    expect(view.scrollLeft).toBe(240);
  });

  it("scrolls nothing while the view fits its contents", () => {
    const { frame, target, view } = scrolled(new DOMRect(300, 0, 40, 30), "auto", 200);

    reveal(target, frame);
    frame.remove();

    expect(view.scrollLeft).toBe(100);
  });

  it("scrolls nothing around a cell whose wider ancestor does not scroll", () => {
    const { frame, target, view } = scrolled(new DOMRect(300, 0, 40, 30), "visible");

    reveal(target, frame);
    frame.remove();

    expect(view.scrollLeft).toBe(100);
  });

  it("gives the tab stop to the first cell", () => {
    render(walkedGrid());

    expect(cell("a1").tabIndex).toBe(0);
  });

  it("takes every other cell out of the tab order", () => {
    render(walkedGrid());

    expect(cell("b3").tabIndex).toBe(-1);
  });

  it("gives the tab stop to the initial cell", () => {
    render(walkedGrid({ initial: "b1" }));

    expect(cell("b1").tabIndex).toBe(0);
  });

  it("gives the tab stop to the first cell when its cell leaves the grid", () => {
    const { rerender } = render(walkedGrid({ initial: "b1" }));

    rerender(walkedGrid({ initial: "b1" }, [["c1", "c2"]]));

    expect(cell("c1").tabIndex).toBe(0);
  });

  it("moves focus to the next cell on ArrowRight", () => {
    render(walkedGrid());
    fireEvent.keyDown(focused("a1"), { key: "ArrowRight" });

    expect(document.activeElement).toBe(cell("a2"));
  });

  it("moves the tab stop with focus", () => {
    render(walkedGrid());
    fireEvent.keyDown(focused("a1"), { key: "ArrowDown" });

    expect(cell("b1").tabIndex).toBe(0);
  });

  it("cancels an arrow it handles", () => {
    render(walkedGrid());

    expect(fireEvent.keyDown(focused("a1"), { key: "ArrowRight" })).toBe(false);
  });

  it("cancels an arrow at the grid's edge", () => {
    render(walkedGrid());

    expect(fireEvent.keyDown(focused("a3"), { key: "ArrowRight" })).toBe(false);
  });

  it("leaves a key it does not handle to the browser", () => {
    render(walkedGrid());

    expect(fireEvent.keyDown(focused("a1"), { key: "Tab" })).toBe(true);
  });

  it("leaves an arrow with Alt to the browser", () => {
    render(walkedGrid());

    expect(fireEvent.keyDown(focused("a2"), { altKey: true, key: "ArrowLeft" })).toBe(true);
  });

  it("leaves an arrow with Control to the system", () => {
    render(walkedGrid());

    expect(fireEvent.keyDown(focused("a2"), { ctrlKey: true, key: "ArrowLeft" })).toBe(true);
  });

  it("leaves an arrow with Command to the system", () => {
    render(walkedGrid());

    expect(fireEvent.keyDown(focused("a2"), { key: "ArrowLeft", metaKey: true })).toBe(true);
  });

  it("moves focus on Home with Control", () => {
    render(walkedGrid());
    fireEvent.keyDown(focused("b3"), { ctrlKey: true, key: "Home" });

    expect(document.activeElement).toBe(cell("a1"));
  });

  it("ignores a key pressed outside a cell", () => {
    render(walkedGrid());

    expect(fireEvent.keyDown(screen.getByRole("grid"), { key: "ArrowRight" })).toBe(true);
  });

  it.each(["Enter", " "])("calls onSelect with the focused cell's key on %j", (key) => {
    const onSelect = vi.fn<(key: string) => void>();

    render(walkedGrid({ onSelect }));
    fireEvent.keyDown(focused("a2"), { key });

    expect(onSelect).toHaveBeenCalledWith("a2");
  });

  it("cancels Space so the page does not scroll", () => {
    render(walkedGrid());

    expect(fireEvent.keyDown(focused("a2"), { key: " " })).toBe(false);
  });

  it("calls onSelect with a pressed cell's key", () => {
    const onSelect = vi.fn<(key: string) => void>();

    render(walkedGrid({ onSelect }));
    fireEvent.click(cell("b3"));

    expect(onSelect).toHaveBeenCalledWith("b3");
  });

  it("ignores a press outside a cell", () => {
    const onSelect = vi.fn<(key: string) => void>();

    render(walkedGrid({ onSelect }));
    fireEvent.click(screen.getByRole("columnheader"));

    expect(onSelect).not.toHaveBeenCalled();
  });

  it("shows no cell before the pointer or focus enters one", () => {
    render(walkedGrid());

    expect(shown()).toBe("none");
  });

  it("shows the initial cell before the pointer or focus enters one", () => {
    render(walkedGrid({ initial: "a3" }));

    expect(shown()).toBe("a3");
  });

  it("shows the cell under the pointer", () => {
    render(walkedGrid({ initial: "a3" }));
    fireEvent.pointerOver(cell("b1"));

    expect(shown()).toBe("b1");
  });

  it("shows the focused cell", () => {
    render(walkedGrid({ initial: "a3" }));
    focused("a2");

    expect(shown()).toBe("a2");
  });

  it("shows the cell under the pointer over the focused cell", () => {
    render(walkedGrid());
    focused("a2");
    fireEvent.pointerOver(cell("b3"));

    expect(shown()).toBe("b3");
  });

  it("shows the focused cell again once the pointer leaves the grid", () => {
    render(walkedGrid());
    focused("a2");
    fireEvent.pointerOver(cell("b3"));
    fireEvent.pointerLeave(screen.getByRole("grid"));

    expect(shown()).toBe("a2");
  });

  it("shows no cell while the pointer is over a header", () => {
    render(walkedGrid());
    fireEvent.pointerOver(screen.getByRole("columnheader"));

    expect(shown()).toBe("none");
  });

  it("keeps showing the initial cell while the pointer is over a header", () => {
    render(walkedGrid({ initial: "a3" }));
    fireEvent.pointerOver(screen.getByRole("columnheader"));

    expect(shown()).toBe("a3");
  });

  it("stops showing the initial cell after the pointer leaves a cell it entered", () => {
    render(walkedGrid({ initial: "a3" }));
    fireEvent.pointerOver(cell("b1"));
    fireEvent.pointerLeave(screen.getByRole("grid"));

    expect(shown()).toBe("none");
  });

  it("stops showing the focused cell when focus leaves the grid", () => {
    render(walkedGrid());
    focused("a2");
    act(() => {
      screen.getByRole("button", { name: "outside" }).focus();
    });

    expect(shown()).toBe("none");
  });

  it("keeps showing the last focused cell while a control in a header has focus", () => {
    render(walkedGrid());
    focused("b3");
    act(() => {
      screen.getByRole("button", { name: "Sort" }).focus();
    });

    expect(shown()).toBe("b3");
  });

  it("keeps the tab stop on the last focused cell when a control in a header takes focus", () => {
    render(walkedGrid());
    focused("b3");
    act(() => {
      screen.getByRole("button", { name: "Sort" }).focus();
    });

    expect(cell("b3").tabIndex).toBe(0);
  });

  it("keeps showing the focused cell while focus moves between cells", () => {
    render(walkedGrid());
    fireEvent.keyDown(focused("a1"), { key: "ArrowRight" });

    expect(shown()).toBe("a2");
  });

  it("hides the readout on Escape", () => {
    render(walkedGrid());
    fireEvent.keyDown(focused("a2"), { key: "Escape" });

    expect(shown()).toBe("none");
  });

  it("shows the readout again when the pointer enters a cell after Escape", () => {
    render(walkedGrid());
    fireEvent.keyDown(focused("a2"), { key: "Escape" });
    fireEvent.pointerOver(cell("a3"));

    expect(shown()).toBe("a3");
  });

  it("marks the cell the readout shows", () => {
    render(walkedGrid({ initial: "b3" }));

    expect(cell("b3").dataset["readout"]).toBe("");
  });

  it("leaves every other cell unmarked", () => {
    render(walkedGrid({ initial: "b3" }));

    expect(cell("a1").dataset["readout"]).toBeUndefined();
  });
});
