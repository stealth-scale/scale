import { type ReactElement } from "react";

import { parseDate } from "@internationalized/date";
import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";

import {
  entered,
  hiddenOf,
  OCTOBER_14,
  picked,
  trigger,
} from "#date-picker/date-picker.fixtures.tsx";
import { Input } from "#date-picker/input.tsx";
import * as Field from "#field/index.ts";

/**
 * Renders a floating range picker with a check-in and a check-out input, October 2 to October 5.
 *
 * @returns The date picker.
 */
function stayed(): ReactElement {
  return picked(
    { defaultValue: [parseDate("2026-10-02"), parseDate("2026-10-05")], selectionMode: "range" },
    {
      control: (
        <>
          <Input aria-label="Check-in" />
          <Input aria-label="Check-out" index={1} />
        </>
      ),
    },
  );
}

/**
 * Types text into an input as a browser does and waits for the machine, without pressing Enter.
 *
 * @param input - The input.
 * @param text - The text.
 * @returns A promise that resolves once the machine has settled.
 */
async function typed(input: HTMLInputElement, text: string): Promise<void> {
  act(() => {
    input.focus();
  });
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, text);
  fireEvent(input, new InputEvent("input", { bubbles: true, inputType: "insertText" }));
  await settled();
}

/**
 * Moves focus off an input and waits for the machine.
 *
 * @param input - The input.
 * @returns A promise that resolves once the machine has settled.
 */
async function blurred(input: HTMLInputElement): Promise<void> {
  act(() => {
    input.blur();
  });
  await settled();
}

describe("Input", () => {
  it("renders a text input", async () => {
    await drawn(picked());

    expect(screen.getByRole("textbox").tagName).toBe("INPUT");
  });

  it("is named by the label", async () => {
    await drawn(picked());

    expect(screen.getByRole("textbox", { name: "Appointment" })).toBeDefined();
  });

  it("is named by the label followed by its aria-label", async () => {
    await drawn(stayed());

    expect(screen.getByRole("textbox", { name: "Appointment Check-out" })).toBeDefined();
  });

  it("is named by its aria-label without a label", async () => {
    await drawn(picked({}, { control: <Input aria-label="Visit" />, label: null }));

    expect(screen.getByRole("textbox", { name: "Visit" })).toBeDefined();
  });

  it("is described by the field's helper text", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Visit</Field.Label>
        {picked({}, { label: null })}
        <Field.HelperText>Pick a weekday.</Field.HelperText>
      </Field.Root>,
    );

    expect(screen.getByRole("textbox").getAttribute("aria-describedby")).toContain(
      screen.getByText("Pick a weekday.").id,
    );
  });

  it("reports aria-required while required", async () => {
    await drawn(picked({ required: true }));

    expect(screen.getByRole("textbox").getAttribute("aria-required")).toBe("true");
  });

  it("leaves out the required attribute", async () => {
    await drawn(picked({ required: true }));

    expect(screen.getByRole<HTMLInputElement>("textbox").required).toBe(false);
  });

  it("leaves out the name attribute", async () => {
    await drawn(picked({ name: "appointment" }));

    expect(screen.getByRole("textbox").hasAttribute("name")).toBe(false);
  });

  it("shows the date in the locale's format", async () => {
    await drawn(picked({ defaultValue: [OCTOBER_14] }));

    expect(screen.getByRole<HTMLInputElement>("textbox").value).toBe("10/14/2026");
  });

  it("shows the end of a range at index 1", async () => {
    await drawn(stayed());

    expect(
      screen.getByRole<HTMLInputElement>("textbox", { name: "Appointment Check-out" }).value,
    ).toBe("10/05/2026");
  });

  it("selects the date typed on Enter", async () => {
    const { container } = await drawn(picked());

    await entered(screen.getByRole("textbox"), "10/20/2026");

    expect(hiddenOf(container).value).toBe("2026-10-20");
  });

  it("selects the date typed when it loses focus", async () => {
    const { container } = await drawn(picked());
    const input = screen.getByRole<HTMLInputElement>("textbox");

    await typed(input, "10/20/2026");
    await blurred(input);

    expect(hiddenOf(container).value).toBe("2026-10-20");
  });

  it("selects nothing when it loses focus without fixOnBlur", async () => {
    const { container } = await drawn(picked({}, { control: <Input fixOnBlur={false} /> }));
    const input = screen.getByRole<HTMLInputElement>("textbox");

    await typed(input, "10/20/2026");
    await blurred(input);

    expect(hiddenOf(container).value).toBe("");
  });

  it("opens the panel on a press with openOnClick", async () => {
    await drawn(picked({ openOnClick: true }));
    await pressed(screen.getByRole("textbox"));
    await settled();

    expect(trigger().getAttribute("aria-expanded")).toBe("true");
  });
});
