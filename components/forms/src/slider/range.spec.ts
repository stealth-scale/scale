import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#slider/slider.fixtures.tsx";

describe("Range", () => {
  it("renders a div", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "slider", "range").tagName).toBe("DIV");
  });

  it("ends where the root's custom property places it", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "slider", "range").style.right).toBe("var(--slider-range-end)");
  });
});
