import { type ReactElement } from "react";

import { fireEvent, render, type RenderResult } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { framed, observed } from "#heat/heat.fixtures.tsx";
import { Readout, type ReadoutProps } from "#heat/readout.tsx";
import { CLIPPED, READOUT_X, READOUT_Y } from "#heat/recipe.ts";

/**
 * Describes the boxes the layout stub returns: the cell's and the readout's. The frame and the view
 * are 600 by 300 at the page's origin.
 */
interface Boxes {
  cell: DOMRect;
  readout: DOMRect;
}

/**
 * Box of the frame and of the view inside it.
 */
const FRAME = new DOMRect(0, 0, 600, 300);

/**
 * Lays the frame and the view out at 600 by 300, the cell and the readout at the boxes a case
 * states, and the readout 160px wide, reading the boxes when asked, so a case moves a box by
 * changing it.
 */
function laidOut(boxes: Boxes): void {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function boxOf(
    this: HTMLElement,
  ) {
    if (this.dataset["cell"] !== undefined) return boxes.cell;

    return this.className.includes("heat__readout") ? boxes.readout : FRAME;
  });
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(160);
}

/**
 * Returns a frame with a view that contains the cell "a", and the readout.
 */
function tree(props: Partial<ReadoutProps> = {}): ReactElement {
  return framed(
    <>
      <div>
        <span data-cell="a" />
      </div>
      <Readout
        heading="Tue · 17:00"
        rows={[{ key: "value", name: "Authorisations", value: "405" }]}
        target="a"
        {...props}
      />
    </>,
  );
}

/**
 * Renders the frame, the view and the readout.
 */
function shown(props: Partial<ReadoutProps> = {}): RenderResult {
  return render(tree(props));
}

/**
 * Returns the readout's element.
 */
function readout(): HTMLElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the case renders the readout
  return document.querySelector(".heat__readout") as HTMLElement;
}

/**
 * Returns the boxes of a cell 40 by 30 at 200, 100 and a readout that fits above it.
 */
function boxesOf(changes: Partial<Boxes> = {}): Boxes {
  return {
    cell: new DOMRect(200, 100, 40, 30),
    readout: new DOMRect(140, 40, 160, 52),
    ...changes,
  };
}

describe("Readout", () => {
  it("renders nothing without a target", () => {
    shown({ target: undefined });

    expect(document.querySelector(".heat__readout")).toBeNull();
  });

  it("writes the heading and the rows", () => {
    laidOut(boxesOf());
    shown();

    expect(readout().textContent).toBe("Tue · 17:00Authorisations405");
  });

  it("hides itself from assistive technology", () => {
    laidOut(boxesOf());
    shown();

    expect(readout().getAttribute("aria-hidden")).toBe("true");
  });

  it("turns the tooltip's live region off", () => {
    laidOut(boxesOf());
    shown();

    expect(readout().querySelector("output")?.getAttribute("aria-live")).toBe("off");
  });

  it("places its middle on its cell's middle", () => {
    laidOut(boxesOf());
    shown();

    expect(readout().style.getPropertyValue(READOUT_X)).toBe("220px");
  });

  it("places its bottom at its cell's top where the frame has room above", () => {
    laidOut(boxesOf());
    shown();

    expect(readout().style.getPropertyValue(READOUT_Y)).toBe("100px");
  });

  it("states no side where it is above its cell", () => {
    laidOut(boxesOf());
    shown();

    expect(readout().dataset["side"]).toBeUndefined();
  });

  it("places its top at its cell's bottom where the frame has no room above", () => {
    laidOut(boxesOf({ readout: new DOMRect(140, -10, 160, 52) }));
    shown();

    expect(readout().style.getPropertyValue(READOUT_Y)).toBe("130px");
  });

  it("states the bottom side where it is below its cell", () => {
    laidOut(boxesOf({ readout: new DOMRect(140, -10, 160, 52) }));
    shown();

    expect(readout().dataset["side"]).toBe("bottom");
  });

  it("drops the bottom side once the frame has room above its cell again", () => {
    const boxes = boxesOf({ readout: new DOMRect(140, -10, 160, 52) });

    laidOut(boxes);
    shown();
    boxes.readout = new DOMRect(140, 40, 160, 52);
    fireEvent.scroll(document.querySelector("[data-cell]")?.parentElement ?? document);

    expect(readout().dataset["side"]).toBeUndefined();
  });

  it("keeps its middle inside the frame's start", () => {
    laidOut(boxesOf({ cell: new DOMRect(0, 100, 40, 30) }));
    shown();

    expect(readout().style.getPropertyValue(READOUT_X)).toBe("80px");
  });

  it("keeps its middle inside the frame's end", () => {
    laidOut(boxesOf({ cell: new DOMRect(580, 100, 20, 30) }));
    shown();

    expect(readout().style.getPropertyValue(READOUT_X)).toBe("520px");
  });

  it("places itself again when its heading changes", () => {
    laidOut(boxesOf({ cell: new DOMRect(0, 100, 40, 30) }));

    const { rerender } = shown();

    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(300);
    rerender(tree({ heading: "Tuesday · 17:00" }));

    expect(readout().style.getPropertyValue(READOUT_X)).toBe("150px");
  });

  it("marks itself clipped while its cell is out of the view", () => {
    laidOut(boxesOf({ cell: new DOMRect(700, 100, 40, 30) }));
    shown();

    expect(readout().hasAttribute(CLIPPED)).toBe(true);
  });

  it("marks itself clipped while its cell is under the view", () => {
    laidOut(boxesOf({ cell: new DOMRect(200, 320, 40, 30) }));
    shown();

    expect(readout().hasAttribute(CLIPPED)).toBe(true);
  });

  it("marks itself clipped while its cell starts at the view's end", () => {
    laidOut(boxesOf({ cell: new DOMRect(600, 100, 40, 30) }));
    shown();

    expect(readout().hasAttribute(CLIPPED)).toBe(true);
  });

  it("marks itself clipped while its cell starts at the view's bottom", () => {
    laidOut(boxesOf({ cell: new DOMRect(200, 300, 40, 30) }));
    shown();

    expect(readout().hasAttribute(CLIPPED)).toBe(true);
  });

  it("leaves itself unclipped while its cell is in the view", () => {
    laidOut(boxesOf());
    shown();

    expect(readout().hasAttribute(CLIPPED)).toBe(false);
  });

  it("places nothing while no cell in the frame has its key", () => {
    laidOut(boxesOf());
    shown({ target: "b" });

    expect(readout().style.getPropertyValue(READOUT_X)).toBe("");
  });

  it("follows its cell when the view scrolls", () => {
    const boxes = boxesOf();

    laidOut(boxes);
    shown();
    boxes.cell = new DOMRect(300, 100, 40, 30);
    fireEvent.scroll(document.querySelector("[data-cell]")?.parentElement ?? document);

    expect(readout().style.getPropertyValue(READOUT_X)).toBe("320px");
  });

  it("follows its cell when the frame resizes", () => {
    const boxes = boxesOf();
    const observer = observed();

    laidOut(boxes);
    shown();
    boxes.cell = new DOMRect(360, 100, 40, 30);
    observer.resize();

    expect(readout().style.getPropertyValue(READOUT_X)).toBe("380px");
  });

  it("stops following a scroll once it unmounts", () => {
    laidOut(boxesOf());

    const { rerender } = shown();
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the frame renders the readout as its child
    const frame = readout().parentElement as HTMLElement;
    const removed = vi.spyOn(frame, "removeEventListener");

    rerender(framed(<div />));

    expect(removed.mock.lastCall?.[0]).toBe("scroll");
  });

  it("disconnects its resize observer once it unmounts", () => {
    const observer = observed();

    laidOut(boxesOf());

    const { unmount } = shown();

    unmount();

    expect(observer.disconnected()).toBe(true);
  });
});
