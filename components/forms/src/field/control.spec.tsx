import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { boundViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import { Control } from "#field/control.tsx";
import { composed, fielded } from "#field/field.fixtures.tsx";
import { recipe } from "#field/recipe.ts";
import { type RootProps } from "#field/root.tsx";

describe("Control", () => {
  it("renders an input inside the root", () => {
    const { container } = render(fielded(<Control />));

    expect(slotElement(container, "field", "control").tagName).toBe("INPUT");
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "control",
      }),
    ).toStrictEqual([]);
  });

  it("takes its accessible name from the label", () => {
    render(composed());

    expect(screen.getByRole("textbox", { name: /Email/u })).toBeDefined();
  });

  it("lists the helper text the error text and the counter in aria-describedby", () => {
    render(composed({ id: "email" }));

    expect(screen.getByRole("textbox").getAttribute("aria-describedby")).toBe(
      "email-helper email-error email-counter",
    );
  });

  it("sets aria-invalid while the field is invalid", () => {
    render(composed({ invalid: true }));

    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
  });

  it("takes the field's disabled state", () => {
    render(composed({ disabled: true }));

    expect(screen.getByRole("textbox").hasAttribute("disabled")).toBe(true);
  });

  it("takes the field's maxLength", () => {
    render(composed({ maxLength: 80 }));

    expect(screen.getByRole("textbox").getAttribute("maxlength")).toBe("80");
  });

  it("takes the field's size", () => {
    render(composed({ size: "sm" }));

    expect([...screen.getByRole("textbox").classList]).toContain(
      variantClass("input", "size", "sm"),
    );
  });

  it("keeps a size the control states over the field's", () => {
    render(fielded(<Control aria-label="Email" size="lg" />, { size: "sm" }));

    expect([...screen.getByRole("textbox").classList]).toContain(
      variantClass("input", "size", "lg"),
    );
  });

  it("keeps a prop the control states over the field's", () => {
    render(fielded(<Control aria-label="Its own name" />, { id: "email" }));

    expect(screen.getByRole("textbox", { name: "Its own name" })).toBeDefined();
  });

  it("calls the onChange the control states", () => {
    const changed = vi.fn<() => void>();

    render(fielded(<Control aria-label="Email" onChange={changed} />));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "a" } });

    expect(changed).toHaveBeenCalledOnce();
  });

  it("renders the element that as names", () => {
    const { container } = render(fielded(<Control as="textarea" />));

    expect(slotElement(container, "field", "control").tagName).toBe("TEXTAREA");
  });
});
