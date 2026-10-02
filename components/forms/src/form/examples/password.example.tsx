import { type ReactElement } from "react";

import { CircleAlertIcon, EyeIcon, EyeOffIcon } from "lucide-react";

import { type FormGlyphs, useSchemaForm } from "@stealthscale/component-forms/form";
import { createEngine, type Keyword, type Schema } from "@stealthscale/provider-form";
import { useWords } from "@stealthscale/specimen";

const MATCHES: Keyword = {
  holds: (property, value, values) =>
    typeof property === "string" &&
    typeof values === "object" &&
    values !== null &&
    Reflect.get(values, property) === value,
  name: "x-matches",
  on: ["string"],
};

const ENGINE = createEngine({ keywords: [MATCHES] });

const SCHEMA: Schema = {
  properties: {
    confirm: { format: "password", minLength: 1, type: "string", "x-matches": "password" },
    current: { format: "password", minLength: 1, type: "string" },
    password: { format: "password", minLength: 12, type: "string" },
  },
  required: ["confirm", "current", "password"],
  type: "object",
};

const GLYPHS: FormGlyphs = {
  error: <CircleAlertIcon />,
  password: { hide: <EyeOffIcon />, show: <EyeIcon /> },
};

export function Password(): ReactElement {
  const { t } = useWords("form");
  const form = useSchemaForm({
    engine: ENGINE,
    presentation: {
      fields: {
        confirm: { autocomplete: "new-password" },
        current: { autocomplete: "current-password" },
        password: { autocomplete: "new-password" },
      },
      id: "password",
      of: ["current", "password", "confirm"],
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
