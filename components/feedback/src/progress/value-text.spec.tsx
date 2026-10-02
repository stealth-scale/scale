import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { labelled } from "#progress/progress.fixtures.tsx";
import { Root } from "#progress/root.tsx";
import { ValueText } from "#progress/value-text.tsx";

describe("ValueText", () => {
  it("renders a SPAN for the value text slot", async () => {
    const { container } = await drawn(labelled());

    expect(slotElement(container, "progress", "valueText").tagName).toBe("SPAN");
  });

  it("shows the formatted value", async () => {
    const { container } = await drawn(labelled({ value: 62 }));

    expect(slotElement(container, "progress", "valueText").textContent).toBe("62%");
  });

  it("shows its children over the formatted value", async () => {
    const { container } = await drawn(
      <Root max={4200} value={2650}>
        <ValueText>2,650 of 4,200</ValueText>
      </Root>,
    );

    expect(slotElement(container, "progress", "valueText").textContent).toBe("2,650 of 4,200");
  });

  it("shows nothing while the value is unknown", async () => {
    const { container } = await drawn(labelled({ value: null }));

    expect(slotElement(container, "progress", "valueText").textContent).toBe("");
  });

  it("turns the live region off by default", async () => {
    const { container } = await drawn(labelled());

    expect(slotElement(container, "progress", "valueText").getAttribute("aria-live")).toBe("off");
  });

  it("keeps the live region the caller passes", async () => {
    const { container } = await drawn(
      <Root>
        <ValueText aria-live="polite" />
      </Root>,
    );

    expect(slotElement(container, "progress", "valueText").getAttribute("aria-live")).toBe(
      "polite",
    );
  });
});
