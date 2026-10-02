import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, opened } from "#floating-panel/floating-panel.fixtures.tsx";
import { Body } from "#floating-panel/index.ts";

/**
 * Returns the scroll area's root around the body.
 *
 * @param container - The render's container.
 */
function scroller(container: HTMLElement): HTMLElement {
  return slotElement(container, "floating-panel", "scroller");
}

describe("Body", () => {
  it("renders the body inside the primitives scroll area", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(scroller(container).classList.contains("scroll-area__root")).toBe(true);
  });

  it("renders a div with the body class inside the scroll area", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(scroller(container).contains(slotElement(container, "floating-panel", "body"))).toBe(
      true,
    );
  });

  it("names the scroll area's viewport by the panel's title", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));
    const viewport = scroller(container).querySelector(".scroll-area__viewport");

    expect(viewport?.getAttribute("aria-labelledby")).toBe(
      screen.getByRole("heading", { name: "Launch notes" }).id,
    );
  });

  it("shows the scroll area while the panel is at its size", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(scroller(container).hidden).toBe(false);
  });

  it("hides the scroll area while the panel is minimized", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));
    await pressed(screen.getByRole("button", { name: "Minimize" }));

    expect(scroller(container).hidden).toBe(true);
  });

  it("renders the body as the element as names", async () => {
    const { container } = await drawn(opened(<Body as="section">Text</Body>));

    expect(slotElement(container, "floating-panel", "body").tagName).toBe("SECTION");
  });
});
