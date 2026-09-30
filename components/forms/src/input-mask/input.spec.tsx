import { type ChangeEvent } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import * as Field from "#field/index.ts";
import { backspaced, composed, inserted } from "#input-mask/input-mask.fixtures.tsx";

const FULL = "5551234567";

function textbox(): HTMLInputElement {
  return screen.getByRole<HTMLInputElement>("textbox");
}

describe("Input", () => {
  it("renders an input in the textbox role", () => {
    render(composed());

    expect(textbox().tagName).toBe("INPUT");
  });

  it("masks the digits a person types", () => {
    render(composed());
    inserted(textbox(), 0, FULL);

    expect(textbox().value).toBe("(555) 123-4567");
  });

  it("puts the caret after a digit typed before the pattern's first character", () => {
    render(composed({ defaultValue: FULL }));
    inserted(textbox(), 0, "9");

    expect([textbox().value, textbox().selectionStart]).toStrictEqual(["(955) 512-3456", 2]);
  });

  it("deletes the digit before the pattern's characters on Backspace", () => {
    render(composed({ defaultValue: FULL }));
    backspaced(textbox(), 6);

    expect([textbox().value, textbox().selectionStart]).toStrictEqual(["(551) 234-567", 3]);
  });

  it("puts the caret back after a refused letter", () => {
    render(composed({ defaultValue: FULL }));
    inserted(textbox(), 1, "x");

    expect([textbox().value, textbox().selectionStart]).toStrictEqual(["(555) 123-4567", 1]);
  });

  it("leaves the caret of an input without focus alone", () => {
    render(composed());

    const placed = vi.spyOn(textbox(), "setSelectionRange");

    fireEvent.input(textbox(), { target: { value: "5" } });

    expect(placed).not.toHaveBeenCalled();
  });

  it("masks a change event without an input type", () => {
    render(composed());
    fireEvent.change(textbox(), { target: { value: FULL } });

    expect(textbox().value).toBe("(555) 123-4567");
  });

  it("masks the value of an input type without a selection", () => {
    render(composed({}, { "aria-label": "Phone", type: "email" }));
    fireEvent.change(screen.getByRole<HTMLInputElement>("textbox", { name: "Phone" }), {
      target: { value: FULL },
    });

    expect(screen.getByRole<HTMLInputElement>("textbox", { name: "Phone" }).value).toBe(
      "(555) 123-4567",
    );
  });

  it("asks for the digit keyboard for a pattern of digits", () => {
    render(composed());

    expect(textbox().inputMode).toBe("numeric");
  });

  it("keeps the inputMode the caller passes", () => {
    render(composed({}, { "aria-label": "Phone", inputMode: "tel" }));

    expect(textbox().inputMode).toBe("tel");
  });

  it("turns spell checking off", () => {
    render(composed());

    expect(textbox().getAttribute("spellcheck")).toBe("false");
  });

  it("takes its name from the label of the field around it", () => {
    render(
      <Field.Root>
        <Field.Label>Phone number</Field.Label>
        {composed({}, {})}
      </Field.Root>,
    );

    expect(screen.getByRole("textbox", { name: "Phone number" })).toBeDefined();
  });

  it("lists the field's helper and error texts in aria-describedby", () => {
    render(
      <Field.Root id="phone">
        {composed()}
        <Field.HelperText>We call you about the delivery.</Field.HelperText>
      </Field.Root>,
    );

    expect(textbox().getAttribute("aria-describedby")?.split(" ")).toStrictEqual([
      "phone-helper",
      "phone-error",
    ]);
  });

  it("sets no aria-describedby outside a field", () => {
    render(composed());

    expect(textbox().getAttribute("aria-describedby")).toBeNull();
  });

  it("calls the onChange the caller passes", () => {
    const changed = vi.fn<(event: ChangeEvent<HTMLInputElement>) => void>();

    render(composed({}, { "aria-label": "Phone", onChange: changed }));
    inserted(textbox(), 0, "5");

    expect(changed).toHaveBeenCalledOnce();
  });

  it("submits the masked value under the name the root passes", () => {
    const { container } = render(<form>{composed({ defaultValue: FULL, name: "phone" })}</form>);
    const form = container.querySelector("form");

    expect(form === null ? undefined : new FormData(form).get("phone")).toBe("(555) 123-4567");
  });
});
