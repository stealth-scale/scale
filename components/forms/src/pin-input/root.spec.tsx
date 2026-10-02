import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";
import { type ValueChangeDetails } from "#pin-input/machine.ts";
import { box, boxes, composed, focused, typed } from "#pin-input/pin-input.fixtures.tsx";
import { recipe } from "#pin-input/recipe.ts";
import { type RootProps } from "#pin-input/root.tsx";

describe("Root", () => {
  it("returns no accessibility violation for a labelled code", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
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

  it("renders a fieldset", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "pin-input", "root").tagName).toBe("FIELDSET");
  });

  it("takes its name from PinInput.Label", async () => {
    await drawn(composed());

    expect(screen.getByRole("group", { name: "Code" })).toBeDefined();
  });

  it("sets no aria-labelledby without a label outside a field or a fieldset", async () => {
    await drawn(composed({}, false));

    expect(screen.getByRole("group").getAttribute("aria-labelledby")).toBeNull();
  });

  it("takes its name from an aria-label the caller passes", async () => {
    await drawn(composed({ "aria-label": "Security code" }, false));

    expect(screen.getByRole("group", { name: "Security code" })).toBeDefined();
  });

  it("takes its name from the label of the field around it", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Verification code</Field.Label>
        {composed({}, false)}
      </Field.Root>,
    );

    expect(screen.getByRole("group", { name: "Verification code" })).toBeDefined();
  });

  it("takes its name from the legend of the fieldset around it", async () => {
    await drawn(
      <Fieldset.Root>
        <Fieldset.Legend>Sign in</Fieldset.Legend>
        {composed({}, false)}
      </Fieldset.Root>,
    );

    expect(screen.getAllByRole("group", { name: "Sign in" })).toHaveLength(2);
  });

  it("lists the field's helper and error texts in aria-describedby", async () => {
    await drawn(
      <Field.Root id="code">
        {composed({}, false)}
        <Field.HelperText>Sent by message.</Field.HelperText>
      </Field.Root>,
    );

    expect(screen.getByRole("group").getAttribute("aria-describedby")?.split(" ")).toStrictEqual([
      "code-helper",
      "code-error",
    ]);
  });

  it("gives the first box the field's control ID", async () => {
    await drawn(
      <Field.Root id="code">
        <Field.Label>Verification code</Field.Label>
        {composed({}, false)}
      </Field.Root>,
    );

    expect(box(0).id).toBe("code");
  });

  it("renders the hidden input a form submits under the name passed", async () => {
    const { container } = await drawn(
      composed({ defaultValue: ["1", "2", "3", "4"], name: "otp" }),
    );

    expect(container.querySelector<HTMLInputElement>('input[name="otp"]')?.value).toBe("1234");
  });

  it("hides the submitted input from assistive technology", async () => {
    const { container } = await drawn(composed({ name: "otp" }));

    expect(container.querySelector('input[name="otp"]')?.getAttribute("aria-hidden")).toBe("true");
  });

  it("takes the size of the field around it", async () => {
    const { container } = await drawn(<Field.Root size="lg">{composed()}</Field.Root>);

    expect([...slotElement(container, "pin-input", "input").classList]).toContain(
      variantClass("pin-input__input", "size", "lg"),
    );
  });

  it("keeps its own size over the field's", async () => {
    const { container } = await drawn(
      <Field.Root size="lg">{composed({ size: "xs" })}</Field.Root>,
    );

    expect([...slotElement(container, "pin-input", "input").classList]).toContain(
      variantClass("pin-input__input", "size", "xs"),
    );
  });

  it("takes the disabled state of the fieldset around it", async () => {
    await drawn(<Fieldset.Root disabled>{composed()}</Fieldset.Root>);

    expect(boxes().every((each) => each.disabled)).toBe(true);
  });

  it("takes the invalid state of the field around it", async () => {
    await drawn(<Field.Root invalid>{composed()}</Field.Root>);

    expect(boxes().map((each) => each.getAttribute("aria-invalid"))).toStrictEqual([
      "true",
      "true",
      "true",
      "true",
    ]);
  });

  it("takes the read-only state of the field around it", async () => {
    await drawn(<Field.Root readOnly>{composed()}</Field.Root>);

    expect(boxes().every((each) => each.readOnly)).toBe(true);
  });

  it("calls onValueComplete with the code when the last box is filled", async () => {
    const completed = vi.fn<(details: ValueChangeDetails) => void>();

    await drawn(composed({ defaultValue: ["1", "2", "3"], onValueComplete: completed }));
    await focused(box(3));
    await typed(box(3), "4");

    expect(completed).toHaveBeenCalledWith({ value: ["1", "2", "3", "4"], valueAsString: "1234" });
  });
});
