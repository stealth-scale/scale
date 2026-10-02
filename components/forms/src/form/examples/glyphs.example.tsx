import { type ReactElement } from "react";

import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react";

import { type FormGlyphs, type FormProps, useSchemaForm } from "@stealthscale/component-forms/form";
import { type Schema } from "@stealthscale/provider-form";
import { useWords } from "@stealthscale/specimen";

const SCHEMA: Schema = {
  properties: {
    country: { default: "nl", enum: ["nl", "be", "de", "fr", "gb", "us"], type: "string" },
    invoices: { default: true, type: "boolean" },
    order: { type: "string" },
    seats: { default: 4, maximum: 50, minimum: 1, type: "integer" },
  },
  type: "object",
};

const GLYPHS: FormGlyphs = {
  checkbox: <CheckIcon strokeWidth={3} />,
  disclosure: <ChevronRightIcon />,
  error: <CircleAlertIcon />,
  number: { decrement: <MinusIcon />, increment: <PlusIcon /> },
  select: { indicator: <ChevronDownIcon />, selected: <CheckIcon /> },
};

export function Glyphs(props: FormProps): ReactElement {
  const { t } = useWords("form");
  const form = useSchemaForm({
    presentation: {
      id: "team",
      of: [
        "country",
        "seats",
        "invoices",
        { closed: true, legend: true, name: "more", of: ["order"] },
      ],
    },
    schema: SCHEMA,
    translate: t,
  });

  return (
    <form.AppForm>
      <form.Form glyphs={GLYPHS} {...props}>
        <form.Fields />
      </form.Form>
    </form.AppForm>
  );
}
