import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { card } from "#checkbox-card/checkbox-card.fixtures.tsx";

describe("Label", () => {
  it("renders a span inside the card", async () => {
    const { container } = await drawn(card());

    expect(slotElement(container, "checkbox-card", "label").tagName).toBe("SPAN");
  });

  it("names the card's input through aria-labelledby", async () => {
    const { container } = await drawn(card());

    expect(screen.getByRole("checkbox").getAttribute("aria-labelledby")).toBe(
      slotElement(container, "checkbox-card", "label").id,
    );
  });
});
