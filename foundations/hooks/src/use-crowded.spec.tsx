import { type ReactElement } from "react";

import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { crowded, observed, useCrowded } from "#use-crowded.ts";

/**
 * Describes the stub of `ResizeObserver`: how to run its callback and whether it stopped.
 */
interface Observed {
  /**
   * Returns whether the observer disconnected.
   */
  readonly disconnected: () => boolean;

  /**
   * Runs the observer's callback, as a change of size does.
   */
  readonly resize: () => void;
}

/**
 * Replaces `ResizeObserver` with a stub whose callback a case runs by hand.
 *
 * @returns The handles on the stub.
 */
function observer(): Observed {
  const held = { callback: (): void => undefined, disconnected: false };

  /**
   * Replaces `ResizeObserver`, keeping its callback.
   */
  class Stub {
    /**
     * Keeps the callback the observer runs on a change of size.
     *
     * @param callback - The callback.
     */
    constructor(callback: () => void) {
      held.callback = callback;
    }

    /**
     * Records that the observer stopped.
     */
    disconnect(): void {
      held.disconnected = true;
    }

    /**
     * Accepts an element, as the real observer does.
     */
    observe(): void {
      held.disconnected = false;
    }
  }

  vi.stubGlobal("ResizeObserver", Stub);

  return {
    disconnected: () => held.disconnected,
    resize: () => {
      held.callback();
    },
  };
}

/**
 * Makes every element report the scroll width and client width given.
 *
 * @param scroll - The width its children need.
 * @param client - The width it has.
 */
function widths(scroll: number, client: number): void {
  vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(scroll);
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(client);
}

/**
 * Renders a list that reports whether it is crowded.
 *
 * @returns The list, with the result as its text.
 */
function Measured(): ReactElement {
  const [isCrowded, ref] = useCrowded();

  return (
    <ol data-testid="list" ref={ref}>
      <li>{String(isCrowded)}</li>
    </ol>
  );
}

describe("useCrowded", () => {
  it("returns true from crowded when the children need more room than the element has", () => {
    widths(400, 354);

    expect(crowded(document.createElement("ol"))).toBe(true);
  });

  it("returns false from crowded when the children fit", () => {
    widths(300, 354);

    expect(crowded(document.createElement("ol"))).toBe(false);
  });

  it("returns false from crowded within a pixel of the width", () => {
    widths(355, 354);

    expect(crowded(document.createElement("ol"))).toBe(false);
  });

  it("measures with data-measuring in place of data-crowded", () => {
    const list = document.createElement("ol");
    const seen: Array<string | undefined> = [];

    list.dataset["crowded"] = "";
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockImplementation(() => {
      seen.push(list.dataset["crowded"], list.dataset["measuring"]);

      return 0;
    });
    crowded(list);

    expect(seen).toStrictEqual([undefined, ""]);
  });

  it("restores data-crowded after measuring", () => {
    const list = document.createElement("ol");

    list.dataset["crowded"] = "";
    widths(300, 354);
    crowded(list);

    expect([list.dataset["crowded"], list.dataset["measuring"]]).toStrictEqual(["", undefined]);
  });

  it("reports the measurement from observed on every resize", () => {
    const stub = observer();
    const told = vi.fn<(value: boolean) => void>();

    widths(400, 354);
    observed(document.createElement("ol"), told);
    stub.resize();

    expect(told).toHaveBeenCalledWith(true);
  });

  it("disconnects when the function observed returns runs", () => {
    const stub = observer();

    observed(document.createElement("ol"), vi.fn<(value: boolean) => void>())();

    expect(stub.disconnected()).toBe(true);
  });

  it("returns false before the first measurement", () => {
    observer();
    render(<Measured />);

    expect(screen.getByTestId("list").textContent).toBe("false");
  });

  it("returns true after a resize of a crowded element", () => {
    const stub = observer();

    render(<Measured />);
    widths(400, 354);
    act(() => {
      stub.resize();
    });

    expect(screen.getByTestId("list").textContent).toBe("true");
  });
});
