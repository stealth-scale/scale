import { type ReactElement } from "react";

import { CheckIcon, CircleAlertIcon } from "lucide-react";

import { type FormGlyphs, useSchemaForm } from "@stealthscale/component-forms/form";
import { type Schema } from "@stealthscale/provider-form";
import { useWords } from "@stealthscale/specimen";

const SCHEMA: Schema = {
  allOf: [
    {
      if: { properties: { kind: { const: "business" } }, required: ["kind"] },
      // eslint-disable-next-line unicorn/no-thenable -- then is the JSON Schema keyword, and no promise reads it
      then: {
        properties: {
          company: { minLength: 1, type: "string" },
          vat: { pattern: "^[A-Z]{2}[0-9A-Z]{8,12}$", type: "string" },
        },
        required: ["company", "vat"],
      },
    },
    {
      if: { properties: { elsewhere: { const: true } }, required: ["elsewhere"] },
      // eslint-disable-next-line unicorn/no-thenable -- then is the JSON Schema keyword, and no promise reads it
      then: {
        properties: { invoices: { format: "email", minLength: 1, type: "string" } },
        required: ["invoices"],
      },
    },
  ],
  properties: {
    elsewhere: { default: false, type: "boolean" },
    email: { format: "email", minLength: 1, type: "string" },
    kind: { default: "personal", enum: ["personal", "business"], type: "string" },
    name: { minLength: 1, type: "string" },
  },
  required: ["email", "kind", "name"],
  type: "object",
};

const GLYPHS: FormGlyphs = { checkbox: <CheckIcon />, error: <CircleAlertIcon /> };

export function Billing(): ReactElement {
  const { t } = useWords("form");
  const form = useSchemaForm({
    presentation: {
      fields: {
        company: { autocomplete: "organization" },
        email: { autocomplete: "email" },
        invoices: { autocomplete: "email" },
        name: { autocomplete: "name" },
        vat: { width: "medium" },
      },
      id: "billing",
      of: ["kind", "name", "company", "vat", "email", "elsewhere", "invoices"],
    },
    schema: SCHEMA,
    translate: t,
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
