import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#radio-group/radio-group.fixtures.tsx";

describe("ItemControl", () => {
  it("renders a span inside the item", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "radio-group", "itemControl").tagName).toBe("SPAN");
  });

  it("hides the circle from assistive technology", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "radio-group", "itemControl").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("sets data-state to checked on the circle of the checked option", async () => {
    const { container } = await drawn(composed({ defaultValue: "Same day" }));

    expect(slotElement(container, "radio-group", "itemControl").dataset["state"]).toBe("checked");
  });

  it("sets data-invalid on the circles of an invalid group", async () => {
    const { container } = await drawn(composed({ invalid: true }));

    expect(slotElement(container, "radio-group", "itemControl").dataset["invalid"]).toBe("");
  });
});
