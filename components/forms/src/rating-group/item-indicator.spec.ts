import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#rating-group/rating-group.fixtures.tsx";

describe("ItemIndicator", () => {
  it("hides the glyph from assistive technology", async () => {
    const { container } = await drawn(composed());

    expect(
      slotElement(container, "rating-group", "itemIndicator").getAttribute("aria-hidden"),
    ).toBe("true");
  });

  it("renders the glyph as the empty layer", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "rating-group", "itemEmpty").textContent).toBe("★");
  });

  it("renders the glyph again as the filled layer", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "rating-group", "itemFilled").textContent).toBe("★");
  });
});
