import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { bareBox, openedMark, walkedBox, type WalkSpies } from "#chart/walk.fixtures.tsx";

/**
 * Describes the walked box as a case reads it: its spies, its tab stop, the button outside it, and
 * a key presser.
 */
interface Walked extends WalkSpies {
  readonly outside: HTMLElement;
  readonly press: (key: string) => boolean;
  readonly stop: HTMLElement;
}

/**
 * Renders the walked box with spies.
 */
function walked(): Walked {
  const spies = {
    entered: vi.fn<(at: number) => void>(),
    focused: vi.fn<() => void>(),
    keyed: vi.fn<(key: string) => void>(),
    left: vi.fn<(at: number) => void>(),
    pressed: vi.fn<(at: number) => void>(),
  };
  const { getByRole } = render(walkedBox(spies));
  const stop = getByRole("button", { name: "stop" });

  return {
    ...spies,
    outside: getByRole("button", { name: "outside" }),
    press: (key) => fireEvent.keyDown(stop, { key }),
    stop,
  };
}

/**
 * Moves focus to an element inside `act`.
 */
function focus(element: HTMLElement | null): void {
  act(() => {
    element?.focus();
  });
}

/**
 * Returns the places a spy was called with, in order.
 */
function placesOf(spy: (at: number) => void): number[] {
  return vi.mocked(spy).mock.calls.map(([at]) => at);
}

describe("useWalk", () => {
  it("enters the first mark when the keyboard focuses the tab stop", () => {
    const { entered, stop } = walked();

    focus(stop);

    expect(placesOf(entered)).toStrictEqual([0]);
  });

  it("enters no mark on a focus event without keyboard focus", () => {
    const { entered, stop } = walked();

    fireEvent.focus(stop);

    expect(entered).not.toHaveBeenCalled();
  });

  it("enters the marks in the order of their places", () => {
    const { entered, press, stop } = walked();

    focus(stop);
    press("ArrowRight");
    press("ArrowRight");

    expect(placesOf(entered)).toStrictEqual([0, 1, 2]);
  });

  it("leaves the mark before when it enters the next", () => {
    const { left, press, stop } = walked();

    focus(stop);
    press("ArrowRight");

    expect(placesOf(left)).toStrictEqual([0]);
  });

  it("steps back with ArrowLeft", () => {
    const { entered, press, stop } = walked();

    focus(stop);
    press("ArrowRight");
    press("ArrowLeft");

    expect(placesOf(entered)).toStrictEqual([0, 1, 0]);
  });

  it("moves no further than the last mark", () => {
    const { entered, press } = walked();

    press("End");
    press("ArrowRight");

    expect(placesOf(entered)).toStrictEqual([2]);
  });

  it("moves no further back than the first mark", () => {
    const { entered, press } = walked();

    press("ArrowRight");
    press("ArrowLeft");

    expect(placesOf(entered)).toStrictEqual([0]);
  });

  it("enters the first mark on ArrowRight before any step", () => {
    const { entered, press } = walked();

    press("ArrowRight");

    expect(placesOf(entered)).toStrictEqual([0]);
  });

  it("enters the last mark on ArrowLeft before any step", () => {
    const { entered, press } = walked();

    press("ArrowLeft");

    expect(placesOf(entered)).toStrictEqual([2]);
  });

  it("enters the first mark on Home", () => {
    const { entered, press } = walked();

    press("End");
    press("Home");

    expect(placesOf(entered)).toStrictEqual([2, 0]);
  });

  it("cancels the default of a key it takes", () => {
    const { press } = walked();

    expect(press("End")).toBe(false);
  });

  it("keeps a key it takes from the tab stop's own handler", () => {
    const { keyed, press } = walked();

    press("ArrowRight");

    expect(keyed).not.toHaveBeenCalled();
  });

  it("passes Enter to the tab stop before any step", () => {
    const { keyed, press } = walked();

    press("Enter");

    expect(vi.mocked(keyed).mock.calls).toStrictEqual([["Enter"]]);
  });

  it("passes any other key to the tab stop", () => {
    const { keyed, press } = walked();

    press("ArrowRight");
    press("Escape");

    expect(vi.mocked(keyed).mock.calls).toStrictEqual([["Escape"]]);
  });

  it.each(["Enter", " "])("presses the mark it is at on %j", (key) => {
    const { press, pressed } = walked();

    press("End");
    press(key);

    expect(placesOf(pressed)).toStrictEqual([2]);
  });

  it("keeps a press from the tab stop's own handler", () => {
    const { keyed, press } = walked();

    press("Home");

    expect([press("Enter"), vi.mocked(keyed).mock.calls]).toStrictEqual([false, []]);
  });

  it("keeps the focus from the tab stop's own handler", () => {
    const { focused, stop } = walked();

    focus(stop);

    expect(focused).not.toHaveBeenCalled();
  });

  it("leaves the mark it is at when focus leaves the box", () => {
    const { left, outside, press, stop } = walked();

    focus(stop);
    press("ArrowRight");
    focus(outside);

    expect(placesOf(left)).toStrictEqual([0, 1]);
  });

  it("starts again from the first mark after focus leaves", () => {
    const { entered, outside, press, stop } = walked();

    press("End");
    focus(stop);
    focus(outside);
    focus(stop);

    expect(placesOf(entered)).toStrictEqual([2, 0]);
  });

  it("keeps its mark when focus moves inside the box", () => {
    const { left, stop } = walked();

    focus(stop);
    focus(document.querySelector("a"));

    expect(left).not.toHaveBeenCalled();
  });

  it("takes no key in a box without marks", () => {
    const { getByRole } = render(bareBox());

    expect(fireEvent.keyDown(getByRole("button"), { key: "ArrowRight" })).toBe(true);
  });

  it("enters the mark the chart opens its tooltip at when it mounts", () => {
    const entered = vi.fn<() => void>();

    render(openedMark(true, entered));

    expect(entered).toHaveBeenCalledExactlyOnceWith();
  });

  it("enters no mark the chart does not open its tooltip at", () => {
    const entered = vi.fn<() => void>();

    render(openedMark(false, entered));

    expect(entered).not.toHaveBeenCalled();
  });
});
