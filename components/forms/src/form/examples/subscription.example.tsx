import { type ReactElement } from "react";

import {
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleAlertIcon,
} from "lucide-react";

import { type FormGlyphs, useSchemaForm } from "@stealthscale/component-forms/form";
import { type Schema } from "@stealthscale/provider-form";
import { useWords } from "@stealthscale/specimen";

const SCHEMA: Schema = {
  properties: {
    extras: { items: { enum: ["support", "audit", "sso"], type: "string" }, type: "array" },
    period: { default: "month", enum: ["month", "year"], type: "string" },
    plan: { enum: ["starter", "team", "business"], type: "string" },
    seats: { default: 5, maximum: 50, minimum: 1, type: "integer" },
    start: { format: "date", minLength: 1, type: "string" },
  },
  required: ["period", "plan", "seats", "start"],
  type: "object",
};

const GLYPHS: FormGlyphs = {
  checkbox: <CheckIcon strokeWidth={3} />,
  date: {
    calendar: <CalendarIcon />,
    next: <ChevronRightIcon />,
    previous: <ChevronLeftIcon />,
  },
  error: <CircleAlertIcon />,
};

export function Subscription(): ReactElement {
  const { t } = useWords("form");
  const form = useSchemaForm({
    presentation: {
      fields: {
        extras: { control: "cards" },
        period: { control: "segments" },
        plan: { control: "cards" },
        seats: { control: "slider" },
        start: { control: "date-picker" },
      },
      id: "subscription",
      of: ["plan", "period", "seats", "start", "extras"],
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
