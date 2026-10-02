import { type ReactElement } from "react";

import { ChevronRightIcon, CircleAlertIcon } from "lucide-react";

import { type FormGlyphs, useSchemaForm } from "@stealthscale/component-forms/form";
import { type Schema } from "@stealthscale/provider-form";
import { useWords } from "@stealthscale/specimen";

const SCHEMA: Schema = {
  properties: {
    city: { minLength: 1, type: "string" },
    email: { format: "email", minLength: 1, type: "string" },
    first: { minLength: 1, type: "string" },
    last: { minLength: 1, type: "string" },
    note: { maxLength: 200, type: "string" },
    phone: { type: "string" },
    postcode: { minLength: 1, type: "string" },
    street: { minLength: 1, type: "string" },
  },
  required: ["city", "email", "first", "last", "postcode", "street"],
  type: "object",
};

const GLYPHS: FormGlyphs = { disclosure: <ChevronRightIcon />, error: <CircleAlertIcon /> };

export function Checkout(): ReactElement {
  const { t } = useWords("form");
  const form = useSchemaForm({
    presentation: {
      fields: {
        city: { autocomplete: "address-level2" },
        email: { autocomplete: "email" },
        first: { autocomplete: "given-name" },
        last: { autocomplete: "family-name" },
        note: { control: "textarea" },
        phone: { autocomplete: "tel" },
        postcode: { autocomplete: "postal-code", width: "short" },
        street: { autocomplete: "street-address", span: 2 },
      },
      id: "checkout",
      of: [
        { direction: "row", legend: true, name: "contact", of: ["email", "phone"] },
        {
          columns: 2,
          legend: true,
          name: "address",
          of: ["first", "last", "street", "postcode", "city"],
        },
        { closed: true, legend: true, name: "gift", of: ["note"] },
      ],
    },
    schema: SCHEMA,
    translate: t,
  });

  return (
    <form.AppForm>
      <form.Form glyphs={GLYPHS} mark="optional">
        <form.Fields />
        <form.Submit />
      </form.Form>
    </form.AppForm>
  );
}
