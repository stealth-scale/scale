import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, itemed } from "#accordion/accordion.fixtures.tsx";
import { ItemIndicator } from "#accordion/item-indicator.tsx";

describe("ItemIndicator", () => {
  it("renders a span", async () => {
    const { container } = await drawn(itemed(<ItemIndicator>v</ItemIndicator>));

    expect(slotElement(container, "accordion", "itemIndicator").tagName).toBe("SPAN");
  });

  it("sets aria-hidden", async () => {
    const { container } = await drawn(itemed(<ItemIndicator>v</ItemIndicator>));

    expect(slotElement(container, "accordion", "itemIndicator").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("keeps the aria-hidden a caller passes", async () => {
    const { container } = await drawn(itemed(<ItemIndicator aria-hidden={false}>v</ItemIndicator>));

    expect(slotElement(container, "accordion", "itemIndicator").getAttribute("aria-hidden")).toBe(
      "false",
    );
  });

  it("sets data-state open on the open item's indicator", async () => {
    const { container } = await drawn(composed({ defaultValue: ["delivery"] }));

    expect(slotElement(container, "accordion", "itemIndicator").dataset["state"]).toBe("open");
  });
});
