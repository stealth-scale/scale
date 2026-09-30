import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { slotElement, variantClass } from "@stealthscale/testing-theme";

import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";
import { inserted } from "#input-mask/input-mask.fixtures.tsx";
import { type ValueChangeDetails } from "#phone-input/number.ts";
import { number, phoned } from "#phone-input/phone-input.fixtures.tsx";

/**
 * Returns the value of the hidden input a form submits, or nothing without one.
 */
function submitted(container: HTMLElement): null | string {
  return container.querySelector<HTMLInputElement>("input[type=hidden]")?.value ?? null;
}

describe("Root", () => {
  it("returns no accessibility violation with a picker", async () => {
    await expect(accessibilityViolations(() => phoned())).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation without a picker", async () => {
    await expect(accessibilityViolations(() => phoned({}, null))).resolves.toStrictEqual([]);
  });

  it("renders the input group's box around the input", () => {
    const { container } = render(phoned({}, null));

    expect(slotElement(container, "input-group", "root").contains(number())).toBe(true);
  });

  it("passes size to the input group", () => {
    const { container } = render(phoned({ size: "lg" }, null));

    expect([...slotElement(container, "input-group", "root").classList]).toContain(
      variantClass("input-group__root", "size", "lg"),
    );
  });

  it("gives the box the size of the field around it", () => {
    const { container } = render(<Field.Root size="sm">{phoned({}, null)}</Field.Root>);

    expect([...slotElement(container, "input-group", "root").classList]).toContain(
      variantClass("input-group__root", "size", "sm"),
    );
  });

  it("formats the default value for the default country", () => {
    render(phoned({ defaultValue: "0612345678" }, null));

    expect(number().value).toBe("06 12345678");
  });

  it("formats a stored E.164 value in its international form", () => {
    render(phoned({ value: "+31612345678" }, null));

    expect(number().value).toBe("+31 6 12345678");
  });

  it("calls onValueChange with the details of an edit", () => {
    const heard = vi.fn<(details: ValueChangeDetails) => void>();

    render(phoned({ onValueChange: heard }, null));
    inserted(number(), 0, "0612345678");

    expect(heard.mock.lastCall).toStrictEqual([
      { country: "NL", text: "06 12345678", valid: true, value: "+31612345678" },
    ]);
  });

  it("submits the E.164 form of a valid number under name", () => {
    const { container } = render(phoned({ defaultValue: "0612345678", name: "phone" }, null));

    expect(submitted(container)).toBe("+31612345678");
  });

  it("submits the text of a number that is not valid under name", () => {
    const { container } = render(phoned({ defaultValue: "06123", name: "phone" }, null));

    expect(submitted(container)).toBe("06 123");
  });

  it("renders the hidden input after the box", () => {
    const { container } = render(phoned({ name: "phone" }, null));

    expect(
      slotElement(container, "input-group", "root").nextElementSibling?.getAttribute("name"),
    ).toBe("phone");
  });

  it("renders no hidden input without name", () => {
    const { container } = render(phoned({}, null));

    expect(submitted(container)).toBeNull();
  });

  it("takes the disabled state of the field around it", () => {
    render(<Field.Root disabled>{phoned({}, null)}</Field.Root>);

    expect(number().disabled).toBe(true);
  });

  it("takes the required state of the field around it", () => {
    render(<Field.Root required>{phoned({}, null)}</Field.Root>);

    expect(number().required).toBe(true);
  });

  it("takes the disabled state of the fieldset around it", () => {
    render(<Fieldset.Root disabled>{phoned({}, null)}</Fieldset.Root>);

    expect(number().disabled).toBe(true);
  });

  it("keeps the invalid state the caller passes over the field's", () => {
    render(<Field.Root invalid>{phoned({ invalid: false }, null)}</Field.Root>);

    expect(number().getAttribute("aria-invalid")).toBeNull();
  });

  it("passes its size to the picker", async () => {
    const { container } = await drawn(phoned({ size: "lg" }));

    expect([...slotElement(container, "phone-input", "trigger").classList]).toContain(
      variantClass("phone-input__trigger", "size", "lg"),
    );
  });
});
