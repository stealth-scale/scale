import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { slotElement, variantClass } from "@stealthscale/testing-theme";

import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";
import { composed, inserted } from "#input-mask/input-mask.fixtures.tsx";
import { type ValueChangeDetails } from "#input-mask/mask.ts";

const FULL = "5551234567";

function textbox(): HTMLInputElement {
  return screen.getByRole<HTMLInputElement>("textbox");
}

describe("Root", () => {
  it("returns no accessibility violation for a named input", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("renders the input group's box around the input", () => {
    const { container } = render(composed());

    expect(slotElement(container, "input-group", "root").contains(textbox())).toBe(true);
  });

  it("passes size to the input group", () => {
    const { container } = render(composed({ size: "lg" }));

    expect([...slotElement(container, "input-group", "root").classList]).toContain(
      variantClass("input-group__root", "size", "lg"),
    );
  });

  it("passes variant to the input group", () => {
    const { container } = render(composed({ variant: "subtle" }));

    expect([...slotElement(container, "input-group", "root").classList]).toContain(
      variantClass("input-group__root", "variant", "subtle"),
    );
  });

  it("gives the box the size of the field around it", () => {
    const { container } = render(<Field.Root size="sm">{composed()}</Field.Root>);

    expect([...slotElement(container, "input-group", "root").classList]).toContain(
      variantClass("input-group__root", "size", "sm"),
    );
  });

  it("gives the box the size of the fieldset around it", () => {
    const { container } = render(<Fieldset.Root size="lg">{composed()}</Fieldset.Root>);

    expect([...slotElement(container, "input-group", "root").classList]).toContain(
      variantClass("input-group__root", "size", "lg"),
    );
  });

  it("keeps its own size over the field's", () => {
    const { container } = render(<Field.Root size="lg">{composed({ size: "sm" })}</Field.Root>);

    expect([...slotElement(container, "input-group", "root").classList]).toContain(
      variantClass("input-group__root", "size", "sm"),
    );
  });

  it("masks the default value", () => {
    render(composed({ defaultValue: FULL }));

    expect(textbox().value).toBe("(555) 123-4567");
  });

  it("masks the controlled value", () => {
    render(composed({ value: FULL }));

    expect(textbox().value).toBe("(555) 123-4567");
  });

  it("shows the value in the form of the current mask", () => {
    const { rerender } = render(composed({ defaultValue: FULL }));

    rerender(composed({ defaultValue: FULL, mask: "999-999-9999" }));

    expect(textbox().value).toBe("555-123-4567");
  });

  it("calls onValueChange with the details of a change", () => {
    const heard = vi.fn<(details: ValueChangeDetails) => void>();

    render(composed({ onValueChange: heard }));
    inserted(textbox(), 0, "555");

    expect(heard).toHaveBeenLastCalledWith({ complete: false, unmasked: "555", value: "(555" });
  });

  it("calls onValueComplete when a change fills the pattern", () => {
    const completed = vi.fn<(details: ValueChangeDetails) => void>();

    render(composed({ defaultValue: "555123456", onValueComplete: completed }));
    inserted(textbox(), 13, "7");

    expect(completed).toHaveBeenCalledWith({
      complete: true,
      unmasked: FULL,
      value: "(555) 123-4567",
    });
  });

  it("skips onValueComplete when the value was complete before the change", () => {
    const completed = vi.fn<(details: ValueChangeDetails) => void>();

    render(composed({ defaultValue: FULL, onValueComplete: completed }));
    inserted(textbox(), 1, "9");

    expect(completed).not.toHaveBeenCalled();
  });

  it("calls no callback for a refused character", () => {
    const heard = vi.fn<(details: ValueChangeDetails) => void>();

    render(composed({ defaultValue: FULL, onValueChange: heard }));
    inserted(textbox(), 1, "x");

    expect(heard).not.toHaveBeenCalled();
  });

  it("keeps the value a controlled caller does not change", () => {
    render(composed({ value: FULL }));
    inserted(textbox(), 1, "9");

    expect(textbox().value).toBe("(555) 123-4567");
  });

  it("takes the disabled state of the field around it", () => {
    render(<Field.Root disabled>{composed()}</Field.Root>);

    expect(textbox().disabled).toBe(true);
  });

  it("takes the read-only state of the field around it", () => {
    render(<Field.Root readOnly>{composed()}</Field.Root>);

    expect(textbox().readOnly).toBe(true);
  });

  it("takes the required state of the field around it", () => {
    render(<Field.Root required>{composed()}</Field.Root>);

    expect(textbox().required).toBe(true);
  });

  it("marks the input invalid inside an invalid field", () => {
    render(<Field.Root invalid>{composed()}</Field.Root>);

    expect(textbox().getAttribute("aria-invalid")).toBe("true");
  });

  it("takes the disabled state of the fieldset around it", () => {
    render(<Fieldset.Root disabled>{composed()}</Fieldset.Root>);

    expect(textbox().disabled).toBe(true);
  });

  it("keeps the invalid state the caller passes over the field's", () => {
    render(<Field.Root invalid>{composed({ invalid: false })}</Field.Root>);

    expect(textbox().getAttribute("aria-invalid")).toBeNull();
  });

  it("marks the input invalid when the caller passes invalid", () => {
    render(composed({ invalid: true }));

    expect(textbox().getAttribute("aria-invalid")).toBe("true");
  });

  it("passes name to the input", () => {
    render(composed({ name: "phone" }));

    expect(textbox().name).toBe("phone");
  });
});
