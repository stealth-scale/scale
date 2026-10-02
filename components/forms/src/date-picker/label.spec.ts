import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { picked, trigger } from "#date-picker/date-picker.fixtures.tsx";

describe("Label", () => {
  it("renders a label", async () => {
    const { container } = await drawn(picked());

    expect(slotElement(container, "date-picker", "label").tagName).toBe("LABEL");
  });

  it("points at the first text input", async () => {
    const { container } = await drawn(picked());

    expect(slotElement(container, "date-picker", "label").getAttribute("for")).toBe(
      screen.getByRole("textbox").id,
    );
  });

  it("names the text input", async () => {
    await drawn(picked());

    expect(screen.getByRole("textbox", { name: "Appointment" })).toBeDefined();
  });

  it("passes a press to the text input", async () => {
    await drawn(picked({ openOnClick: true }));

    fireEvent.click(screen.getByText("Appointment"));
    await settled();

    expect(trigger().getAttribute("aria-expanded")).toBe("true");
  });
});
