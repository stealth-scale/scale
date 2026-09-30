import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn, pressed, settled } from "@stealthscale/testing-react";
import {
  boundMachineViolations,
  recipeClasses,
  slotElement,
  variantClass,
} from "@stealthscale/testing-theme";

import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";
import { type ValueChangeDetails } from "#number-input/machine.ts";
import { composed, focused, framed } from "#number-input/number-input.fixtures.tsx";
import { recipe } from "#number-input/recipe.ts";
import { type RootProps } from "#number-input/root.tsx";

describe("Root", () => {
  it("returns no accessibility violation for a named input", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers to the triggers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(composed(props))).container,
      ),
    ).resolves.toStrictEqual([]);
  });

  it("renders the input group's box in the group role", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "input-group", "root").getAttribute("role")).toBe("group");
  });

  it("passes size to the input group", async () => {
    const { container } = await drawn(composed({ size: "lg" }));

    expect([...slotElement(container, "input-group", "root").classList]).toContain(
      variantClass("input-group__root", "size", "lg"),
    );
  });

  it("passes variant to the input group", async () => {
    const { container } = await drawn(composed({ variant: "subtle" }));

    expect([...slotElement(container, "input-group", "root").classList]).toContain(
      variantClass("input-group__root", "variant", "subtle"),
    );
  });

  it("gives the triggers the size of the field around it", async () => {
    const { container } = await drawn(<Field.Root size="lg">{composed()}</Field.Root>);

    expect(recipeClasses(container, "number-input")).toContain(
      variantClass("number-input", "size", "lg"),
    );
  });

  it("gives the box the size of the field around it", async () => {
    const { container } = await drawn(<Field.Root size="sm">{composed()}</Field.Root>);

    expect([...slotElement(container, "input-group", "root").classList]).toContain(
      variantClass("input-group__root", "size", "sm"),
    );
  });

  it("keeps its own size over the field's", async () => {
    const { container } = await drawn(
      <Field.Root size="lg">{composed({ size: "xs" })}</Field.Root>,
    );

    expect(recipeClasses(container, "number-input")).toContain(
      variantClass("number-input", "size", "xs"),
    );
  });

  it("takes the disabled state of the fieldset around it", async () => {
    await drawn(<Fieldset.Root disabled>{composed()}</Fieldset.Root>);

    expect(screen.getByRole<HTMLInputElement>("spinbutton").disabled).toBe(true);
  });

  it("takes the disabled state of the field around it", async () => {
    await drawn(<Field.Root disabled>{composed()}</Field.Root>);

    expect(screen.getByRole<HTMLInputElement>("spinbutton").disabled).toBe(true);
  });

  it("takes the read-only state of the field around it", async () => {
    await drawn(<Field.Root readOnly>{composed()}</Field.Root>);

    expect(screen.getByRole<HTMLInputElement>("spinbutton").readOnly).toBe(true);
  });

  it("takes the required state of the field around it", async () => {
    await drawn(<Field.Root required>{composed()}</Field.Root>);

    expect(screen.getByRole<HTMLInputElement>("spinbutton").required).toBe(true);
  });

  it("marks a value in range invalid inside an invalid field", async () => {
    await drawn(<Field.Root invalid>{composed()}</Field.Root>);

    expect(screen.getByRole("spinbutton").getAttribute("aria-invalid")).toBe("true");
  });

  it("marks a value out of range invalid inside a valid field", async () => {
    await drawn(<Field.Root>{composed({ defaultValue: "60" })}</Field.Root>);

    expect(screen.getByRole("spinbutton").getAttribute("aria-invalid")).toBe("true");
  });

  it("marks a value out of range invalid outside a field", async () => {
    await drawn(composed({ defaultValue: "60" }));

    expect(screen.getByRole("spinbutton").getAttribute("aria-invalid")).toBe("true");
  });

  it("leaves a value in range valid outside a field", async () => {
    await drawn(composed());

    expect(screen.getByRole("spinbutton").getAttribute("aria-invalid")).toBeNull();
  });

  it("keeps the invalid state the caller passes over the field's", async () => {
    await drawn(<Field.Root invalid>{composed({ invalid: false })}</Field.Root>);

    expect(screen.getByRole("spinbutton").getAttribute("aria-invalid")).toBeNull();
  });

  it("marks the box invalid with the input", async () => {
    const { container } = await drawn(composed({ defaultValue: "60" }));

    expect(slotElement(container, "input-group", "root").getAttribute("aria-invalid")).toBe("true");
  });

  it("leaves an empty input valid when min is above zero", async () => {
    await drawn(composed({ defaultValue: "" }));

    expect(screen.getByRole("spinbutton").getAttribute("aria-invalid")).toBeNull();
  });

  it("leaves an input valid when a person empties it", async () => {
    await drawn(composed());

    const input = screen.getByRole("spinbutton");

    await focused(input);
    fireEvent.input(input, { target: { value: "" } });
    await settled();

    expect(input.getAttribute("aria-invalid")).toBeNull();
  });

  it("leaves an empty controlled input valid", async () => {
    await drawn(composed({ value: "" }));

    expect(screen.getByRole("spinbutton").getAttribute("aria-invalid")).toBeNull();
  });

  it("marks an input out of range invalid again after a person empties it", async () => {
    await drawn(composed());

    const input = screen.getByRole("spinbutton");

    await focused(input);
    fireEvent.input(input, { target: { value: "" } });
    await settled();
    fireEvent.input(input, { target: { value: "60" } });
    await settled();

    expect(input.getAttribute("aria-invalid")).toBe("true");
  });

  it("marks an empty input invalid inside an invalid field", async () => {
    await drawn(<Field.Root invalid>{composed({ defaultValue: "" })}</Field.Root>);

    expect(screen.getByRole("spinbutton").getAttribute("aria-invalid")).toBe("true");
  });

  it("marks an empty input invalid when the caller passes invalid", async () => {
    await drawn(composed({ defaultValue: "", invalid: true }));

    expect(screen.getByRole("spinbutton").getAttribute("aria-invalid")).toBe("true");
  });

  it("calls onValueChange with the stepped value when a trigger is pressed", async () => {
    const heard = vi.fn<(details: ValueChangeDetails) => void>();

    await drawn(composed({ onValueChange: heard }));
    await pressed(screen.getByRole("button", { name: "Increase value" }));
    await framed();

    expect(heard).toHaveBeenLastCalledWith({ value: "5", valueAsNumber: 5 });
  });
});
