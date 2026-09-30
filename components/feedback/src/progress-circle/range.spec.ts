import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { labelled } from "#progress-circle/progress-circle.fixtures.tsx";

describe("Range", () => {
  it("renders a circle over the track", async () => {
    const { container } = await drawn(labelled({ value: 62 }));

    expect(slotElement(container, "progress-circle", "range").tagName.toLowerCase()).toBe("circle");
  });

  it("writes the value's share as a custom property", async () => {
    const { container } = await drawn(labelled({ value: 62 }));

    expect(
      slotElement(container, "progress-circle", "range").style.getPropertyValue("--percent"),
    ).toBe("62");
  });

  it("marks an unknown value", async () => {
    const { container } = await drawn(labelled({ value: null }));

    expect(slotElement(container, "progress-circle", "range").dataset["state"]).toBe(
      "indeterminate",
    );
  });
});
