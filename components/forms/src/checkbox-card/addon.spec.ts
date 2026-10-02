import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { card } from "#checkbox-card/checkbox-card.fixtures.tsx";

describe("Addon", () => {
  it("renders a span", async () => {
    await drawn(card());

    expect(screen.getByText("Free").tagName).toBe("SPAN");
  });

  it("sets data-state to unchecked on an unchecked card", async () => {
    await drawn(card());

    expect(screen.getByText("Free").dataset["state"]).toBe("unchecked");
  });

  it("describes the card's input on a card without a description", async () => {
    await drawn(card({}, { described: false }));

    expect(screen.getByRole("checkbox").getAttribute("aria-describedby")).toBe(
      screen.getByText("Free").id,
    );
  });
});
