import { type ReactElement } from "react";

import { CheckIcon, CircleAlertIcon } from "lucide-react";

import { type FormGlyphs, useSchemaForm } from "@stealthscale/component-forms/form";
import { type Schema } from "@stealthscale/provider-form";
import { useWords } from "@stealthscale/specimen";

const SCHEMA: Schema = {
  properties: {
    email: { format: "email", minLength: 1, type: "string" },
    name: { minLength: 1, type: "string" },
    plan: { enum: ["starter", "team", "business"], type: "string" },
    size: { enum: ["1", "2-10", "11-50", "51-200"], type: "string" },
    terms: { const: true, type: "boolean" },
    workspace: { minLength: 3, type: "string" },
  },
  required: ["email", "name", "plan", "size", "terms", "workspace"],
  type: "object",
};

const GLYPHS: FormGlyphs = { checkbox: <CheckIcon strokeWidth={3} />, error: <CircleAlertIcon /> };

export function Onboarding(): ReactElement {
  const { t } = useWords("form");
  const form = useSchemaForm({
    presentation: {
      fields: { email: { autocomplete: "email" }, name: { autocomplete: "name" } },
      id: "onboarding",
      steps: {
        kind: "wizard",
        of: [
          { name: "you", of: ["name", "email"] },
          { name: "team", of: ["workspace", "size"] },
          { name: "plan", of: ["plan", "terms"] },
        ],
      },
    },
    schema: SCHEMA,
    translate: t,
  });

  return (
    <form.AppForm>
      <form.Form glyphs={GLYPHS} headingLevel={3}>
        <form.Fields />
      </form.Form>
    </form.AppForm>
  );
}
