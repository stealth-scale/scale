import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#radio-card/radio-card.fixtures.tsx";

describe("ItemIndicator", () => {
  it("renders a span inside the card", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "radio-card", "itemIndicator").tagName).toBe("SPAN");
  });

  it("hides the circle from assistive technology", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "radio-card", "itemIndicator").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("sets data-state to checked on the circle of the checked card", async () => {
    const { container } = await drawn(composed({ defaultValue: "Standard" }));

    expect(slotElement(container, "radio-card", "itemIndicator").dataset["state"]).toBe("checked");
  });
});
