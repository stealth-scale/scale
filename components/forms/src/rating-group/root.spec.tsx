import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";
import { composed, focused, keyed, star } from "#rating-group/rating-group.fixtures.tsx";
import { recipe } from "#rating-group/recipe.ts";
import { type RootProps } from "#rating-group/root.tsx";

/**
 * Returns the input a form submits.
 */
function submitted(container: ParentNode): HTMLInputElement | null {
  return container.querySelector<HTMLInputElement>("input");
}

describe("Root", () => {
  it("returns no accessibility violation for a labelled rating", async () => {
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

  it("renders the radio group named after its label", async () => {
    await drawn(composed());

    expect(screen.getByRole("radiogroup", { name: "Your stay" }).tagName).toBe("DIV");
  });

  it("marks a disabled group as disabled", async () => {
    await drawn(composed({ disabled: true }));

    expect(screen.getByRole("radiogroup").getAttribute("aria-disabled")).toBe("true");
  });

  it("marks an invalid group as invalid", async () => {
    await drawn(composed({ invalid: true }));

    expect(screen.getByRole("radiogroup").getAttribute("aria-invalid")).toBe("true");
  });

  it("marks a required group as required", async () => {
    await drawn(composed({ required: true }));

    expect(screen.getByRole("radiogroup").getAttribute("aria-required")).toBe("true");
  });

  it("leaves the hidden input empty while nothing is rated", async () => {
    const { container } = await drawn(composed());

    expect(submitted(container)?.value).toBe("");
  });

  it("puts the value in the hidden input", async () => {
    const { container } = await drawn(composed({ defaultValue: 4 }));

    expect(submitted(container)?.value).toBe("4");
  });

  it("empties the hidden input when the rating falls to zero", async () => {
    const { container } = await drawn(composed({ defaultValue: 1 }));

    await focused(star("1 star"));
    await keyed(star("1 star"), "ArrowLeft");

    expect(submitted(container)?.value).toBe("");
  });

  it("names the hidden input only when the root states a name", async () => {
    const { container } = await drawn(composed());

    expect(submitted(container)?.hasAttribute("name")).toBe(false);
  });

  it("names the hidden input after the name the root states", async () => {
    const { container } = await drawn(composed({ name: "stay" }));

    expect(submitted(container)?.name).toBe("stay");
  });

  it("takes the size of the field around it", async () => {
    const { container } = await drawn(
      <Field.Root size="lg">{composed({}, { labelled: false })}</Field.Root>,
    );

    expect([...slotElement(container, "rating-group", "root").classList]).toContain(
      variantClass("rating-group__root", "size", "lg"),
    );
  });

  it("takes the invalid state of the field around it", async () => {
    await drawn(<Field.Root invalid>{composed({}, { labelled: false })}</Field.Root>);

    expect(screen.getByRole("radiogroup").getAttribute("aria-invalid")).toBe("true");
  });

  it("names the group after the label of the field around it", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Your stay</Field.Label>
        {composed({}, { labelled: false })}
      </Field.Root>,
    );

    expect(screen.getByRole("radiogroup").getAttribute("aria-labelledby")).toBe(
      screen.getByText("Your stay").id,
    );
  });

  it("lists the field's texts in aria-describedby", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Your stay</Field.Label>
        {composed({}, { labelled: false })}
        <Field.HelperText>Only guests can rate.</Field.HelperText>
      </Field.Root>,
    );

    expect(screen.getByRole("radiogroup").getAttribute("aria-describedby")).toContain(
      screen.getByText("Only guests can rate.").id,
    );
  });

  it("takes the disabled state of the fieldset around it", async () => {
    await drawn(<Fieldset.Root disabled>{composed()}</Fieldset.Root>);

    expect(screen.getByRole("radiogroup").getAttribute("aria-disabled")).toBe("true");
  });

  it("names the group after the legend of the fieldset around it", async () => {
    await drawn(
      <Fieldset.Root>
        <Fieldset.Legend>Your stay</Fieldset.Legend>
        {composed({}, { labelled: false })}
      </Fieldset.Root>,
    );

    expect(screen.getByRole("radiogroup", { name: "Your stay" })).toBeDefined();
  });
});
