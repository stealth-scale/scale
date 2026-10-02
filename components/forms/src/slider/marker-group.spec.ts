import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#slider/slider.fixtures.tsx";

describe("MarkerGroup", () => {
  it("hides the markers from assistive technology", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "slider", "markerGroup").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("leaves out the machine's inline position", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "slider", "markerGroup").style.position).toBe("");
  });
});
