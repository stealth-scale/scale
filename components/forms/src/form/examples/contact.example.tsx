import { type ReactElement } from "react";

import { CheckIcon, ChevronDownIcon, CircleAlertIcon } from "lucide-react";

import { type FormGlyphs, useSchemaForm } from "@stealthscale/component-forms/form";
import { type Schema } from "@stealthscale/provider-form";
import { useWords } from "@stealthscale/specimen";

const SCHEMA: Schema = {
  properties: {
    company: { minLength: 1, type: "string" },
    email: { format: "email", minLength: 1, type: "string" },
    message: { maxLength: 500, type: "string" },
    name: { minLength: 1, type: "string" },
    size: {
      enum: ["1-10", "11-50", "51-200", "201-1000", "1001-5000", "5001+"],
      type: "string",
    },
  },
  required: ["company", "email", "name", "size"],
  type: "object",
};

const GLYPHS: FormGlyphs = {
  error: <CircleAlertIcon />,
  select: { indicator: <ChevronDownIcon />, selected: <CheckIcon /> },
};

export function Contact(): ReactElement {
  const { t } = useWords("form");
  const form = useSchemaForm({
    presentation: {
      fields: {
        company: { autocomplete: "organization" },
        email: { autocomplete: "email" },
        message: { control: "textarea" },
        name: { autocomplete: "name" },
      },
      id: "contact",
      of: ["name", "email", "company", "size", "message"],
    },
    schema: SCHEMA,
    translate: t,
  });

  return (
    <form.AppForm>
      <form.Form glyphs={GLYPHS} orientation="floating">
        <form.Fields />
        <form.Submit />
      </form.Form>
    </form.AppForm>
  );
}
