import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#angle-slider/angle-slider.fixtures.tsx";
import { Root } from "#angle-slider/root.tsx";
import { ValueText } from "#angle-slider/value-text.tsx";

describe("ValueText", () => {
  it("renders the value in degrees by default", async () => {
    const { container } = await drawn(composed({ locale: "en-GB" }));

    expect(slotElement(container, "angle-slider", "valueText").textContent).toBe("45°");
  });

  it("renders the value in the root's format", async () => {
    const { container } = await drawn(
      composed({
        formatOptions: { style: "unit", unit: "degree", unitDisplay: "long" },
        locale: "en-GB",
      }),
    );

    expect(slotElement(container, "angle-slider", "valueText").textContent).toBe("45 degrees");
  });

  it("renders the children the caller passes in place of the value", async () => {
    await drawn(
      <Root defaultValue={90}>
        <ValueText>East</ValueText>
      </Root>,
    );

    expect(screen.getByText("East")).toBeDefined();
  });
});
