import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#angle-slider/angle-slider.fixtures.tsx";

describe("Track", () => {
  it("renders a div around the range", async () => {
    const { container } = await drawn(composed());
    const track = slotElement(container, "angle-slider", "track");

    expect([
      track.tagName,
      track.contains(slotElement(container, "angle-slider", "range")),
    ]).toStrictEqual(["DIV", true]);
  });
});
