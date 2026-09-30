import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#segment-group/segment-group.fixtures.tsx";

describe("ItemText", () => {
  it("renders a span inside the item", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "segment-group", "itemText").tagName).toBe("SPAN");
  });

  it("names the item's input through aria-labelledby", async () => {
    const { container } = await drawn(composed());

    expect(screen.getByRole("radio", { name: "Week" }).getAttribute("aria-labelledby")).toBe(
      slotElement(container, "segment-group", "itemText").id,
    );
  });

  it("keeps the words as the name of an iconic group's input", async () => {
    await drawn(composed({ iconic: true }));

    expect(screen.getByRole("radio", { name: "Quarter" })).toBeDefined();
  });
});
