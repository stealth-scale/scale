import { type ReactElement } from "react";

import { CheckIcon, ChevronDownIcon, CircleAlertIcon, MinusIcon, PlusIcon } from "lucide-react";

import { type FormGlyphs, useSchemaForm } from "@stealthscale/component-forms/form";
import { type Schema } from "@stealthscale/provider-form";
import { useWords } from "@stealthscale/specimen";

const SCHEMA: Schema = {
  properties: {
    channels: {
      items: { enum: ["email", "push", "sms"], type: "string" },
      type: "array",
      uniqueItems: true,
    },
    digest: { type: "boolean" },
    hour: { maximum: 23, minimum: 0, type: "integer" },
    language: { enum: ["en", "nl", "de", "fr", "es", "it"], type: "string" },
    name: { minLength: 1, type: "string" },
  },
  required: ["language", "name"],
  type: "object",
};

const GLYPHS: FormGlyphs = {
  checkbox: <CheckIcon strokeWidth={3} />,
  error: <CircleAlertIcon />,
  number: { decrement: <MinusIcon />, increment: <PlusIcon /> },
  select: { indicator: <ChevronDownIcon />, selected: <CheckIcon /> },
};

export function Preferences(): ReactElement {
  const { t } = useWords("form");
  const form = useSchemaForm({
    presentation: {
      fields: { digest: { control: "switch" }, name: { autocomplete: "nickname" } },
      id: "preferences",
      steps: {
        kind: "tabs",
        of: [
          { name: "profile", of: ["name", "language"] },
          { name: "notifications", of: ["digest", "hour", "channels"] },
        ],
      },
    },
    schema: SCHEMA,
    translate: t,
    values: { channels: ["email"], digest: true, hour: 8, language: "en", name: "Ada Okafor" },
  });

  return (
    <form.AppForm>
      <form.Form glyphs={GLYPHS}>
        <form.Fields />
      </form.Form>
    </form.AppForm>
  );
}
