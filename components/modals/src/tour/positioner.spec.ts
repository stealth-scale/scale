import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { started, stepped, toured } from "#tour/tour.fixtures.tsx";

describe("Positioner", () => {
  it("renders a div", async () => {
    const { container } = await started();

    expect(slotElement(container, "tour", "positioner").tagName).toBe("DIV");
  });

  it("renders nothing before the tour first opens", async () => {
    const { container } = await drawn(toured());

    expect(container.querySelector(".tour__positioner")).toBeNull();
  });

  it("sets data-type to dialog on a dialog step", async () => {
    const { container } = await started();

    expect(slotElement(container, "tour", "positioner").dataset["type"]).toBe("dialog");
  });

  it("sets data-type to tooltip on a step with a target", async () => {
    const { container } = await started();

    await stepped("Start");

    expect(slotElement(container, "tour", "positioner").dataset["type"]).toBe("tooltip");
  });
});
