import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { recordStatus, useReturnedFocus } from "#tour/focus.ts";

/**
 * Describes the props of the probe.
 */
interface ProbeProps {
  /**
   * The tour's id.
   */
  readonly id: string;

  /**
   * Whether the card is open.
   */
  readonly open: boolean;
}

/**
 * Runs the hook for a tour.
 *
 * @param props - The tour's id and whether its card is open.
 * @returns Nothing.
 */
function Probe({ id, open }: ProbeProps): null {
  useReturnedFocus(id, open);

  return null;
}

/**
 * Renders the button that starts the tour, a button beside it, a card with a button, and the probe.
 *
 * @param props - The tour's id and whether its card is open.
 * @returns The page.
 */
function page(props: ProbeProps): ReactElement {
  return (
    <>
      <button type="button">Take the tour</button>
      <button type="button">Export</button>
      <div data-part="content" data-scope="tour">
        <button type="button">Next</button>
      </div>
      <Probe {...props} />
    </>
  );
}

/**
 * Renders the page with the card open, focuses the opener, and records the start.
 *
 * @param id - The tour's id.
 * @returns A function that ends the tour with a status and closes the card.
 */
function opened(id: string): (status: "dismissed" | "started") => void {
  const { rerender } = render(page({ id, open: true }));

  screen.getByRole("button", { name: "Take the tour" }).focus();
  recordStatus(id, "started");

  return (status) => {
    recordStatus(id, status);
    rerender(page({ id, open: false }));
  };
}

describe("useReturnedFocus", () => {
  it("returns focus to the opener once the tour ends with focus on body", () => {
    const ended = opened("body");

    screen.getByRole("button", { name: "Take the tour" }).blur();
    ended("dismissed");

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Take the tour" }));
  });

  it("returns focus to the opener once the tour ends with focus in the card", () => {
    const ended = opened("card");

    screen.getByRole("button", { name: "Next" }).focus();
    ended("dismissed");

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Take the tour" }));
  });

  it("leaves focus on an element outside the card", () => {
    const ended = opened("outside");

    screen.getByRole("button", { name: "Export" }).focus();
    ended("dismissed");

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Export" }));
  });

  it("leaves focus while the card closes and the tour goes on", () => {
    const ended = opened("waiting");

    screen.getByRole("button", { name: "Next" }).focus();
    ended("started");

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Next" }));
  });

  it("leaves focus when the opener has left the document", () => {
    const detached = document.createElement("button");

    document.body.append(detached);
    detached.focus();
    recordStatus("detached", "started");
    detached.remove();
    recordStatus("detached", "dismissed");
    render(page({ id: "detached", open: false }));

    expect(document.activeElement).toBe(document.body);
  });

  it("returns focus when no element has focus as the card closes", () => {
    const ended = opened("none");
    const opener = screen.getByRole("button", { name: "Take the tour" });
    const focused = vi.spyOn(opener, "focus");

    vi.spyOn(document, "activeElement", "get").mockReturnValue(null);
    ended("dismissed");

    expect(focused).toHaveBeenCalledOnce();
  });

  it("leaves focus when no element had focus as the tour started", () => {
    vi.spyOn(document, "activeElement", "get").mockReturnValueOnce(null);
    recordStatus("unfocused", "started");
    recordStatus("unfocused", "dismissed");
    render(page({ id: "unfocused", open: false }));

    expect(document.activeElement).toBe(document.body);
  });
});
