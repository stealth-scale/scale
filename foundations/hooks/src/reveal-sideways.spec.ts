import { describe, expect, it, vi } from "vitest";

import { revealSideways } from "#reveal-sideways.ts";

/**
 * Describes a frame around a view 200px wide around a target element: the three elements.
 */
interface Scrolled {
  readonly frame: HTMLElement;
  readonly target: HTMLElement;
  readonly view: HTMLElement;
}

/**
 * Builds a frame around a view 200px wide at the page's start, 600px wide inside unless stated,
 * around a target element at a box, with the view's `overflow-x` as stated.
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

describe("revealSideways", () => {
  it("scrolls the view until an element past its end is inside it", () => {
    const { frame, target, view } = scrolled(new DOMRect(300, 0, 40, 30));

    revealSideways(target, frame);
    frame.remove();

    expect(view.scrollLeft).toBe(240);
  });

  it("scrolls the view back until an element before its start is inside it", () => {
    const { frame, target, view } = scrolled(new DOMRect(-60, 0, 40, 30));

    revealSideways(target, frame);
    frame.remove();

    expect(view.scrollLeft).toBe(40);
  });

  it("scrolls the view around the element over another view in the frame", () => {
    const { frame, target, view } = scrolled(new DOMRect(300, 0, 40, 30));
    const other = document.createElement("div");

    other.style.overflowX = "auto";
    Object.defineProperty(other, "clientWidth", { value: 200 });
    Object.defineProperty(other, "scrollWidth", { value: 600 });
    frame.prepend(other);
    revealSideways(target, frame);
    frame.remove();

    expect(view.scrollLeft).toBe(240);
  });

  it("scrolls nothing while the view fits its contents", () => {
    const { frame, target, view } = scrolled(new DOMRect(300, 0, 40, 30), "auto", 200);

    revealSideways(target, frame);
    frame.remove();

    expect(view.scrollLeft).toBe(100);
  });

  it("scrolls nothing around an element whose wider ancestor does not scroll", () => {
    const { frame, target, view } = scrolled(new DOMRect(300, 0, 40, 30), "visible");

    revealSideways(target, frame);
    frame.remove();

    expect(view.scrollLeft).toBe(100);
  });
});
