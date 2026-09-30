import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { started } from "#tour/tour.fixtures.tsx";

describe("ArrowTip", () => {
  it("renders a div inside the arrow", async () => {
    const { container } = await started();

    expect(slotElement(container, "tour", "arrowTip").parentElement).toBe(
      slotElement(container, "tour", "arrow"),
    );
  });

  it("sets data-part to arrow-tip", async () => {
    const { container } = await started();

    expect(slotElement(container, "tour", "arrowTip").dataset["part"]).toBe("arrow-tip");
  });
});
