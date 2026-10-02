import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { dated, hiddenOf, segment } from "#date-input/date-input.fixtures.tsx";

describe("Label", () => {
  it("renders a label", async () => {
    const { container } = await drawn(dated());

    expect(slotElement(container, "date-input", "label").tagName).toBe("LABEL");
  });

  it("points at the first hidden input", async () => {
    const { container } = await drawn(dated());

    expect(slotElement(container, "date-input", "label").getAttribute("for")).toBe(
      hiddenOf(container).id,
    );
  });

  it("names the group", async () => {
    await drawn(dated());

    expect(screen.getByRole("group", { name: "Appointment" })).toBeDefined();
  });

  it("moves focus to the first segment on a press", async () => {
    await drawn(dated());

    fireEvent.click(screen.getByText("Appointment"));
    await settled();

    expect(document.activeElement).toBe(segment("month, Appointment"));
  });
});
