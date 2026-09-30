import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { card } from "#checkbox-card/checkbox-card.fixtures.tsx";

describe("Content", () => {
  it("renders a span inside the card", async () => {
    const { container } = await drawn(card());

    expect(slotElement(container, "checkbox-card", "content").tagName).toBe("SPAN");
  });
});
