import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { clipped, composed, pressed } from "#clipboard/clipboard.fixtures.tsx";
import { Indicator } from "#clipboard/indicator.tsx";

describe("Indicator", () => {
  it("conforms as a span inside the root it needs above it", () => {
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

  it("shows the glyph at rest before a press", () => {
    const { container } = render(composed());

    expect(slotElement(container, "clipboard", "indicator").textContent).toBe("⧉");
  });

  it("shows the copied glyph after a press", async () => {
    const { container } = render(composed());
    await pressed(screen.getByRole("button"));

    expect(slotElement(container, "clipboard", "indicator").textContent).toBe("✓");
  });

  it("shows the glyph at rest again once the mark clears", async () => {
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

  it("keeps its mark out of the name the trigger is announced by", () => {
    const { container } = render(clipped(<Indicator>⧉</Indicator>));

    expect(slotElement(container, "clipboard", "indicator").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("reads a mark out where a caller says it means something", () => {
    const { container } = render(clipped(<Indicator aria-hidden={false}>Copy</Indicator>));

    expect(slotElement(container, "clipboard", "indicator").getAttribute("aria-hidden")).toBe(
      "false",
    );
  });

  it("stays shown whichever glyph it holds", async () => {
    const { container } = render(composed());
    await pressed(screen.getByRole("button"));

    expect(slotElement(container, "clipboard", "indicator").hidden).toBe(false);
  });
});
