import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { overflowing, scrolled } from "#scroll-area/scroll-area.fixtures.tsx";

describe("Corner", () => {
  it("renders a div", async () => {
    const { container } = await drawn(scrolled());

    expect(slotElement(container, "scroll-area", "corner").tagName).toBe("DIV");
  });

  it("shows the corner while both axes overflow", async () => {
    const report = overflowing({ x: true, y: true });
    const { container } = await drawn(scrolled());

    report();
    await settled();

    expect(slotElement(container, "scroll-area", "corner").dataset["state"]).toBe("visible");
  });

  it("hides the corner while one axis fits", async () => {
    const report = overflowing({ y: true });
    const { container } = await drawn(scrolled());

    report();
    await settled();

    expect(slotElement(container, "scroll-area", "corner").dataset["state"]).toBe("hidden");
  });
});
