import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { laidOut, revealedOf, rootOf, row } from "#swipe-actions/swipe-actions.fixtures.tsx";

/**
 * Opens the row by focusing its first action, and returns the action with a name.
 */
function opened(name: string): HTMLElement {
  act(() => {
    screen.getByRole("button", { name: "Archive" }).focus();
  });

  return screen.getByRole("button", { name });
}

describe("Action", () => {
  it("renders a button", () => {
    const { container } = render(row());

    expect(slotElement(container, "swipe-actions", "action").tagName).toBe("BUTTON");
  });

  it("closes the row on a press", () => {
    laidOut();

    const { container } = render(row());

    fireEvent.click(opened("Delete"));

    expect(revealedOf(container)).toBe("0px");
  });

  it("moves focus to the row on a press", () => {
    laidOut();

    const { container } = render(row());

    fireEvent.click(opened("Delete"));

    expect(document.activeElement).toBe(rootOf(container));
  });

  it("runs the caller's onClick once the row has taken focus", () => {
    laidOut();

    const focusedAtPress: Array<Element | null> = [];
    const { container } = render(
      row(
        {},
        {
          remove: () => {
            focusedAtPress.push(document.activeElement);
          },
        },
      ),
    );

    fireEvent.click(opened("Delete"));

    expect(focusedAtPress).toStrictEqual([rootOf(container)]);
  });

  it("calls the caller's onClick with the press", () => {
    laidOut();

    const archive = vi.fn<() => void>();

    render(row({}, { archive }));
    fireEvent.click(opened("Archive"));

    expect(archive).toHaveBeenCalledTimes(1);
  });
});
