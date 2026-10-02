import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { viewed } from "#navigation-menu/navigation-menu.fixtures.tsx";

describe("Indicator", () => {
  it("renders an li of the list", async () => {
    const { container } = await drawn(viewed());
    const indicator = slotElement(container, "navigation-menu", "indicator");

    expect(indicator.tagName).toBe("LI");
    expect(indicator.parentElement).toBe(slotElement(container, "navigation-menu", "list"));
  });

  it("sets aria-hidden", async () => {
    const { container } = await drawn(viewed());

    expect(slotElement(container, "navigation-menu", "indicator").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("hides the indicator while every item is closed", async () => {
    const { container } = await drawn(viewed());

    expect(slotElement(container, "navigation-menu", "indicator").hidden).toBe(true);
  });

  it("shows the indicator while an item is open", async () => {
    const { container } = await drawn(viewed({ defaultValue: "products" }));

    expect(slotElement(container, "navigation-menu", "indicator").hidden).toBe(false);
  });

  it("sets data-state to open while an item is open", async () => {
    const { container } = await drawn(viewed({ defaultValue: "products" }));

    expect(slotElement(container, "navigation-menu", "indicator").dataset["state"]).toBe("open");
  });
});
