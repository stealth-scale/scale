import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import * as Field from "#field/index.ts";
import { Root as FieldsetRoot } from "#fieldset/root.tsx";
import { recipe } from "#switch/recipe.ts";
import { type RootProps } from "#switch/root.tsx";
import { composed, pressed } from "#switch/switch.fixtures.tsx";

describe("Root", () => {
  it("returns no accessibility violation for a track and its label", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("renders a label around the row", () => {
    const { container } = render(composed());

    expect(slotElement(container, "switch", "root").tagName).toBe("LABEL");
  });

  it("renders the input with the switch role", () => {
    render(composed());

    expect(screen.getByRole("switch")).toBeTruthy();
  });

  it("renders no input with the checkbox role", () => {
    render(composed());

    expect(screen.queryByRole("checkbox")).toBeNull();
  });

  it("names the switch from its label", () => {
    render(composed());

    expect(screen.getByRole("switch", { name: "Dark mode" })).toBeTruthy();
  });

  it("points the label's for attribute at the input", () => {
    const { container } = render(composed());

    expect(slotElement(container, "switch", "root").getAttribute("for")).toBe(
      screen.getByRole("switch").id,
    );
  });

  it("renders the input a form submits", () => {
    render(composed({ name: "theme", value: "dark" }));

    expect(screen.getByRole("switch").getAttribute("name")).toBe("theme");
  });

  it("checks the switch on a press", async () => {
    render(composed());
    await pressed(screen.getByRole("switch"));

    expect(screen.getByRole<HTMLInputElement>("switch").checked).toBe(true);
  });

  it("sets aria-checked to the checked state", async () => {
    render(composed());
    await pressed(screen.getByRole("switch"));

    expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe("true");
  });

  it("calls onCheckedChange with the new state", async () => {
    const heard = vi.fn<(details: { checked: boolean }) => void>();

    render(composed({ onCheckedChange: heard }));
    await pressed(screen.getByRole("switch"));

    expect(heard).toHaveBeenCalledWith({ checked: true });
  });

  it("disables the input when the caller disables the switch", () => {
    render(composed({ disabled: true }));

    expect(screen.getByRole<HTMLInputElement>("switch").disabled).toBe(true);
  });

  it("takes the disabled state of the field around it", () => {
    render(<Field.Root disabled>{composed()}</Field.Root>);

    expect(screen.getByRole<HTMLInputElement>("switch").disabled).toBe(true);
  });

  it("takes the required state of the field around it", () => {
    render(<Field.Root required>{composed()}</Field.Root>);

    expect(screen.getByRole<HTMLInputElement>("switch").required).toBe(true);
  });

  it("lists the field's helper and error texts in aria-describedby", () => {
    render(
      <Field.Root id="theme" invalid>
        {composed()}
        <Field.HelperText>It follows your system by default.</Field.HelperText>
        <Field.ErrorText>That theme is not available.</Field.ErrorText>
      </Field.Root>,
    );

    expect(screen.getByRole("switch").getAttribute("aria-describedby")?.split(" ")).toStrictEqual([
      "theme-helper",
      screen.getByText("That theme is not available.").id,
    ]);
  });

  it("sets no aria-describedby outside a field", () => {
    render(composed());

    expect(screen.getByRole("switch").getAttribute("aria-describedby")).toBeNull();
  });

  it("keeps its own disabled state over the field's", () => {
    render(<Field.Root disabled>{composed({ disabled: false })}</Field.Root>);

    expect(screen.getByRole<HTMLInputElement>("switch").disabled).toBe(false);
  });

  it("takes the size of the field around it", () => {
    const { container } = render(<Field.Root size="lg">{composed()}</Field.Root>);

    expect([...slotElement(container, "switch", "control").classList]).toContain(
      variantClass("switch__control", "size", "lg"),
    );
  });

  it("takes the size and disabled state of a fieldset around it", async () => {
    const { container } = await drawn(
      <FieldsetRoot disabled size="sm">
        {composed()}
      </FieldsetRoot>,
    );

    const control = slotElement(container, "switch", "control");

    expect([...control.classList]).toContain(variantClass("switch__control", "size", "sm"));
    expect(control.dataset["disabled"]).toBe("");
  });

  it("keeps its own size over the field's", () => {
    const { container } = render(<Field.Root size="lg">{composed({ size: "sm" })}</Field.Root>);

    expect([...slotElement(container, "switch", "control").classList]).toContain(
      variantClass("switch__control", "size", "sm"),
    );
  });
});
