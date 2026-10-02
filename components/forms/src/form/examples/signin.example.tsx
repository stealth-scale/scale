import { type ReactElement } from "react";

import { CheckIcon, CircleAlertIcon } from "lucide-react";

import { type FormGlyphs, type FormProps, useSchemaForm } from "@stealthscale/component-forms/form";
import { type Schema } from "@stealthscale/provider-form";
import { useWords } from "@stealthscale/specimen";

const SCHEMA: Schema = {
  properties: {
    email: { format: "email", minLength: 1, type: "string" },
    password: { format: "password", minLength: 8, type: "string" },
    remember: { type: "boolean" },
  },
  required: ["email", "password"],
  type: "object",
};

const GLYPHS: FormGlyphs = { checkbox: <CheckIcon strokeWidth={3} />, error: <CircleAlertIcon /> };

export function SignIn(props: FormProps): ReactElement {
  const { t } = useWords("form");
  const form = useSchemaForm({
    presentation: {
      fields: {
        email: { autocomplete: "email" },
        password: { autocomplete: "current-password" },
      },
      id: "signin",
    },
    schema: SCHEMA,
    translate: t,
  });

  return (
    <form.AppForm>
      <form.Form glyphs={GLYPHS} {...props}>
        <form.Fields />
        <form.Submit />
      </form.Form>
    </form.AppForm>
  );
}
