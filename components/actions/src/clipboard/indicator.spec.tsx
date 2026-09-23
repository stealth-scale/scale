import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { clipped, composed, pressed } from "#clipboard/clipboard.fixtures.tsx";
import { Indicator } from "#clipboard/indicator.tsx";

describe("Indicator", () => {
  it("returns no conformance violation for its SPAN slot inside a root", () => {
    expect(
      violations(Indicator, {
        as: true,
        children: true,
        element: "SPAN",
        subject: (container) => slotElement(container, "clipboard", "indicator"),
        wrapper: clipped,
      }),
    ).toStrictEqual([]);
  });

  it("renders its children while no copy has happened", () => {
    const { container } = render(composed());

    expect(slotElement(container, "clipboard", "indicator").textContent).toBe("⧉");
  });

  it("renders the copied prop once the trigger is clicked", async () => {
    const { container } = render(composed());
    await pressed(screen.getByRole("button"));

    expect(slotElement(container, "clipboard", "indicator").textContent).toBe("✓");
  });

  it("renders its children again once the timeout has elapsed", async () => {
    vi.useFakeTimers();

    try {
      const { container } = render(composed({ timeout: 50 }));
      await pressed(screen.getByRole("button"));
      await act(() => vi.advanceTimersByTimeAsync(80));

      expect(slotElement(container, "clipboard", "indicator").textContent).toBe("⧉");
    } finally {
      vi.useRealTimers();
    }
  });

  it("sets aria-hidden to true when the caller passes no value for it", () => {
    const { container } = render(clipped(<Indicator>⧉</Indicator>));

    expect(slotElement(container, "clipboard", "indicator").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("keeps aria-hidden false when passed false", () => {
    const { container } = render(clipped(<Indicator aria-hidden={false}>Copy</Indicator>));

    expect(slotElement(container, "clipboard", "indicator").getAttribute("aria-hidden")).toBe(
      "false",
    );
  });

  it("leaves the hidden property false after a copy", async () => {
    const { container } = render(composed());
    await pressed(screen.getByRole("button"));

    expect(slotElement(container, "clipboard", "indicator").hidden).toBe(false);
  });
});
