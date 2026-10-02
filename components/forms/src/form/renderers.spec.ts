import { describe, expect, it } from "vitest";

import { type Field, rendererFor, type Schema } from "@stealthscale/provider-form";

import * as components from "#form/index.ts";
import { RADIO_CHOICES, renderers, SELECT_CHOICES } from "#form/renderers.ts";

const SHORT: Schema = { enum: ["email", "chat"], type: "string" };

const LONG: Schema = { enum: ["a", "b", "c", "d", "e", "f"], type: "string" };

const MANY: Schema = {
  enum: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"],
  type: "string",
};

/**
 * Returns the component the renderers render a field with.
 */
function componentOf(schema: Schema, presentation: Field = {}): unknown {
  return rendererFor(renderers, presentation, schema)?.draw;
}

describe("renderers", () => {
  it("renders a string with the text field", () => {
    expect(componentOf({ type: "string" })).toBe(components.TextField);
  });

  it.each(["number", "integer"])("renders a %s with the number field", (type) => {
    expect(componentOf({ type })).toBe(components.NumberField);
  });

  it("renders a boolean with the checkbox field", () => {
    expect(componentOf({ type: "boolean" })).toBe(components.CheckboxField);
  });

  it("renders a string of the date format with the date field", () => {
    expect(componentOf({ format: "date", type: "string" })).toBe(components.DateField);
  });

  it("renders a string of the password format with the password field", () => {
    expect(componentOf({ format: "password", type: "string" })).toBe(components.PasswordField);
  });

  it("renders a string of the phone format with the phone field", () => {
    expect(componentOf({ format: "phone", type: "string" })).toBe(components.PhoneField);
  });

  it("renders a string that names the phone input with the phone field", () => {
    expect(componentOf({ type: "string" }, { control: "phone" })).toBe(components.PhoneField);
  });

  it("renders a string of the IBAN format with the masked field", () => {
    expect(componentOf({ format: "iban", type: "string" })).toBe(components.MaskedField);
  });

  it("renders a string that names the mask with the masked field", () => {
    expect(componentOf({ type: "string" }, { control: "mask" })).toBe(components.MaskedField);
  });

  it("renders a boolean that names the switch with the switch field", () => {
    expect(componentOf({ type: "boolean" }, { control: "switch" })).toBe(components.SwitchField);
  });

  it("renders a string that names the textarea with the textarea field", () => {
    expect(componentOf({ type: "string" }, { control: "textarea" })).toBe(components.TextareaField);
  });

  it("renders a number that names the slider with the slider field", () => {
    expect(componentOf({ type: "number" }, { control: "slider" })).toBe(components.SliderField);
  });

  it("renders a date that names the date picker with the date picker field", () => {
    expect(componentOf({ format: "date", type: "string" }, { control: "date-picker" })).toBe(
      components.DatePickerField,
    );
  });

  it("renders an enum of up to five choices with the radio field", () => {
    expect(componentOf(SHORT)).toBe(components.RadioField);
  });

  it("renders an enum of six to ten choices with the select field", () => {
    expect(componentOf(LONG)).toBe(components.SelectField);
  });

  it("renders an enum of more than ten choices with the combobox field", () => {
    expect(componentOf(MANY)).toBe(components.ComboboxField);
  });

  it("renders a short enum that names the select with the select field", () => {
    expect(componentOf(SHORT, { control: "select" })).toBe(components.SelectField);
  });

  it("renders a long enum that names the radio group with the radio field", () => {
    expect(componentOf(LONG, { control: "radio" })).toBe(components.RadioField);
  });

  it("renders a short enum that names the combobox with the combobox field", () => {
    expect(componentOf(SHORT, { control: "combobox" })).toBe(components.ComboboxField);
  });

  it("renders an enum that names the segments with the segment field", () => {
    expect(componentOf(SHORT, { control: "segments" })).toBe(components.SegmentField);
  });

  it("renders a string without choices that names the segments with the text field", () => {
    expect(componentOf({ type: "string" }, { control: "segments" })).toBe(components.TextField);
  });

  it("renders an enum that names the cards with the radio cards field", () => {
    expect(componentOf(SHORT, { control: "cards" })).toBe(components.RadioCardsField);
  });

  it("renders an array of enum strings that names the cards with the checkbox cards field", () => {
    expect(componentOf({ items: SHORT, type: "array" }, { control: "cards" })).toBe(
      components.CheckboxCardsField,
    );
  });

  it("renders an array of enum strings with the choices field", () => {
    expect(componentOf({ items: SHORT, type: "array" })).toBe(components.ChoicesField);
  });

  it("renders an array of other strings with the tags field", () => {
    expect(componentOf({ items: { type: "string" }, type: "array" })).toBe(components.TagsField);
  });

  it("renders no array of numbers", () => {
    expect(componentOf({ items: { type: "number" }, type: "array" })).toBeUndefined();
  });

  it("renders no array without items", () => {
    expect(componentOf({ type: "array" })).toBeUndefined();
  });

  it("renders no object", () => {
    expect(componentOf({ type: "object" })).toBeUndefined();
  });

  it("allows five choices in a radio group", () => {
    expect(RADIO_CHOICES).toBe(5);
  });

  it("allows ten choices in a select", () => {
    expect(SELECT_CHOICES).toBe(10);
  });
});
