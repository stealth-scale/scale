import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#radio-card/radio-card.fixtures.tsx";

describe("ItemText", () => {
  it("renders a span inside the card", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "radio-card", "itemText").tagName).toBe("SPAN");
  });

  it("names the card's input through aria-labelledby", async () => {
    const { container } = await drawn(composed());

    expect(screen.getByRole("radio", { name: "Standard" }).getAttribute("aria-labelledby")).toBe(
      slotElement(container, "radio-card", "itemText").id,
    );
  });
});
