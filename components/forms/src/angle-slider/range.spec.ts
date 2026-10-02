import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#angle-slider/angle-slider.fixtures.tsx";

describe("Range", () => {
  it("renders an empty div inside the track", async () => {
    const { container } = await drawn(composed());
    const range = slotElement(container, "angle-slider", "range");

    expect([range.tagName, range.childElementCount]).toStrictEqual(["DIV", 0]);
  });
});
