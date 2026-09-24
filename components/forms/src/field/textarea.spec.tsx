import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import * as Field from "#field/index.ts";

describe("Textarea", () => {
  it("places the field's control class on the textarea's box", () => {
    const { container } = render(
      <Field.Root>
        <Field.Textarea aria-label="Notes" />
      </Field.Root>,
    );

    expect(slotElement(container, "field", "control")).toBe(
      slotElement(container, "textarea", "root"),
    );
  });

  it("takes the field's identifier and aria-describedby", () => {
    render(
      <Field.Root id="notes">
        <Field.Textarea aria-label="Notes" />
      </Field.Root>,
    );

    const control = screen.getByRole("textbox");

    expect(control.getAttribute("id")).toBe("notes");
    expect(control.getAttribute("aria-describedby")).toBe("notes-helper notes-error notes-counter");
  });

  it("takes the field's maxLength and invalid state", () => {
    render(
      <Field.Root invalid maxLength={200}>
        <Field.Textarea aria-label="Notes" />
      </Field.Root>,
    );

    const control = screen.getByRole("textbox");

    expect(control.getAttribute("maxlength")).toBe("200");
    expect(control.getAttribute("aria-invalid")).toBe("true");
  });

  it("passes the props of Textarea through", () => {
    const { container } = render(
      <Field.Root>
        <Field.Textarea aria-label="Notes" defaultValue="a line" grows />
      </Field.Root>,
    );

    expect(slotElement(container, "textarea", "root").dataset["value"]).toBe("a line");
  });

  it("calls the onChange the caller passes", () => {
    const changed = vi.fn<() => void>();

    render(
      <Field.Root>
        <Field.Textarea aria-label="Notes" onChange={changed} />
      </Field.Root>,
    );
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "a" } });

    expect(changed).toHaveBeenCalledTimes(1);
  });
});
