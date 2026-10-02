import { type ReactElement } from "react";

import { render, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useAppForm, useSchemaForm } from "#hooks.fixtures.ts";
import { FormProvider } from "#provider.tsx";
import { type Schema } from "#schema.ts";
import { type Translate, translateFrom } from "#translate.ts";
import { useWords, wordsOf } from "#words.ts";

const catalogue = translateFrom({
  "checkout.actions.remove": "Remove line {{number}}",
  "checkout.actions.submit": "Place order",
  "checkout.errors.email.format": "Enter an address like name@example.com",
  "checkout.fields.email.description": "We never share it",
  "checkout.fields.email.label": "Email address",
  "checkout.fields.kind.descriptions.business": "Invoices show your VAT number",
  "checkout.fields.kind.options.business": "A business",
  "checkout.groups.who.legend": "Who is ordering",
  "checkout.marks.optional": "(if you like)",
  "checkout.steps.pay.label": "Payment",
  "errors.minLength": "Too short",
  "form.fields.email.label": "Any form's email",
  "marks.optional": "(optional)",
  Taken: "That name is taken",
});

const words = wordsOf(catalogue, "checkout");

const schema: Schema = { properties: { email: { type: "string" } }, type: "object" };

/**
 * Renders the label of the email field as the words in scope resolve it.
 */
function Label(): ReactElement {
  return <output>{useWords().label("email")}</output>;
}

/**
 * Builds a form from the schema, translated by the catalogue given or the provider's.
 */
function Described({ translate }: { readonly translate?: Translate | undefined }): ReactElement {
  const form = useSchemaForm({ id: "checkout", schema, translate });

  return (
    <form.AppForm>
      <Label />
    </form.AppForm>
  );
}

/**
 * Builds a form from the library's own options.
 */
function Plain(): ReactElement {
  const form = useAppForm({ defaultValues: { email: "" } });

  return (
    <form.AppForm>
      <Label />
    </form.AppForm>
  );
}

describe("wordsOf", () => {
  it("reads a label from the catalogue", () => {
    expect(words.label("email")).toBe("Email address");
  });

  it("writes the path out as a label the catalogue lacks", () => {
    expect(words.label("billing.vatNumber")).toBe("Vat number");
  });

  it("reads the words given as a label the catalogue lacks", () => {
    expect(words.label("billing.vatNumber", "VAT")).toBe("VAT");
  });

  it("reads a legend from the catalogue", () => {
    expect(words.legend("who")).toBe("Who is ordering");
  });

  it("writes a group's name out as a legend the catalogue lacks", () => {
    expect(words.legend("billing")).toBe("Billing");
  });

  it("reads a step's label from the catalogue", () => {
    expect(words.step("pay")).toBe("Payment");
  });

  it("reads a choice from the catalogue", () => {
    expect(words.option("kind", "business")).toBe("A business");
  });

  it("reads a choice's value where the catalogue lacks the choice", () => {
    expect(words.option("kind", "individual")).toBe("individual");
  });

  it("reads the words under a choice from the catalogue", () => {
    expect(words.optionDescription("kind", "business")).toBe("Invoices show your VAT number");
  });

  it("reads an empty string under a choice the catalogue describes nowhere", () => {
    expect(words.optionDescription("kind", "individual")).toBe("");
  });

  it("reads an action from the catalogue", () => {
    expect(words.action("submit", "Submit")).toBe("Place order");
  });

  it("reads the English given for an action the catalogue lacks", () => {
    expect(words.action("next", "Next")).toBe("Next");
  });

  it("writes the values into an action's words from the catalogue", () => {
    expect(words.action("remove", "Remove item {{number}}", { number: 2 })).toBe("Remove line 2");
  });

  it("writes the values into the English given for an action", () => {
    expect(words.action("add", "Add item {{number}}", { number: 3 })).toBe("Add item 3");
  });

  it("reads a mark under the form's identifier", () => {
    expect(words.mark("optional", "(optional)")).toBe("(if you like)");
  });

  it("reads a mark under the shared identifier where the form's is absent", () => {
    expect(wordsOf(catalogue, "signup").mark("optional", "optional")).toBe("(optional)");
  });

  it("reads the English given for a mark the catalogue lacks", () => {
    expect(words.mark("recommended", "(recommended)")).toBe("(recommended)");
  });

  it("reads help text from the catalogue", () => {
    expect(words.description("email")).toBe("We never share it");
  });

  it("reads the fallback as help text the catalogue lacks", () => {
    expect(words.description("name", "Your full name")).toBe("Your full name");
  });

  it("reads empty help text without a catalogue entry or a fallback", () => {
    expect(words.description("name")).toBe("");
  });

  it("reads an empty placeholder where the catalogue has none", () => {
    expect(words.placeholder("email")).toBe("");
  });

  it("reads a label under the identifier the presentation states", () => {
    expect(words.label("email", undefined, "checkout.actions.submit")).toBe("Place order");
  });

  it("reads a label under the derived identifier where the presentation's is absent", () => {
    expect(words.label("email", undefined, "absent")).toBe("Email address");
  });

  it("reads help text under the identifier the presentation states", () => {
    expect(words.description("name", "Fallback", "checkout.fields.email.description")).toBe(
      "We never share it",
    );
  });

  it("reads a placeholder under the identifier the presentation states", () => {
    expect(words.placeholder("name", "checkout.steps.pay.label")).toBe("Payment");
  });

  it("reads a keyworded error under the form's identifier", () => {
    expect(words.error("email", { keyword: "format", message: "Bad" })).toBe(
      "Enter an address like name@example.com",
    );
  });

  it("reads a keyworded error under the shared identifier where the form's is absent", () => {
    expect(words.error("name", { keyword: "minLength", message: "Bad" })).toBe("Too short");
  });

  it("reads an error's development text where no catalogue key matches", () => {
    expect(words.error("name", { keyword: "maxLength", message: "Too long" })).toBe("Too long");
  });

  it("reads an error's keyword where it has no development text", () => {
    expect(words.error("name", { keyword: "taken" })).toBe("taken");
  });

  it("reads a string error as its own identifier", () => {
    expect(words.error("name", "Taken")).toBe("That name is taken");
  });

  it("reads a string error the catalogue lacks as its text", () => {
    expect(words.error("name", "Refused")).toBe("Refused");
  });

  it("reads an error that is not a string as its text", () => {
    expect(words.error("name", 42)).toBe("42");
  });

  it("passes the translator the values of a keyworded error", () => {
    const seen: unknown[] = [];
    const spying: Translate = (keys, options) => {
      seen.push(keys, options);

      return options.defaultValue;
    };

    wordsOf(spying, "checkout").error("name", {
      keyword: "minLength",
      message: "Bad",
      values: { minLength: 3 },
    });

    expect(seen).toStrictEqual([
      ["checkout.errors.name.minLength", "errors.minLength"],
      { defaultValue: "Bad", minLength: 3 },
    ]);
  });
});

describe("useWords", () => {
  it("reads a schema form's own identifier and translator", () => {
    const { getByRole } = render(<Described translate={catalogue} />);

    expect(getByRole("status").textContent).toBe("Email address");
  });

  it("reads the provider's translator where the form states none", () => {
    const { getByRole } = render(
      <FormProvider translate={catalogue}>
        <Described />
      </FormProvider>,
    );

    expect(getByRole("status").textContent).toBe("Email address");
  });

  it("reads the identifier form for a form built from the library's own options", () => {
    const { getByRole } = render(
      <FormProvider translate={catalogue}>
        <Plain />
      </FormProvider>,
    );

    expect(getByRole("status").textContent).toBe("Any form's email");
  });

  it("reads the defaults where nothing is in scope", () => {
    const { result } = renderHook(() => useWords());

    expect(result.current.label("email")).toBe("Email");
  });
});
