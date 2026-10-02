import { type ReactElement } from "react";

import { CircleAlertIcon, MinusIcon, PlusIcon } from "lucide-react";

import { type FormGlyphs, iban, useSchemaForm } from "@stealthscale/component-forms/form";
import { createEngine, type Schema } from "@stealthscale/provider-form";
import { useWords } from "@stealthscale/specimen";

const SCHEMA: Schema = {
  properties: {
    accounts: {
      items: {
        properties: {
          holder: { minLength: 1, type: "string" },
          iban: { format: "iban", minLength: 1, type: "string" },
          share: { maximum: 100, minimum: 1, type: "integer" },
        },
        required: ["holder", "iban", "share"],
        type: "object",
      },
      maxItems: 3,
      minItems: 1,
      type: "array",
    },
  },
  type: "object",
};

const ENGINE = createEngine({ formats: [iban] });

const GLYPHS: FormGlyphs = {
  error: <CircleAlertIcon />,
  number: { decrement: <MinusIcon />, increment: <PlusIcon /> },
};

export function Payout(): ReactElement {
  const { t } = useWords("form");
  const form = useSchemaForm({
    engine: ENGINE,
    presentation: {
      fields: {
        "accounts[].holder": { autocomplete: "name" },
        "accounts[].iban": { width: "medium" },
      },
      id: "payout",
      of: [
        {
          legend: true,
          name: "accounts",
          of: ["accounts[].holder", "accounts[].iban", "accounts[].share"],
          repeat: "accounts",
        },
      ],
    },
    schema: SCHEMA,
    translate: t,
    values: { accounts: [{ holder: "Ada Okafor", iban: "NL91ABNA0417164300", share: 100 }] },
  });

  return (
    <form.AppForm>
      <form.Form glyphs={GLYPHS}>
        <form.Fields />
        <form.Submit />
      </form.Form>
    </form.AppForm>
  );
}
