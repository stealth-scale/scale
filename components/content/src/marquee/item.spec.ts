import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#marquee/marquee.fixtures.tsx";

describe("Item", () => {
  it("renders a div with the item class", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "marquee", "item").tagName).toBe("DIV");
  });

  it("spaces the items by half the gap on each side of the line they move along", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "marquee", "item").style.marginInline).toBe(
      "calc(var(--marquee-spacing) / 2)",
    );
  });
});
