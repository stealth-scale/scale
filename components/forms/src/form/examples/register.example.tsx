import { type ReactElement } from "react";

import { CircleAlertIcon } from "lucide-react";

import { type FormGlyphs, useSchemaForm } from "@stealthscale/component-forms/form";
import { type Schema } from "@stealthscale/provider-form";
import { useWords } from "@stealthscale/specimen";

interface Account {
  readonly confirm: string;
  readonly email: string;
  readonly password: string;
}

const SCHEMA: Schema = {
  properties: {
    confirm: { format: "password", type: "string" },
    email: { format: "email", minLength: 1, type: "string" },
    password: { format: "password", minLength: 8, type: "string" },
  },
  required: ["confirm", "email", "password"],
  type: "object",
};

const TAKEN = new Set(["ada@example.com"]);

const GLYPHS: FormGlyphs = { error: <CircleAlertIcon /> };

export function Register(): ReactElement {
  const { t } = useWords("form");
  const form = useSchemaForm<Account>({
    presentation: {
      fields: {
        confirm: { autocomplete: "new-password" },
        email: { autocomplete: "email" },
        password: { autocomplete: "new-password" },
      },
      id: "register",
      of: ["email", "password", "confirm"],
    },
    schema: SCHEMA,
    translate: t,
    validators: {
      onSubmit: ({ value }) => {
        if (TAKEN.has(value.email)) return t("register.taken");

        return value.confirm === value.password
          ? undefined
          : { fields: { confirm: t("register.mismatch") } };
      },
    },
    values: { email: "ada@example.com" },
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
