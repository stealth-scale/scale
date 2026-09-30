import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";
import { recipe } from "#tags-input/recipe.ts";
import { type RootProps } from "#tags-input/root.tsx";
import {
  announced,
  composed,
  field,
  focused,
  keyed,
  typed,
} from "#tags-input/tags-input.fixtures.tsx";

describe("Root", () => {
  it("returns no accessibility violation for a labelled tags input", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(composed(props))).container,
        { slot: "control" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("renders a fieldset", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "tags-input", "root").tagName).toBe("FIELDSET");
  });

  it("names the group after its label", async () => {
    await drawn(composed());

    expect(screen.getByRole("group").getAttribute("aria-labelledby")).toBe(
      screen.getByText("Accounts").id,
    );
  });

  it("names the group after the label of the field around it", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Accounts</Field.Label>
        {composed({}, { labelled: false })}
      </Field.Root>,
    );

    expect(screen.getByRole("group", { name: "Accounts" })).toBeDefined();
  });

  it("names the group after the legend of the fieldset around it", async () => {
    await drawn(
      <Fieldset.Root>
        <Fieldset.Legend>Billing</Fieldset.Legend>
        {composed({}, { labelled: false })}
      </Fieldset.Root>,
    );

    expect(
      screen.getAllByRole("group", { name: "Billing" }).map((each) => each.tagName),
    ).toStrictEqual(["FIELDSET", "FIELDSET"]);
  });

  it("disables the fieldset when the tags input is disabled", async () => {
    await drawn(composed({ disabled: true }));

    expect(screen.getByRole<HTMLFieldSetElement>("group").disabled).toBe(true);
  });

  it("leaves the fieldset enabled by default", async () => {
    await drawn(composed());

    expect(screen.getByRole<HTMLFieldSetElement>("group").disabled).toBe(false);
  });

  it("renders the hidden input with the tags joined by a comma", async () => {
    const { container } = await drawn(composed({ name: "accounts" }));

    expect(container.querySelector<HTMLInputElement>('input[name="accounts"]')?.value).toBe(
      "Bridge Ledger, Halden & Co",
    );
  });

  it("takes the size of the field around it", async () => {
    const { container } = await drawn(
      <Field.Root size="lg">{composed({}, { labelled: false })}</Field.Root>,
    );

    expect([...slotElement(container, "tags-input", "root").classList]).toContain(
      variantClass("tags-input__root", "size", "lg"),
    );
  });

  it("keeps its own size over the field's", async () => {
    const { container } = await drawn(
      <Field.Root size="lg">{composed({ size: "sm" }, { labelled: false })}</Field.Root>,
    );

    expect([...slotElement(container, "tags-input", "root").classList]).toContain(
      variantClass("tags-input__root", "size", "sm"),
    );
  });

  it("takes the size of the fieldset around it", async () => {
    const { container } = await drawn(<Fieldset.Root size="sm">{composed()}</Fieldset.Root>);

    expect([...slotElement(container, "tags-input", "root").classList]).toContain(
      variantClass("tags-input__root", "size", "sm"),
    );
  });

  it("takes the disabled state of the fieldset around it", async () => {
    await drawn(<Fieldset.Root disabled>{composed()}</Fieldset.Root>);

    expect(field().disabled).toBe(true);
  });

  it("takes the read-only state of the field around it", async () => {
    await drawn(
      <Field.Root readOnly>
        <Field.Label>Accounts</Field.Label>
        {composed({}, { labelled: false })}
      </Field.Root>,
    );

    expect(field().readOnly).toBe(true);
  });

  it("takes the invalid state of the field around it", async () => {
    await drawn(
      <Field.Root invalid>
        <Field.Label>Accounts</Field.Label>
        {composed({}, { labelled: false })}
      </Field.Root>,
    );

    expect(field().getAttribute("aria-invalid")).toBe("true");
  });

  it("takes the required state of the field around it", async () => {
    const { container } = await drawn(
      <Field.Root required>{composed({ name: "accounts" }, { labelled: false })}</Field.Root>,
    );

    expect(container.querySelector<HTMLInputElement>('input[name="accounts"]')?.required).toBe(
      true,
    );
  });

  it("gives the input the ID the field's label points at", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Accounts</Field.Label>
        {composed({}, { labelled: false })}
      </Field.Root>,
    );

    expect(screen.getByText<HTMLLabelElement>("Accounts").htmlFor).toBe(field().id);
  });

  it("announces with the words the caller passes", async () => {
    await drawn(composed({ addedMessage: (values) => `Invited ${values.join()}` }));
    await focused();
    await typed("Pinecrest");
    await keyed("Enter");

    expect(announced()).toBe("Invited Pinecrest");
  });

  it("names Enter in the highlight announcement when tags are editable", async () => {
    await drawn(composed({ editable: true }));
    await focused();
    await keyed("Backspace");

    expect(announced()).toBe("Halden & Co. Press Enter to edit it or Backspace to remove it.");
  });
});
