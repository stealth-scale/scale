/**
 * Lists the renderers a form built from a schema renders its fields with.
 *
 * @remarks
 *   A field's type picks the text box, the number input or the checkbox. A string's `format` picks
 *   the date input for `date`, the password box for `password`, the phone input for `phone` and the
 *   masked box for `iban`. A string `enum` picks the radio group up to five choices, the select up
 *   to ten and the combobox above that. An array of `enum` strings picks the group of checkboxes,
 *   and an array of other strings the tags input. `x-control` overrides each pick at the strongest
 *   rank with `switch`, `textarea`, `select`, `radio`, `combobox`, `segments`, `cards`, `slider`,
 *   `date-picker`, `phone` or `mask`. The later of two renderers at one rank renders the field, so
 *   an application replaces one by registering its own after these.
 */

import {
  byControl,
  choicesOf,
  isSchema,
  RANK,
  type Renderer,
  type Schema,
  type Suits,
} from "@stealthscale/provider-form";

import { fieldComponents as fields } from "#form/fields.ts";

/**
 * Most choices an `enum` has for the form to render it as a radio group.
 */
export const RADIO_CHOICES = 5;

/**
 * Most choices an `enum` has for the form to render it as a select. A longer one renders as a
 * combobox, which narrows the list as a person types.
 */
export const SELECT_CHOICES = 10;

/**
 * Suits a field that names a renderer by `control` at the strongest rank, and any other field as
 * the fallback rule judges it.
 *
 * @param control - The name a field writes in `control`.
 * @param otherwise - The rule for a field that names no renderer, or another one.
 */
function named(control: string, otherwise: Suits): Suits {
  return (presentation, schema) =>
    presentation.control === control ? RANK.control : otherwise(presentation, schema);
}

/**
 * Suits a string of one format at the format's rank.
 *
 * @param format - The value the schema's `format` names.
 */
function formatted(format: string): Suits {
  return (_, schema) =>
    schema["type"] === "string" && schema["format"] === format ? RANK.format : undefined;
}

/**
 * Suits a field that names a renderer by `control` and whose schema the rule accepts, at the
 * strongest rank.
 *
 * @param control - The name a field writes in `control`.
 * @param accepts - The rule for the schema the renderer takes.
 */
function chosen(control: string, accepts: (schema: Schema) => boolean): Suits {
  return (presentation, schema) =>
    presentation.control === control && accepts(schema) ? RANK.control : undefined;
}

/**
 * Reads the choices of an array's items, or none where the items state no `enum` of strings.
 */
function itemChoicesOf(schema: Schema): readonly string[] {
  const items = schema["items"];

  return schema["type"] === "array" && isSchema(items) ? choicesOf(items) : [];
}

/**
 * Reports whether a schema is an array of strings.
 */
function isStrings(schema: Schema): boolean {
  const items = schema["items"];

  return schema["type"] === "array" && isSchema(items) && items["type"] === "string";
}

/**
 * Lists the renderers in registration order.
 */
export const renderers: readonly Renderer[] = [
  {
    draw: fields.Text,
    suits: (_, schema) => (schema["type"] === "string" ? RANK.type : undefined),
  },
  {
    draw: fields.Number,
    suits: (_, schema) =>
      schema["type"] === "number" || schema["type"] === "integer" ? RANK.type : undefined,
  },
  {
    draw: fields.Checkbox,
    suits: (_, schema) => (schema["type"] === "boolean" ? RANK.type : undefined),
  },
  { draw: fields.Tags, suits: (_, schema) => (isStrings(schema) ? RANK.type : undefined) },
  { draw: fields.Date, suits: formatted("date") },
  { draw: fields.Password, suits: formatted("password") },
  { draw: fields.Phone, suits: named("phone", formatted("phone")) },
  { draw: fields.Masked, suits: named("mask", formatted("iban")) },
  { draw: fields.Switch, suits: byControl("switch") },
  { draw: fields.Textarea, suits: byControl("textarea") },
  { draw: fields.Slider, suits: byControl("slider") },
  { draw: fields.DatePicker, suits: byControl("date-picker") },
  {
    draw: fields.Select,
    suits: named("select", (_, schema) =>
      choicesOf(schema).length > 0 ? RANK.constraint : undefined,
    ),
  },
  {
    draw: fields.Radio,
    suits: named("radio", (_, schema) => {
      const { length } = choicesOf(schema);

      return length > 0 && length <= RADIO_CHOICES ? RANK.constraint : undefined;
    }),
  },
  {
    draw: fields.Combobox,
    suits: named("combobox", (_, schema) =>
      choicesOf(schema).length > SELECT_CHOICES ? RANK.constraint : undefined,
    ),
  },
  {
    draw: fields.Choices,
    suits: (_, schema) => (itemChoicesOf(schema).length > 0 ? RANK.constraint : undefined),
  },
  { draw: fields.Segments, suits: chosen("segments", (schema) => choicesOf(schema).length > 0) },
  {
    draw: fields.RadioCards,
    suits: chosen("cards", (schema) => choicesOf(schema).length > 0),
  },
  {
    draw: fields.CheckboxCards,
    suits: chosen("cards", (schema) => itemChoicesOf(schema).length > 0),
  },
];
