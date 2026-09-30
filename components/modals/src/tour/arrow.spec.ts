import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { started, stepped, steps } from "#tour/tour.fixtures.tsx";

describe("Arrow", () => {
  it("renders a div", async () => {
    const { container } = await started();

    expect(slotElement(container, "tour", "arrow").tagName).toBe("DIV");
  });

  it("hides on a dialog step", async () => {
    const { container } = await started();

    expect(slotElement(container, "tour", "arrow").hidden).toBe(true);
  });

  it("shows on a tooltip step once the card is placed", async () => {
    const { container } = await started();

    await stepped("Start");

    expect(slotElement(container, "tour", "arrow").hidden).toBe(false);
  });

  it("hides on a tooltip step with arrow false", async () => {
    const { container } = await started({
      options: { steps: steps().map((step) => Object.assign(step, { arrow: false })) },
    });

    await stepped("Start");

    expect(slotElement(container, "tour", "arrow").hidden).toBe(true);
  });
});
