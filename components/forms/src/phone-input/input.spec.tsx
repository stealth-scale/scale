import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import * as Field from "#field/index.ts";
import { backspaced, edit, inserted } from "#input-mask/input-mask.fixtures.tsx";
import { Input } from "#phone-input/input.tsx";
import { number, phoned } from "#phone-input/phone-input.fixtures.tsx";
import { Root } from "#phone-input/root.tsx";

describe("Input", () => {
  it("satisfies the component contract with input as its element", () => {
    expect(
      violations(Input, {
        element: "INPUT",
        subject: (container) => slotElement(container, "input-group", "field"),
        wrapper: (children) => <Root defaultCountry="NL">{children}</Root>,
      }),
    ).toStrictEqual([]);
  });

  it("sets type to tel", () => {
    render(phoned({}, null));

    expect(number().type).toBe("tel");
  });

  it("asks for the phone keyboard", () => {
    render(phoned({}, null));

    expect(number().inputMode).toBe("tel");
  });

  it("asks a browser to fill in the person's phone number", () => {
    render(phoned({}, null));

    expect(number().getAttribute("autocomplete")).toBe("tel");
  });

  it("formats a number as it is typed", () => {
    render(phoned({}, null));
    inserted(number(), 0, "0612345678");

    expect(number().value).toBe("06 12345678");
  });

  it("puts the caret after the digit typed in the middle", () => {
    render(phoned({ defaultValue: "0612345678" }, null));
    inserted(number(), 3, "9");

    expect(number().selectionStart).toBe(3);
  });

  it("formats a pasted number", () => {
    render(phoned({}, null));
    edit(number(), "+44-20-7183-8750", 16, "insertFromPaste");

    expect(number().value).toBe("+44 20 7183 8750");
  });

  it("removes one digit with each Backspace down to an empty number", () => {
    render(phoned({ defaultCountry: "US" }, null));
    inserted(number(), 0, "2125550123");

    const digits = [number().value.replaceAll(/\D/gu, "").length];

    for (let step = 0; step < 20 && number().value !== ""; step += 1) {
      backspaced(number(), number().value.length);
      digits.push(number().value.replaceAll(/\D/gu, "").length);
    }

    expect(digits).toStrictEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
  });

  it("calls the caller's onChange after an edit", () => {
    const changed = vi.fn<() => void>();

    render(
      <Root defaultCountry="NL">
        <Input aria-label="Phone number" onChange={changed} />
      </Root>,
    );
    fireEvent.change(number(), { target: { value: "06" } });

    expect(changed).toHaveBeenCalledTimes(1);
  });

  it("takes the control ID the field's label points at", () => {
    const { getByText } = render(
      <Field.Root>
        <Field.Label>Phone number</Field.Label>
        {phoned({}, null)}
      </Field.Root>,
    );

    expect(getByText("Phone number").closest("label")?.htmlFor).toBe(number().id);
  });

  it("lists the field's texts in aria-describedby", () => {
    const { getByText } = render(
      <Field.Root>
        <Field.Label>Phone number</Field.Label>
        {phoned({}, null)}
        <Field.HelperText>We text a code to it.</Field.HelperText>
      </Field.Root>,
    );

    expect(number().getAttribute("aria-describedby")).toContain(
      getByText("We text a code to it.").id,
    );
  });

  it("marks the input invalid when the root is invalid", () => {
    render(phoned({ invalid: true }, null));

    expect(number().getAttribute("aria-invalid")).toBe("true");
  });

  it("keeps spell checking off", () => {
    render(phoned({}, null));

    expect(number().getAttribute("spellcheck")).toBe("false");
  });
});
