import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn, settled } from "@stealthscale/testing-react";
import {
  boundMachineViolations,
  recipeClasses,
  slotElement,
  variantClass,
} from "@stealthscale/testing-theme";

import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";
import { type VisibilityChangeDetails } from "#password-input/machine.ts";
import { composed } from "#password-input/password-input.fixtures.tsx";
import { recipe } from "#password-input/recipe.ts";
import { type RootProps } from "#password-input/root.tsx";

describe("Root", () => {
  it("returns no accessibility violation for a named field", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers to the toggle", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(composed(props))).container,
      ),
    ).resolves.toStrictEqual([]);
  });

  it("renders the input group's box", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "input-group", "root").tagName).toBe("DIV");
  });

  it("passes variant to the input group", async () => {
    const { container } = await drawn(composed({ variant: "subtle" }));

    expect([...slotElement(container, "input-group", "root").classList]).toContain(
      variantClass("input-group__root", "variant", "subtle"),
    );
  });

  it("gives the toggle the size of the field around it", async () => {
    const { container } = await drawn(<Field.Root size="lg">{composed()}</Field.Root>);

    expect(recipeClasses(container, "password-input")).toContain(
      variantClass("password-input", "size", "lg"),
    );
  });

  it("keeps its own size over the field's", async () => {
    const { container } = await drawn(
      <Field.Root size="lg">{composed({ size: "xs" })}</Field.Root>,
    );

    expect([...slotElement(container, "input-group", "root").classList]).toContain(
      variantClass("input-group__root", "size", "xs"),
    );
  });

  it("takes the disabled state of the fieldset around it", async () => {
    await drawn(<Fieldset.Root disabled>{composed()}</Fieldset.Root>);

    expect(screen.getByLabelText<HTMLInputElement>("Password").disabled).toBe(true);
  });

  it("takes the read-only state of the field around it", async () => {
    await drawn(<Field.Root readOnly>{composed()}</Field.Root>);

    expect(screen.getByLabelText<HTMLInputElement>("Password").readOnly).toBe(true);
  });

  it("takes the invalid state of the field around it", async () => {
    await drawn(<Field.Root invalid>{composed()}</Field.Root>);

    expect(screen.getByLabelText("Password").getAttribute("aria-invalid")).toBe("true");
  });

  it("takes the required state of the field around it", async () => {
    await drawn(<Field.Root required>{composed()}</Field.Root>);

    expect(screen.getByLabelText<HTMLInputElement>("Password").required).toBe(true);
  });

  it("calls onVisibilityChange when the value is shown", async () => {
    const heard = vi.fn<(details: VisibilityChangeDetails) => void>();

    await drawn(composed({ onVisibilityChange: heard }));
    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    await settled();

    expect(heard).toHaveBeenCalledWith({ visible: true });
  });
});
