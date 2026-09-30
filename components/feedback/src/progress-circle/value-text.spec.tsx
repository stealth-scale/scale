import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { labelled } from "#progress-circle/progress-circle.fixtures.tsx";
import { Root } from "#progress-circle/root.tsx";
import { ValueText } from "#progress-circle/value-text.tsx";

describe("ValueText", () => {
  it("renders the formatted value", async () => {
    const { container } = await drawn(labelled({ value: 62 }));

    expect(slotElement(container, "progress-circle", "valueText").textContent).toBe("62%");
  });

  it("renders nothing while the value is unknown", async () => {
    const { container } = await drawn(labelled({ value: null }));

    expect(slotElement(container, "progress-circle", "valueText").textContent).toBe("");
  });

  it("is not a live region", async () => {
    const { container } = await drawn(labelled({ value: 62 }));

    expect(slotElement(container, "progress-circle", "valueText").getAttribute("aria-live")).toBe(
      "off",
    );
  });

  it("keeps the live region the caller passes", async () => {
    const { container } = await drawn(
      <Root>
        <ValueText aria-live="polite" />
      </Root>,
    );

    expect(slotElement(container, "progress-circle", "valueText").getAttribute("aria-live")).toBe(
      "polite",
    );
  });

  it("renders the children the caller passes in place of the value", async () => {
    await drawn(
      <Root max={5} value={3}>
        <ValueText>3/5</ValueText>
      </Root>,
    );

    expect(screen.getByText("3/5")).toBeDefined();
  });
});
