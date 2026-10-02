import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { labelled } from "#progress-circle/progress-circle.fixtures.tsx";

describe("Track", () => {
  it("renders a circle inside the ring", async () => {
    const { container } = await drawn(labelled({ value: 62 }));

    expect(slotElement(container, "progress-circle", "track").tagName.toLowerCase()).toBe("circle");
  });

  it("takes its radius from the ring's size and thickness", async () => {
    const { container } = await drawn(labelled({ value: 62 }));

    expect(
      slotElement(container, "progress-circle", "track").style.getPropertyValue("--radius"),
    ).toBe("calc(var(--size) / 2 - var(--thickness) / 2)");
  });
});
