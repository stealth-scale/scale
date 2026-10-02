import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { slotElement, variantClass } from "@stealthscale/testing-theme";

import { reacted } from "#reactions/reactions.fixtures.tsx";

/**
 * Returns the first reaction's button.
 */
function thumbs(): HTMLElement {
  return screen.getByRole("button", { name: "Thumbs up, 3 people, including you" });
}

describe("Item", () => {
  it("renders a button named by label", () => {
    render(reacted());

    expect(thumbs().tagName).toBe("BUTTON");
  });

  it("writes aria-pressed as true while pressed", () => {
    render(reacted());

    expect(thumbs().getAttribute("aria-pressed")).toBe("true");
  });

  it("writes aria-pressed as false unless pressed", () => {
    render(reacted({ item: { pressed: false } }));

    expect(thumbs().getAttribute("aria-pressed")).toBe("false");
  });

  it("takes the primary palette while pressed", () => {
    render(reacted());

    expect(thumbs().className).toContain(variantClass("button", "palette", "primary"));
  });

  it("takes the neutral palette unless pressed", () => {
    render(reacted({ item: { pressed: false } }));

    expect(thumbs().className).toContain(variantClass("button", "palette", "neutral"));
  });

  it("renders the count hidden from a screen reader", () => {
    const { container } = render(reacted());
    const count = slotElement(container, "reactions", "count");

    expect([count.textContent, count.getAttribute("aria-hidden")]).toStrictEqual(["3", "true"]);
  });

  it("renders no count without count", () => {
    render(reacted({ item: { count: undefined } }));

    expect(thumbs().textContent).toBe("👍");
  });

  it("hides the glyph from a screen reader", () => {
    const { container } = render(reacted());

    expect(slotElement(container, "reactions", "glyph").getAttribute("aria-hidden")).toBe("true");
  });

  it("calls the caller's onClick when pressed", () => {
    const onClick = vi.fn<() => void>();

    render(reacted({ item: { onClick } }));
    act(() => {
      thumbs().click();
    });

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
