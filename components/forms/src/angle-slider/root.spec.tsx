import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import { composed, thumb } from "#angle-slider/angle-slider.fixtures.tsx";
import { recipe } from "#angle-slider/recipe.ts";
import { type RootProps } from "#angle-slider/root.tsx";
import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";

describe("Root", () => {
  it("returns no accessibility violation for a labelled dial", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers to the root", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(composed(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("renders a fieldset", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "angle-slider", "root").tagName).toBe("FIELDSET");
  });

  it("names the group after its label", async () => {
    await drawn(composed());

    expect(screen.getByRole("group", { name: "Rotation" })).toBeDefined();
  });

  it("disables the fieldset when the dial is disabled", async () => {
    await drawn(composed({ disabled: true }));

    expect(screen.getByRole<HTMLFieldSetElement>("group").disabled).toBe(true);
  });

  it("leaves the fieldset enabled by default", async () => {
    await drawn(composed());

    expect(screen.getByRole<HTMLFieldSetElement>("group").disabled).toBe(false);
  });

  it("writes the value as a custom property", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "angle-slider", "root").style.getPropertyValue("--value")).toBe(
      "45",
    );
  });

  it("renders the hidden input a form submits", async () => {
    const { container } = await drawn(composed({ name: "rotation" }));

    expect(container.querySelector<HTMLInputElement>('input[name="rotation"]')?.value).toBe("45");
  });

  it("takes the size of the field around it", async () => {
    const { container } = await drawn(
      <Field.Root size="lg">{composed({}, { labelled: false })}</Field.Root>,
    );

    expect([...slotElement(container, "angle-slider", "root").classList]).toContain(
      variantClass("angle-slider__root", "size", "lg"),
    );
  });

  it("keeps its own size over the field's", async () => {
    const { container } = await drawn(
      <Field.Root size="lg">{composed({ size: "sm" }, { labelled: false })}</Field.Root>,
    );

    expect([...slotElement(container, "angle-slider", "root").classList]).toContain(
      variantClass("angle-slider__root", "size", "sm"),
    );
  });

  it("takes the disabled state of the fieldset around it", async () => {
    await drawn(<Fieldset.Root disabled>{composed()}</Fieldset.Root>);

    expect(thumb().getAttribute("aria-disabled")).toBe("true");
  });

  it("takes the invalid state of the field around it", async () => {
    const { container } = await drawn(
      <Field.Root invalid>{composed({}, { labelled: false })}</Field.Root>,
    );

    expect(slotElement(container, "angle-slider", "root").dataset["invalid"]).toBe("");
  });

  it("takes the read-only state of the field around it", async () => {
    await drawn(
      <Field.Root readOnly>
        <Field.Label>Rotation</Field.Label>
        {composed({}, { labelled: false })}
      </Field.Root>,
    );

    expect(thumb().dataset["readonly"]).toBe("");
  });

  it("names the thumb after the label of the field around it", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Rotation</Field.Label>
        {composed({}, { labelled: false })}
      </Field.Root>,
    );

    expect(thumb().getAttribute("aria-labelledby")).toBe(screen.getByText("Rotation").id);
  });

  it("names the thumb after the legend of the fieldset around it", async () => {
    await drawn(
      <Fieldset.Root>
        <Fieldset.Legend>Rotation</Fieldset.Legend>
        {composed({}, { labelled: false })}
      </Fieldset.Root>,
    );

    expect(screen.getByRole("slider", { name: "Rotation" })).toBeDefined();
  });
});
