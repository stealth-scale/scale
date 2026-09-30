import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";
import { composed, pressed } from "#radio-group/radio-group.fixtures.tsx";
import { recipe } from "#radio-group/recipe.ts";
import { type RootProps } from "#radio-group/root.tsx";

describe("Root", () => {
  it("returns no accessibility violation for a labelled group", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation for a group without a label", async () => {
    await expect(
      accessibilityViolations(() =>
        composed({ "aria-label": "Payout window" }, { labelled: false }),
      ),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(composed(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("renders a div in the radiogroup role", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "radio-group", "root").getAttribute("role")).toBe("radiogroup");
  });

  it("names the group from its label", async () => {
    await drawn(composed());

    expect(screen.getByRole("radiogroup", { name: "Payout window" })).toBeDefined();
  });

  it("sets no aria-labelledby without a label", async () => {
    await drawn(composed({}, { labelled: false }));

    expect(screen.getByRole("radiogroup").getAttribute("aria-labelledby")).toBeNull();
  });

  it("takes its name from an aria-label the caller passes", async () => {
    await drawn(composed({ "aria-label": "Settlement" }, { labelled: false }));

    expect(screen.getByRole("radiogroup", { name: "Settlement" })).toBeDefined();
  });

  it("takes its name from the label of the field around it", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Settlement</Field.Label>
        {composed({}, { labelled: false })}
      </Field.Root>,
    );

    expect(screen.getByRole("radiogroup", { name: "Settlement" })).toBeDefined();
  });

  it("takes its name from the legend of the fieldset around it", async () => {
    await drawn(
      <Fieldset.Root>
        <Fieldset.Legend>Settlement</Fieldset.Legend>
        {composed({}, { labelled: false })}
      </Fieldset.Root>,
    );

    expect(screen.getByRole("radiogroup", { name: "Settlement" })).toBeDefined();
  });

  it("takes its name from its own label over the field's", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Settlement</Field.Label>
        {composed()}
      </Field.Root>,
    );

    expect(screen.getByRole("radiogroup", { name: "Payout window" })).toBeDefined();
  });

  it("lists the field's helper and error texts in aria-describedby", async () => {
    await drawn(
      <Field.Root id="window" invalid>
        {composed()}
        <Field.HelperText>Payouts leave at five.</Field.HelperText>
        <Field.ErrorText>Choose a window.</Field.ErrorText>
      </Field.Root>,
    );

    expect(
      screen.getByRole("radiogroup").getAttribute("aria-describedby")?.split(" "),
    ).toStrictEqual(["window-helper", screen.getByText("Choose a window.").id]);
  });

  it("sets no aria-describedby outside a field", async () => {
    await drawn(composed());

    expect(screen.getByRole("radiogroup").getAttribute("aria-describedby")).toBeNull();
  });

  it("gives every input the name the caller passes", async () => {
    await drawn(composed({ name: "window" }));

    expect(screen.getAllByRole<HTMLInputElement>("radio").map((radio) => radio.name)).toStrictEqual(
      ["window", "window", "window"],
    );
  });

  it("checks the option a person presses", async () => {
    await drawn(composed());
    await pressed(screen.getByRole("radio", { name: "Next day" }));

    expect(screen.getByRole<HTMLInputElement>("radio", { name: "Next day" }).checked).toBe(true);
  });

  it("calls onValueChange with the value of the option a person presses", async () => {
    const heard = vi.fn<(details: { value: null | string }) => void>();

    await drawn(composed({ onValueChange: heard }));
    await pressed(screen.getByRole("radio", { name: "Weekly" }));

    expect(heard).toHaveBeenCalledWith({ value: "Weekly" });
  });

  it("checks the option named by defaultValue", async () => {
    await drawn(composed({ defaultValue: "Weekly" }));

    expect(screen.getByRole<HTMLInputElement>("radio", { name: "Weekly" }).checked).toBe(true);
  });

  it("sets aria-orientation from orientation", async () => {
    await drawn(composed({ orientation: "horizontal" }));

    expect(screen.getByRole("radiogroup").getAttribute("aria-orientation")).toBe("horizontal");
  });

  it("takes the disabled state of the field around it", async () => {
    await drawn(<Field.Root disabled>{composed()}</Field.Root>);

    expect(screen.getAllByRole<HTMLInputElement>("radio").every((radio) => radio.disabled)).toBe(
      true,
    );
  });

  it("takes the required state of the field around it", async () => {
    await drawn(<Field.Root required>{composed()}</Field.Root>);

    expect(screen.getAllByRole<HTMLInputElement>("radio").every((radio) => radio.required)).toBe(
      true,
    );
  });

  it("takes the invalid state of the fieldset around it", async () => {
    await drawn(<Fieldset.Root invalid>{composed()}</Fieldset.Root>);

    expect(screen.getByRole("radio", { name: "Weekly" }).getAttribute("aria-invalid")).toBe("true");
  });

  it("keeps its own invalid state over the fieldset's", async () => {
    await drawn(<Fieldset.Root invalid>{composed({ invalid: false })}</Fieldset.Root>);

    expect(screen.getByRole("radio", { name: "Weekly" }).getAttribute("aria-invalid")).toBeNull();
  });

  it("takes the size and disabled state of a fieldset around it", async () => {
    const { container } = await drawn(
      <Fieldset.Root disabled size="sm">
        {composed()}
      </Fieldset.Root>,
    );

    const root = slotElement(container, "radio-group", "root");

    expect([...root.classList]).toContain(variantClass("radio-group__root", "size", "sm"));
    expect(root.dataset["disabled"]).toBe("");
  });

  it("takes the size of the field around it", async () => {
    const { container } = await drawn(<Field.Root size="lg">{composed()}</Field.Root>);

    expect([...slotElement(container, "radio-group", "root").classList]).toContain(
      variantClass("radio-group__root", "size", "lg"),
    );
  });

  it("keeps its own size over the field's", async () => {
    const { container } = await drawn(
      <Field.Root size="lg">{composed({ size: "sm" })}</Field.Root>,
    );

    expect([...slotElement(container, "radio-group", "root").classList]).toContain(
      variantClass("radio-group__root", "size", "sm"),
    );
  });
});
