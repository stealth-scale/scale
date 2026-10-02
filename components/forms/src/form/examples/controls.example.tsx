import { type ReactElement } from "react";

import {
  CheckIcon,
  ChevronDownIcon,
  CircleAlertIcon,
  EyeIcon,
  EyeOffIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react";

import { type FormGlyphs, useSchemaForm } from "@stealthscale/component-forms/form";
import { type Schema } from "@stealthscale/provider-form";
import { useWords } from "@stealthscale/specimen";

const SCHEMA: Schema = {
  properties: {
    bio: { maxLength: 400, type: "string" },
    channels: {
      items: { enum: ["email", "chat", "sms"], type: "string" },
      type: "array",
      uniqueItems: true,
    },
    country: { enum: ["nl", "be", "de", "fr", "gb", "us"], type: "string" },
    email: { format: "email", type: "string" },
    name: { type: "string" },
    password: { format: "password", type: "string" },
    plan: { enum: ["starter", "team", "business"], type: "string" },
    seats: { default: 5, maximum: 50, minimum: 1, type: "integer" },
    start: { format: "date", type: "string" },
    sync: { type: "boolean" },
    updates: { type: "boolean" },
    website: { format: "url", type: "string" },
  },
  type: "object",
};

const GLYPHS: FormGlyphs = {
  checkbox: <CheckIcon strokeWidth={3} />,
  error: <CircleAlertIcon />,
  number: { decrement: <MinusIcon />, increment: <PlusIcon /> },
  password: { hide: <EyeOffIcon />, show: <EyeIcon /> },
  select: { indicator: <ChevronDownIcon />, selected: <CheckIcon /> },
};

export function Controls(): ReactElement {
  const { t } = useWords("form");
  const form = useSchemaForm({
    presentation: {
      fields: {
        bio: { control: "textarea", span: 2 },
        channels: { span: 2 },
        sync: { control: "switch" },
      },
      id: "account",
      of: [
        {
          columns: 2,
          of: [
            "name",
            "email",
            "password",
            "website",
            "seats",
            "start",
            "plan",
            "country",
            "channels",
            "bio",
            "updates",
            "sync",
          ],
        },
      ],
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
