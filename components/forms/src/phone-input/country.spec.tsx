import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed, settled, violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import * as Field from "#field/index.ts";
import { inserted } from "#input-mask/input-mask.fixtures.tsx";
import { Country } from "#phone-input/country.tsx";
import { number, phoned } from "#phone-input/phone-input.fixtures.tsx";
import { Root, type RootProps } from "#phone-input/root.tsx";
import { opened } from "#select/select.fixtures.tsx";

/**
 * Presses the row of a country in the open list.
 */
async function chose(name: RegExp): Promise<void> {
  await pressed(screen.getByRole("option", { name }));
  await settled();
}

describe("Country", () => {
  it("satisfies the component contract with div as its element", () => {
    expect(
      violations(Country, {
        element: "DIV",
        props: { label: "Country" },
        subject: (container) => slotElement(container, "input-group", "addon"),
        wrapper: (children) => <Root defaultCountry="NL">{children}</Root>,
      }),
    ).toStrictEqual([]);
  });

  it("renders the input group's plain addon", async () => {
    const { container } = await drawn(phoned());

    expect(slotElement(container, "input-group", "addon").dataset["look"]).toBe("plain");
  });

  it("lists the offered countries in their order", async () => {
    await drawn(phoned());
    await opened();

    expect(screen.getAllByRole("option").map((option) => option.textContent)).toStrictEqual([
      "Netherlands+31",
      "Belgium+32",
      "United Kingdom+44",
      "United States+1",
    ]);
  });

  it("rewrites the digits in the international form of a picked country", async () => {
    await drawn(phoned({ defaultValue: "0612345678" }));
    await opened();
    await chose(/United Kingdom/u);

    expect(number().value).toBe("+44 612345678");
  });

  it("reports a picked country", async () => {
    const heard = vi.fn<NonNullable<RootProps["onCountryChange"]>>();

    await drawn(phoned({ onCountryChange: heard }));
    await opened();
    await chose(/Belgium/u);

    expect(heard.mock.lastCall).toStrictEqual([{ country: "BE" }]);
  });

  it("follows a typed prefix to the country it names", async () => {
    await drawn(phoned());
    inserted(number(), 0, "+442071838750");
    await settled();

    expect(screen.getByRole("combobox").textContent).toBe("United Kingdom+44");
  });

  it("renders each row's glyph hidden from a screen reader", async () => {
    await drawn(phoned({}, { flagOf: (code) => `[${code}]` }));
    await opened();

    expect(
      screen.getByRole("option", { name: /Belgium/u }).querySelector("[aria-hidden=true]")
        ?.textContent,
    ).toBe("[BE]");
  });

  it("renders the check in the picked country's row", async () => {
    await drawn(phoned({}, { check: "✓" }));
    await opened();

    const row = screen.getByRole("option", { name: /Netherlands/u });

    expect(slotElement(row, "select", "itemIndicator").textContent).toBe("✓");
  });

  it("opens the list under the input group's box", async () => {
    const { container } = await drawn(phoned());
    const box = slotElement(container, "input-group", "root");
    const measured = vi.spyOn(box, "getBoundingClientRect");

    await opened();

    expect(measured).toHaveBeenCalled();
  });

  it("gives its hidden select an ID of its own inside a field", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Phone number</Field.Label>
        {phoned()}
      </Field.Root>,
    );

    expect(document.querySelector("select")?.id).not.toBe(number().id);
  });

  it("keeps a field's required state off its hidden select", async () => {
    await drawn(<Field.Root required>{phoned()}</Field.Root>);

    expect(document.querySelector("select")?.required).toBe(false);
  });

  it("takes the disabled state of the root", async () => {
    await drawn(phoned({ disabled: true }));

    expect(screen.getByRole("combobox").hasAttribute("disabled")).toBe(true);
  });

  it("takes an addon look the caller states", async () => {
    const { container } = await drawn(phoned({}, { look: "filled" }));

    expect(slotElement(container, "input-group", "addon").dataset["look"]).toBe("filled");
  });
});
