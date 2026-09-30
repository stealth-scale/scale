import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Control } from "#slider/control.tsx";
import { DraggingIndicator } from "#slider/dragging-indicator.tsx";
import { Root } from "#slider/root.tsx";
import { composed } from "#slider/slider.fixtures.tsx";
import { Thumb } from "#slider/thumb.tsx";

describe("DraggingIndicator", () => {
  it("hides itself while its thumb is still", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "slider", "draggingIndicator").hidden).toBe(true);
  });

  it("renders its thumb's value in the root's format", async () => {
    const { container } = await drawn(
      composed({ formatOptions: { style: "unit", unit: "percent" }, locale: "en-GB" }),
    );

    expect(slotElement(container, "slider", "draggingIndicator").textContent).toBe("40%");
  });

  it("leaves out the machine's inline position", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "slider", "draggingIndicator").style.position).toBe("");
  });

  it("renders the children the caller passes in place of the value", async () => {
    await drawn(
      <Root defaultValue={[40]}>
        <Control>
          <Thumb label="Volume">
            <DraggingIndicator>Forty</DraggingIndicator>
          </Thumb>
        </Control>
      </Root>,
    );

    expect(screen.getByText("Forty")).toBeDefined();
  });
});
