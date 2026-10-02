import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  bare,
  contentOf,
  laidOut,
  revealedOf,
  rootOf,
  row,
} from "#swipe-actions/swipe-actions.fixtures.tsx";

/**
 * Drags the row's content with a touch pointer from one `clientX` to another, without a release.
 */
function dragged(container: HTMLElement, from: number, to: number, pointerType = "touch"): void {
  const content = contentOf(container);

  fireEvent.pointerDown(content, { clientX: from, pointerId: 1, pointerType });
  fireEvent.pointerMove(content, { clientX: to, pointerId: 1, pointerType });
}

describe("Content", () => {
  it("renders a div", () => {
    const { container } = render(row());

    expect(contentOf(container).tagName).toBe("DIV");
  });

  it("reveals the actions as a touch drags the row towards the start", () => {
    laidOut();

    const { container } = render(row());

    dragged(container, 300, 240);

    expect(revealedOf(container)).toBe("60px");
  });

  it("sets data-dragging on the root while a drag moves the row", () => {
    laidOut();

    const { container } = render(row());

    dragged(container, 300, 240);

    expect(rootOf(container).dataset["dragging"]).toBe("");
  });

  it("reveals no more than the actions' width", () => {
    laidOut();

    const { container } = render(row());

    dragged(container, 300, 0);

    expect(revealedOf(container)).toBe("160px");
  });

  it("reveals nothing in a row without actions", () => {
    laidOut();

    const { container } = render(bare());

    dragged(container, 300, 200);

    expect(revealedOf(container)).toBe("0px");
  });

  it("reveals nothing for a drag towards the end", () => {
    laidOut();

    const { container } = render(row());

    dragged(container, 300, 360);

    expect(revealedOf(container)).toBe("0px");
  });

  it("opens the actions on a release past half their width", () => {
    laidOut();

    const { container } = render(row());

    dragged(container, 300, 210);
    fireEvent.pointerUp(contentOf(container), { pointerId: 1, pointerType: "touch" });

    expect(revealedOf(container)).toBe("160px");
  });

  it("closes the actions on a release short of half their width", () => {
    laidOut();

    const { container } = render(row());

    dragged(container, 300, 250);
    fireEvent.pointerUp(contentOf(container), { pointerId: 1, pointerType: "touch" });

    expect(revealedOf(container)).toBe("0px");
  });

  it("continues a drag from the width already open", () => {
    laidOut();

    const { container } = render(row());

    act(() => {
      screen.getByRole("button", { name: "Archive" }).focus();
    });
    dragged(container, 300, 340);

    expect(revealedOf(container)).toBe("120px");
  });

  it("reveals the actions as a drag moves right in a row laid out right to left", () => {
    laidOut();

    const { container } = render(row({ style: { direction: "rtl" } }));

    dragged(container, 100, 180);

    expect(revealedOf(container)).toBe("80px");
  });

  it("moves nothing for a mouse drag", () => {
    laidOut();

    const { container } = render(row());

    dragged(container, 300, 200, "mouse");

    expect(revealedOf(container)).toBe("0px");
  });

  it("moves nothing for a pointer that did not go down on the row", () => {
    laidOut();

    const { container } = render(row());

    fireEvent.pointerMove(contentOf(container), { clientX: 200, pointerType: "touch" });
    fireEvent.pointerUp(contentOf(container), { pointerType: "touch" });

    expect(revealedOf(container)).toBe("0px");
  });

  it("closes the row when the browser cancels the drag", () => {
    laidOut();

    const { container } = render(row());

    dragged(container, 300, 200);
    fireEvent.pointerCancel(contentOf(container), { pointerId: 1, pointerType: "touch" });

    expect(revealedOf(container)).toBe("0px");
  });

  it("keeps an open row open on a cancel without a drag", () => {
    laidOut();

    const { container } = render(row());

    act(() => {
      screen.getByRole("button", { name: "Archive" }).focus();
    });
    fireEvent.pointerCancel(contentOf(container), { pointerType: "touch" });

    expect(revealedOf(container)).toBe("160px");
  });

  it("reveals the actions as a trackpad swipes towards the start", () => {
    laidOut();

    const { container } = render(row());

    fireEvent.wheel(contentOf(container), { deltaX: 40, deltaY: 2 });

    expect(revealedOf(container)).toBe("40px");
  });

  it("settles a trackpad swipe 150ms after its last delta", () => {
    vi.useFakeTimers();
    laidOut();

    const { container } = render(row());

    fireEvent.wheel(contentOf(container), { deltaX: 50, deltaY: 0 });
    fireEvent.wheel(contentOf(container), { deltaX: 50, deltaY: 0 });
    act(() => {
      vi.advanceTimersByTime(150);
    });
    vi.useRealTimers();

    expect(revealedOf(container)).toBe("160px");
  });

  it("reveals the actions as a trackpad swipes right in a row laid out right to left", () => {
    laidOut();

    const { container } = render(row({ style: { direction: "rtl" } }));

    fireEvent.wheel(contentOf(container), { deltaX: -40, deltaY: 0 });

    expect(revealedOf(container)).toBe("40px");
  });

  it("continues a trackpad swipe from the width already open", () => {
    laidOut();

    const { container } = render(row());

    act(() => {
      screen.getByRole("button", { name: "Archive" }).focus();
    });
    fireEvent.wheel(contentOf(container), { deltaX: -40, deltaY: 0 });

    expect(revealedOf(container)).toBe("120px");
  });

  it("leaves a mostly vertical wheel to the page", () => {
    laidOut();

    const { container } = render(row());

    fireEvent.wheel(contentOf(container), { deltaX: 10, deltaY: 40 });

    expect(revealedOf(container)).toBe("0px");
  });
});
