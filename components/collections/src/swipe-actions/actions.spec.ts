import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { laidOut, revealedOf, rootOf, row } from "#swipe-actions/swipe-actions.fixtures.tsx";

/**
 * Moves focus to the button with a name.
 */
function focused(name: string): HTMLElement {
  const target = screen.getByRole("button", { name });

  act(() => {
    target.focus();
  });

  return target;
}

describe("Actions", () => {
  it("renders a div", () => {
    const { container } = render(row());

    expect(slotElement(container, "swipe-actions", "actions").tagName).toBe("DIV");
  });

  it("follows the content in the document", () => {
    const { container } = render(row());
    const content = slotElement(container, "swipe-actions", "content");

    expect(content.nextElementSibling).toBe(slotElement(container, "swipe-actions", "actions"));
  });

  it("opens the row when focus enters an action", () => {
    laidOut();

    const { container } = render(row());

    focused("Archive");

    expect(revealedOf(container)).toBe("160px");
  });

  it("keeps the row open while focus moves between the actions", () => {
    laidOut();

    const { container } = render(row());

    focused("Archive");
    focused("Delete");

    expect(revealedOf(container)).toBe("160px");
  });

  it("closes the row when focus leaves the actions", () => {
    laidOut();

    const { container } = render(row());

    focused("Archive");
    focused("Open");

    expect(revealedOf(container)).toBe("0px");
  });

  it("closes the row on Escape", () => {
    laidOut();

    const { container } = render(row());

    fireEvent.keyDown(focused("Archive"), { key: "Escape" });

    expect(revealedOf(container)).toBe("0px");
  });

  it("moves focus to the row on Escape", () => {
    laidOut();

    const { container } = render(row());

    fireEvent.keyDown(focused("Archive"), { key: "Escape" });

    expect(document.activeElement).toBe(rootOf(container));
  });

  it("cancels Escape", () => {
    laidOut();
    render(row());

    expect(fireEvent.keyDown(focused("Archive"), { key: "Escape" })).toBe(false);
  });

  it("keeps the row open on another key", () => {
    laidOut();

    const { container } = render(row());

    fireEvent.keyDown(focused("Archive"), { key: "ArrowLeft" });

    expect(revealedOf(container)).toBe("160px");
  });
});
