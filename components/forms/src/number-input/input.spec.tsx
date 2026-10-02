import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import * as Field from "#field/index.ts";
import { composed, focused } from "#number-input/number-input.fixtures.tsx";

/**
 * Focuses the spinbutton and presses one key in it.
 *
 * @param key - The key to press.
 * @param init - The modifier keys held with it.
 * @returns The spinbutton.
 */
async function keyed(key: string, init: { shiftKey?: boolean } = {}): Promise<HTMLInputElement> {
  const input = screen.getByRole<HTMLInputElement>("spinbutton");

  await focused(input);
  fireEvent.keyDown(input, { key, ...init });
  await settled();

  return input;
}

describe("Input", () => {
  it("renders an input in the spinbutton role", async () => {
    await drawn(composed());

    expect(screen.getByRole("spinbutton").tagName).toBe("INPUT");
  });

  it("renders the value formatted as its text", async () => {
    await drawn(composed({ defaultValue: "1250", formatOptions: { style: "decimal" } }));

    expect(screen.getByRole<HTMLInputElement>("spinbutton").value).toBe("1,250");
  });

  it("sets aria-valuenow to the value", async () => {
    await drawn(composed());

    expect(screen.getByRole("spinbutton").getAttribute("aria-valuenow")).toBe("4");
  });

  it("sets aria-valuemin and aria-valuemax to min and max", async () => {
    await drawn(composed());

    const input = screen.getByRole("spinbutton");

    expect([
      input.getAttribute("aria-valuemin"),
      input.getAttribute("aria-valuemax"),
    ]).toStrictEqual(["1", "50"]);
  });

  it("steps the value up on ArrowUp", async () => {
    await drawn(composed());

    expect((await keyed("ArrowUp")).value).toBe("5");
  });

  it("steps the value down on ArrowDown", async () => {
    await drawn(composed());

    expect((await keyed("ArrowDown")).value).toBe("3");
  });

  it("steps the value up by ten steps on Shift and ArrowUp", async () => {
    await drawn(composed());

    expect((await keyed("ArrowUp", { shiftKey: true })).value).toBe("14");
  });

  it("sets the minimum on Home", async () => {
    await drawn(composed());

    expect((await keyed("Home")).value).toBe("1");
  });

  it("sets the maximum on End", async () => {
    await drawn(composed());

    expect((await keyed("End")).value).toBe("50");
  });

  it("keeps the value on ArrowUp in a read-only input", async () => {
    await drawn(composed({ readOnly: true }));

    expect((await keyed("ArrowUp")).value).toBe("4");
  });

  it("clamps a value over the maximum on blur", async () => {
    await drawn(composed());

    const input = screen.getByRole<HTMLInputElement>("spinbutton");

    await focused(input);
    fireEvent.input(input, { target: { value: "60" } });
    await settled();
    act(() => {
      input.blur();
    });
    await settled();

    expect(input.value).toBe("50");
  });

  it("takes its name from the label of the field around it", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Seats</Field.Label>
        {composed({}, {})}
      </Field.Root>,
    );

    expect(screen.getByRole("spinbutton", { name: "Seats" })).toBeDefined();
  });

  it("lists the field's helper and error texts in aria-describedby", async () => {
    await drawn(
      <Field.Root id="seats">
        {composed()}
        <Field.HelperText>One seat per person.</Field.HelperText>
      </Field.Root>,
    );

    expect(
      screen.getByRole("spinbutton").getAttribute("aria-describedby")?.split(" "),
    ).toStrictEqual(["seats-helper", "seats-error"]);
  });

  it("sets no aria-describedby outside a field", async () => {
    await drawn(composed());

    expect(screen.getByRole("spinbutton").getAttribute("aria-describedby")).toBeNull();
  });

  it("submits under the name the root passes", async () => {
    await drawn(composed({ name: "seats" }));

    expect(screen.getByRole<HTMLInputElement>("spinbutton").name).toBe("seats");
  });
});
