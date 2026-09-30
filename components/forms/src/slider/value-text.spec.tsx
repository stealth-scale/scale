import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Root } from "#slider/root.tsx";
import { composed, ranged } from "#slider/slider.fixtures.tsx";
import { ValueText } from "#slider/value-text.tsx";

describe("ValueText", () => {
  it("renders the value as a number without formatOptions", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "slider", "valueText").textContent).toBe("40");
  });

  it("renders the value in the root's format", async () => {
    const { container } = await drawn(
      composed({ formatOptions: { style: "unit", unit: "percent" }, locale: "en-GB" }),
    );

    expect(slotElement(container, "slider", "valueText").textContent).toBe("40%");
  });

  it("joins the values of a range with an en dash", async () => {
    const { container } = await drawn(ranged());

    expect(slotElement(container, "slider", "valueText").textContent).toBe("20 – 80");
  });

  it("joins the values of a range with separator", async () => {
    await drawn(
      <Root defaultValue={[20, 80]}>
        <ValueText separator=" to " />
      </Root>,
    );

    expect(screen.getByText("20 to 80")).toBeDefined();
  });

  it("renders the children the caller passes in place of the value", async () => {
    await drawn(
      <Root defaultValue={[20]}>
        <ValueText>Low</ValueText>
      </Root>,
    );

    expect(screen.getByText("Low")).toBeDefined();
  });
});
