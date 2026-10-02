import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import * as Field from "#field/index.ts";
import { phoned } from "#phone-input/phone-input.fixtures.tsx";

describe("Trigger", () => {
  it("names the button by the picker's label", async () => {
    await drawn(phoned());

    expect(screen.getByRole("combobox", { name: "Country" }).tagName).toBe("BUTTON");
  });

  it("reads the country's name before its calling code as the button's text", async () => {
    await drawn(phoned());

    expect(screen.getByRole("combobox").textContent).toBe("Netherlands+31");
  });

  it("hides the country's name visually", async () => {
    const { container } = await drawn(phoned());

    expect(slotElement(container, "phone-input", "name").textContent).toBe("Netherlands");
  });

  it("shows a plus while no country is picked", async () => {
    await drawn(phoned({ defaultCountry: undefined }));

    expect(screen.getByRole("combobox").textContent).toBe("+");
  });

  it("hides the country's glyph from a screen reader", async () => {
    const { container } = await drawn(phoned({}, { flagOf: (code) => `[${code}]` }));

    expect(slotElement(container, "phone-input", "flag").getAttribute("aria-hidden")).toBe("true");
  });

  it("renders the glyph of the picked country", async () => {
    const { container } = await drawn(phoned({}, { flagOf: (code) => `[${code}]` }));

    expect(slotElement(container, "phone-input", "flag").textContent).toBe("[NL]");
  });

  it("hides the indicator from a screen reader", async () => {
    const { container } = await drawn(phoned({}, { indicator: "v" }));

    expect(slotElement(container, "phone-input", "indicator").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("renders no indicator without one", async () => {
    const { container } = await drawn(phoned());

    expect(container.querySelector(".phone-input__indicator")).toBeNull();
  });

  it("keeps its own name inside a field", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Phone number</Field.Label>
        {phoned()}
      </Field.Root>,
    );

    expect(screen.getByRole("combobox").getAttribute("aria-labelledby")).toBe(
      screen.getByText("Country").id,
    );
  });

  it("is described by the field's texts", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Phone number</Field.Label>
        {phoned()}
        <Field.HelperText>We text a code to it.</Field.HelperText>
      </Field.Root>,
    );

    expect(screen.getByRole("combobox").getAttribute("aria-describedby")).toContain(
      screen.getByText("We text a code to it.").id,
    );
  });
});
