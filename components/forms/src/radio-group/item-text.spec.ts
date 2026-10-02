import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#radio-group/radio-group.fixtures.tsx";

describe("ItemText", () => {
  it("renders a span inside the item", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "radio-group", "itemText").tagName).toBe("SPAN");
  });

  it("names the item's input through aria-labelledby", async () => {
    const { container } = await drawn(composed());

    expect(screen.getByRole("radio", { name: "Same day" }).getAttribute("aria-labelledby")).toBe(
      slotElement(container, "radio-group", "itemText").id,
    );
  });

  it("sets data-disabled on the words of a disabled option", async () => {
    const { container } = await drawn(composed({}, { closed: "Same day" }));

    expect(slotElement(container, "radio-group", "itemText").dataset["disabled"]).toBe("");
  });
});
