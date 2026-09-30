import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#pin-input/pin-input.fixtures.tsx";

describe("Control", () => {
  it("renders a div", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "pin-input", "control").tagName).toBe("DIV");
  });

  it("contains every box", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "pin-input", "control").querySelectorAll("input")).toHaveLength(
      4,
    );
  });
});
