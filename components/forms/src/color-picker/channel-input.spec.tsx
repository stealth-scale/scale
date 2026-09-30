import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { ChannelInput } from "#color-picker/channel-input.tsx";
import { framed, hiddenOf, opened, picker } from "#color-picker/color-picker.fixtures.tsx";

/**
 * Types a text into an input and presses Enter on it, as a person committing a value does.
 *
 * @param input - The input.
 * @param text - The text the input takes.
 * @returns A promise that resolves once the machine has settled.
 */
async function committed(input: HTMLElement, text: string): Promise<void> {
  fireEvent.change(input, { target: { value: text } });
  fireEvent.keyDown(input, { key: "Enter" });
  await settled();
  await framed();
}

describe("ChannelInput", () => {
  it("renders a text input for hex", async () => {
    await drawn(picker());

    expect(screen.getByRole("textbox").getAttribute("type")).toBe("text");
  });

  it("renders a number input for a channel", async () => {
    await drawn(picker({}, { panel: <ChannelInput channel="red" /> }));
    await opened();

    expect(screen.getByRole("spinbutton", { name: "Red" }).getAttribute("max")).toBe("255");
  });

  it("is named by the picker's label inside the control", async () => {
    await drawn(picker());

    expect(screen.getByRole("textbox").getAttribute("aria-labelledby")).toBe(
      screen.getByText("Brand color").id,
    );
  });

  it("is named after its channel inside a control without a label", async () => {
    await drawn(picker({}, { labelled: false }));

    expect(screen.getByRole("textbox").getAttribute("aria-label")).toBe("Hex");
  });

  it("takes the name passed as label outside the control", async () => {
    await drawn(picker({}, { panel: <ChannelInput channel="green" label="Groen" /> }));
    await opened();

    expect(screen.getByRole("spinbutton", { name: "Groen" })).toBeDefined();
  });

  it("reports aria-invalid for an invalid picker inside the control", async () => {
    await drawn(picker({ invalid: true }));

    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
  });

  it("reports aria-required for a required picker inside the control", async () => {
    await drawn(picker({ required: true }));

    expect(screen.getByRole("textbox").getAttribute("aria-required")).toBe("true");
  });

  it("gives a hex input in the panel no field ID", async () => {
    await drawn(picker({ id: "brand" }, { hex: false, panel: <ChannelInput channel="hex" /> }));
    await opened();

    expect(screen.getByRole("textbox").id).not.toBe("color-picker:brand:field");
  });

  it("leaves out the machine's inline appearance", async () => {
    await drawn(picker());

    expect(screen.getByRole("textbox").hasAttribute("style")).toBe(false);
  });

  it("commits a typed color on Enter", async () => {
    const { container } = await drawn(picker());

    await committed(screen.getByRole("textbox"), "#DC2626");

    expect(hiddenOf(container).value).toBe("rgba(220, 38, 38, 1)");
  });

  it("keeps the color when the typed text is not one", async () => {
    const { container } = await drawn(picker());

    await committed(screen.getByRole("textbox"), "brand blue");

    expect(hiddenOf(container).value).toBe("rgba(37, 99, 235, 1)");
  });
});
