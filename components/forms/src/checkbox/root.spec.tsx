import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import { composed, pressed } from "#checkbox/checkbox.fixtures.tsx";
import { recipe } from "#checkbox/recipe.ts";
import { type RootProps } from "#checkbox/root.tsx";
import * as Field from "#field/index.ts";
import { Root as FieldsetRoot } from "#fieldset/root.tsx";

describe("Root", () => {
  it("returns no accessibility violation for a box and its label", async () => {
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

    expect(slotElement(container, "checkbox", "root").tagName).toBe("LABEL");
  });

  it("renders the input a form submits", () => {
    render(composed({ name: "terms", value: "yes" }));

    expect(screen.getByRole("checkbox").getAttribute("name")).toBe("terms");
  });

  it("names the checkbox from its label", () => {
    render(composed());

    expect(screen.getByRole("checkbox", { name: "Accept the terms" })).toBeTruthy();
  });

  it("points the label's for attribute at the input", () => {
    const { container } = render(composed());

    expect(slotElement(container, "checkbox", "root").getAttribute("for")).toBe(
      screen.getByRole("checkbox").id,
    );
  });

  it("checks the box on a press", async () => {
    render(composed());
    await pressed(screen.getByRole("checkbox"));

    expect(screen.getByRole<HTMLInputElement>("checkbox").checked).toBe(true);
  });

  it("restores the input when the owner of a controlled box refuses a press", async () => {
    render(composed({ checked: false }));
    await pressed(screen.getByRole("checkbox"));

    expect(screen.getByRole<HTMLInputElement>("checkbox").checked).toBe(false);
  });

  it("calls onCheckedChange with the new state", async () => {
    const heard = vi.fn<(details: { checked: "indeterminate" | boolean }) => void>();

    render(composed({ onCheckedChange: heard }));
    await pressed(screen.getByRole("checkbox"));

    expect(heard).toHaveBeenCalledWith({ checked: true });
  });

  it("calls the caller's onClick on a press of the row", async () => {
    const heard = vi.fn<() => void>();
    const { container } = render(composed({ onClick: heard }));

    await pressed(slotElement(container, "checkbox", "control"));

    expect(heard).toHaveBeenCalled();
  });

  it("returns no accessibility violation while partly on", async () => {
    await expect(
      accessibilityViolations(() => composed({ checked: "indeterminate" })),
    ).resolves.toStrictEqual([]);
  });

  it("sets the input's indeterminate property on the first render", () => {
    render(composed({ checked: "indeterminate" }));

    expect(screen.getByRole<HTMLInputElement>("checkbox").indeterminate).toBe(true);
  });

  it("clears the input's indeterminate property on a checked box", () => {
    render(composed({ defaultChecked: true }));

    expect(screen.getByRole<HTMLInputElement>("checkbox").indeterminate).toBe(false);
  });

  it("disables the input when the caller disables the box", () => {
    render(composed({ disabled: true }));

    expect(screen.getByRole<HTMLInputElement>("checkbox").disabled).toBe(true);
  });

  it("takes the disabled state of the field around it", () => {
    render(<Field.Root disabled>{composed()}</Field.Root>);

    expect(screen.getByRole<HTMLInputElement>("checkbox").disabled).toBe(true);
  });

  it("takes the required state of the field around it", () => {
    render(<Field.Root required>{composed()}</Field.Root>);

    expect(screen.getByRole<HTMLInputElement>("checkbox").required).toBe(true);
  });

  it("lists the field's helper and error texts in aria-describedby", () => {
    render(
      <Field.Root id="terms" invalid>
        {composed()}
        <Field.HelperText>Read them first.</Field.HelperText>
        <Field.ErrorText>Accept them to go on.</Field.ErrorText>
      </Field.Root>,
    );

    expect(screen.getByRole("checkbox").getAttribute("aria-describedby")?.split(" ")).toStrictEqual(
      ["terms-helper", screen.getByText("Accept them to go on.").id],
    );
  });

  it("sets no aria-describedby outside a field", () => {
    render(composed());

    expect(screen.getByRole("checkbox").getAttribute("aria-describedby")).toBeNull();
  });

  it("keeps its own disabled state over the field's", () => {
    render(<Field.Root disabled>{composed({ disabled: false })}</Field.Root>);

    expect(screen.getByRole<HTMLInputElement>("checkbox").disabled).toBe(false);
  });

  it("takes the size of the field around it", () => {
    const { container } = render(<Field.Root size="lg">{composed()}</Field.Root>);

    expect([...slotElement(container, "checkbox", "control").classList]).toContain(
      variantClass("checkbox__control", "size", "lg"),
    );
  });

  it("takes the size and disabled state of a fieldset around it", async () => {
    const { container } = await drawn(
      <FieldsetRoot disabled size="sm">
        {composed()}
      </FieldsetRoot>,
    );

    const control = slotElement(container, "checkbox", "control");

    expect([...control.classList]).toContain(variantClass("checkbox__control", "size", "sm"));
    expect(control.dataset["disabled"]).toBe("");
  });

  it("keeps its own size over the field's", () => {
    const { container } = render(<Field.Root size="lg">{composed({ size: "sm" })}</Field.Root>);

    expect([...slotElement(container, "checkbox", "control").classList]).toContain(
      variantClass("checkbox__control", "size", "sm"),
    );
  });
});
