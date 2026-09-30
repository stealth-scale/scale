import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotClass, slotElement } from "@stealthscale/testing-theme";

import { composed } from "#radio-card/radio-card.fixtures.tsx";

describe("ItemContent", () => {
  it("renders a span inside the card", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "radio-card", "itemContent").tagName).toBe("SPAN");
  });

  it("applies the item content slot class", async () => {
    const { container } = await drawn(composed());

    expect([...slotElement(container, "radio-card", "itemContent").classList]).toContain(
      slotClass("radio-card", "itemContent"),
    );
  });
});
