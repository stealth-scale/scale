import { type ReactElement } from "react";

import { CheckIcon, ChevronDownIcon, CircleAlertIcon, XIcon } from "lucide-react";

import { type FormGlyphs, phone, useSchemaForm } from "@stealthscale/component-forms/form";
import { createEngine, type Schema } from "@stealthscale/provider-form";
import { useWords } from "@stealthscale/specimen";

const COUNTRIES = [
  "at",
  "be",
  "ch",
  "cz",
  "de",
  "dk",
  "es",
  "fi",
  "fr",
  "gb",
  "ie",
  "it",
  "nl",
  "no",
  "pl",
  "pt",
  "se",
];

const SCHEMA: Schema = {
  properties: {
    country: { enum: COUNTRIES, type: "string" },
    phone: { format: "phone", minLength: 1, type: "string" },
    postcode: { type: "string" },
    skills: { items: { type: "string" }, maxItems: 8, type: "array" },
  },
  required: ["country", "phone"],
  type: "object",
};

const ENGINE = createEngine({ formats: [phone] });

const GLYPHS: FormGlyphs = {
  error: <CircleAlertIcon />,
  remove: <XIcon />,
  select: { indicator: <ChevronDownIcon />, selected: <CheckIcon /> },
};

export function Freelancer(): ReactElement {
  const { t } = useWords("form");
  const form = useSchemaForm({
    engine: ENGINE,
    presentation: {
      fields: {
        phone: {
          autocomplete: "tel",
          options: { countries: ["NL", "BE", "DE", "FR", "GB", "US"], country: "NL" },
        },
        postcode: {
          autocomplete: "postal-code",
          control: "mask",
          options: { mask: "9999 AA" },
          width: "short",
        },
      },
      id: "freelancer",
      of: ["country", "phone", "postcode", "skills"],
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
