import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#angle-slider/angle-slider.fixtures.tsx";

describe("Control", () => {
  it("renders a div in the presentation role around the thumb", async () => {
    const { container } = await drawn(composed());
    const control = slotElement(container, "angle-slider", "control");

    expect([
      control.tagName,
      control.getAttribute("role"),
      control.contains(slotElement(container, "angle-slider", "thumb")),
    ]).toStrictEqual(["DIV", "presentation", true]);
  });

  it("keeps a touch from scrolling the page", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "angle-slider", "control").style.touchAction).toBe("none");
  });
});
