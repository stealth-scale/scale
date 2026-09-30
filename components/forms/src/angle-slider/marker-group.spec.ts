import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#angle-slider/angle-slider.fixtures.tsx";

describe("MarkerGroup", () => {
  it("hides the markers from assistive technology", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "angle-slider", "markerGroup").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("renders a div inside the dial", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "angle-slider", "markerGroup").tagName).toBe("DIV");
  });
});
