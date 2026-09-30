import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#slider/slider.fixtures.tsx";

describe("Track", () => {
  it("renders a div around the range", async () => {
    const { container } = await drawn(composed());
    const track = slotElement(container, "slider", "track");

    expect([
      track.tagName,
      track.contains(slotElement(container, "slider", "range")),
    ]).toStrictEqual(["DIV", true]);
  });

  it("positions itself for the range the machine places", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "slider", "track").style.position).toBe("relative");
  });
});
