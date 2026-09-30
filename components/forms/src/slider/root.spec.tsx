import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";
import { recipe } from "#slider/recipe.ts";
import { type RootProps } from "#slider/root.tsx";
import { composed, thumb } from "#slider/slider.fixtures.tsx";

describe("Root", () => {
  it("returns no accessibility violation for a labelled slider", async () => {
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

    expect(slotElement(container, "slider", "root").tagName).toBe("FIELDSET");
  });

  it("names the group after its label", async () => {
    await drawn(composed());

    expect(screen.getByRole("group", { name: "Volume" })).toBeDefined();
  });

  it("disables the fieldset when the slider is disabled", async () => {
    await drawn(composed({ disabled: true }));

    expect(screen.getByRole<HTMLFieldSetElement>("group").disabled).toBe(true);
  });

  it("leaves the fieldset enabled by default", async () => {
    await drawn(composed());

    expect(screen.getByRole<HTMLFieldSetElement>("group").disabled).toBe(false);
  });

  it("writes each thumb's place as a custom property", async () => {
    const { container } = await drawn(composed());

    expect(
      slotElement(container, "slider", "root").style.getPropertyValue("--slider-thumb-offset-0"),
    ).toBe("40%");
  });

  it("takes the size of the field around it", async () => {
    const { container } = await drawn(
      <Field.Root size="lg">{composed({}, { labelled: false })}</Field.Root>,
    );

    expect([...slotElement(container, "slider", "root").classList]).toContain(
      variantClass("slider__root", "size", "lg"),
    );
  });

  it("keeps its own size over the field's", async () => {
    const { container } = await drawn(
      <Field.Root size="lg">{composed({ size: "sm" }, { labelled: false })}</Field.Root>,
    );

    expect([...slotElement(container, "slider", "root").classList]).toContain(
      variantClass("slider__root", "size", "sm"),
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

    expect(slotElement(container, "slider", "root").dataset["invalid"]).toBe("");
  });

  it("takes the read-only state of the field around it", async () => {
    await drawn(
      <Field.Root readOnly>
        <Field.Label>Volume</Field.Label>
        {composed({}, { labelled: false })}
      </Field.Root>,
    );

    expect(thumb().dataset["readonly"]).toBe("true");
  });

  it("names the thumbs after the label of the field around it", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Volume</Field.Label>
        {composed({}, { labelled: false })}
      </Field.Root>,
    );

    expect(thumb().getAttribute("aria-labelledby")).toBe(screen.getByText("Volume").id);
  });

  it("names the thumbs after the legend of the fieldset around it", async () => {
    await drawn(
      <Fieldset.Root>
        <Fieldset.Legend>Volume</Fieldset.Legend>
        {composed({}, { labelled: false })}
      </Fieldset.Root>,
    );

    expect(screen.getByRole("slider", { name: "Volume" })).toBeDefined();
  });
});
