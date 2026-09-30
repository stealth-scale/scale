import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { started } from "#tour/tour.fixtures.tsx";

describe("Control", () => {
  it("renders a div", async () => {
    const { container } = await started();

    expect(slotElement(container, "tour", "control").tagName).toBe("DIV");
  });

  it("contains the progress text before the buttons", async () => {
    const { container } = await started();

    expect(slotElement(container, "tour", "control").firstElementChild).toBe(
      slotElement(container, "tour", "progressText"),
    );
  });
});
