import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { labelled } from "#progress/progress.fixtures.tsx";

describe("Range", () => {
  it("renders a DIV for the range slot", async () => {
    const { container } = await drawn(labelled());

    expect(slotElement(container, "progress", "range").tagName).toBe("DIV");
  });

  it("sets its width to the value's share of the range", async () => {
    const { container } = await drawn(labelled({ max: 200, value: 50 }));

    expect(slotElement(container, "progress", "range").style.width).toBe("25%");
  });

  it("sets no width while the value is unknown", async () => {
    const { container } = await drawn(labelled({ value: null }));

    expect(slotElement(container, "progress", "range").style.width).toBe("");
  });

  it.each([
    { state: "loading", value: 40 },
    { state: "complete", value: 100 },
    { state: "indeterminate", value: null },
  ])("writes data-state $state for the value $value", async ({ state, value }) => {
    const { container } = await drawn(labelled({ value }));

    expect(slotElement(container, "progress", "range").dataset["state"]).toBe(state);
  });
});
