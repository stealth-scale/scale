import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { hiddenOf, picker } from "#color-picker/color-picker.fixtures.tsx";

describe("Label", () => {
  it("renders a label", async () => {
    const { container } = await drawn(picker());

    expect(slotElement(container, "color-picker", "label").tagName).toBe("LABEL");
  });

  it("points at the hidden input", async () => {
    const { container } = await drawn(picker());

    expect(slotElement(container, "color-picker", "label").getAttribute("for")).toBe(
      hiddenOf(container).id,
    );
  });

  it("names the hex input", async () => {
    await drawn(picker());

    expect(screen.getByRole("textbox", { name: "Brand color" })).toBeDefined();
  });

  it("moves focus to the hex input on a press", async () => {
    await drawn(picker());

    fireEvent.click(screen.getByText("Brand color"));
    await settled();

    expect(document.activeElement).toBe(screen.getByRole("textbox"));
  });
});
