import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";
import {
  announced,
  composed,
  framed,
  hiddenInput,
  picked,
  STATEMENT,
} from "#file-upload/file-upload.fixtures.tsx";
import { recipe } from "#file-upload/recipe.ts";
import { type RootProps } from "#file-upload/root.tsx";

describe("Root", () => {
  it("returns no accessibility violation for a labelled upload", async () => {
    await expect(
      accessibilityViolations(() => composed({ defaultAcceptedFiles: [STATEMENT] })),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(composed(props))).container,
        { slot: "dropzone" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("renders a fieldset", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "file-upload", "root").tagName).toBe("FIELDSET");
  });

  it("names the group after its label", async () => {
    await drawn(composed());

    expect(screen.getByRole("group", { name: "Statements" })).toBeDefined();
  });

  it("names the group after the label of the field around it", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Statements</Field.Label>
        {composed({}, { labelled: false })}
      </Field.Root>,
    );

    expect(screen.getByRole("group", { name: "Statements" })).toBeDefined();
  });

  it("describes the group by the texts of the field around it", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Statements</Field.Label>
        {composed({}, { labelled: false })}
        <Field.HelperText>PDF files up to 5 MB</Field.HelperText>
      </Field.Root>,
    );

    expect(screen.getByRole("group", { description: "PDF files up to 5 MB" })).toBeDefined();
  });

  it("names the group after the legend of the fieldset around it", async () => {
    await drawn(
      <Fieldset.Root>
        <Fieldset.Legend>Evidence</Fieldset.Legend>
        {composed({}, { labelled: false })}
      </Fieldset.Root>,
    );

    expect(
      screen.getAllByRole("group", { name: "Evidence" }).map((each) => each.tagName),
    ).toStrictEqual(["FIELDSET", "FIELDSET"]);
  });

  it("disables the fieldset when the upload is disabled", async () => {
    await drawn(composed({ disabled: true }));

    expect(screen.getByRole<HTMLFieldSetElement>("group").disabled).toBe(true);
  });

  it("leaves the fieldset enabled by default", async () => {
    await drawn(composed());

    expect(screen.getByRole<HTMLFieldSetElement>("group").disabled).toBe(false);
  });

  it("renders the hidden file input after its parts", async () => {
    const { container } = await drawn(composed({ name: "statements" }));

    expect(slotElement(container, "file-upload", "root").lastElementChild).toBe(
      hiddenInput(container),
    );
  });

  it("names the hidden file input after name", async () => {
    const { container } = await drawn(composed({ name: "statements" }));

    expect(hiddenInput(container).name).toBe("statements");
  });

  it("takes the size of the field around it", async () => {
    const { container } = await drawn(
      <Field.Root size="lg">{composed({}, { labelled: false })}</Field.Root>,
    );

    expect([...slotElement(container, "file-upload", "root").classList]).toContain(
      variantClass("file-upload__root", "size", "lg"),
    );
  });

  it("keeps its own size over the field's", async () => {
    const { container } = await drawn(
      <Field.Root size="lg">{composed({ size: "sm" }, { labelled: false })}</Field.Root>,
    );

    expect([...slotElement(container, "file-upload", "root").classList]).toContain(
      variantClass("file-upload__root", "size", "sm"),
    );
  });

  it("takes the size of the fieldset around it", async () => {
    const { container } = await drawn(<Fieldset.Root size="sm">{composed()}</Fieldset.Root>);

    expect([...slotElement(container, "file-upload", "root").classList]).toContain(
      variantClass("file-upload__root", "size", "sm"),
    );
  });

  it("gives its size to the trigger", async () => {
    await drawn(composed({ size: "lg" }));

    expect([...screen.getByRole("button", { name: "Choose files" }).classList]).toContain(
      variantClass("button", "size", "lg"),
    );
  });

  it("takes the disabled state of the fieldset around it", async () => {
    await drawn(<Fieldset.Root disabled>{composed()}</Fieldset.Root>);

    expect(screen.getByRole<HTMLButtonElement>("button", { name: "Choose files" }).disabled).toBe(
      true,
    );
  });

  it("takes the read-only state of the field around it", async () => {
    await drawn(
      <Field.Root readOnly>
        <Field.Label>Statements</Field.Label>
        {composed({}, { labelled: false })}
      </Field.Root>,
    );

    expect(screen.getByRole("button", { name: "Drop statements here" }).dataset["readonly"]).toBe(
      "",
    );
  });

  it("takes the invalid state of the field around it", async () => {
    await drawn(
      <Field.Root invalid>
        <Field.Label>Statements</Field.Label>
        {composed({}, { labelled: false })}
      </Field.Root>,
    );

    expect(screen.getByRole("button", { name: "Drop statements here" }).dataset["invalid"]).toBe(
      "",
    );
  });

  it("takes the required state of the field around it", async () => {
    const { container } = await drawn(
      <Field.Root required>{composed({}, { labelled: false })}</Field.Root>,
    );

    expect(hiddenInput(container).required).toBe(true);
  });

  it("gives the hidden file input the ID the field's label points at", async () => {
    const { container } = await drawn(
      <Field.Root>
        <Field.Label>Statements</Field.Label>
        {composed({}, { labelled: false })}
      </Field.Root>,
    );

    expect(screen.getByText<HTMLLabelElement>("Statements").htmlFor).toBe(
      hiddenInput(container).id,
    );
  });

  it("announces with the words the caller passes", async () => {
    const { container } = await drawn(
      composed({ addedMessage: (files) => `Attached ${files.map((file) => file.name).join()}` }),
    );

    await picked(container, [STATEMENT]);
    await framed();

    expect(announced()).toBe("Attached statement.pdf");
  });
});
