import { describe, expect, it } from "vitest";

import { fieldComponents } from "#form/fields.ts";
import * as components from "#form/index.ts";

describe("fieldComponents", () => {
  it("names every field component a field reads", () => {
    expect(fieldComponents).toStrictEqual({
      Checkbox: components.CheckboxField,
      CheckboxCards: components.CheckboxCardsField,
      Choices: components.ChoicesField,
      Combobox: components.ComboboxField,
      Date: components.DateField,
      DatePicker: components.DatePickerField,
      Masked: components.MaskedField,
      Number: components.NumberField,
      Password: components.PasswordField,
      Phone: components.PhoneField,
      Radio: components.RadioField,
      RadioCards: components.RadioCardsField,
      Segments: components.SegmentField,
      Select: components.SelectField,
      Slider: components.SliderField,
      Switch: components.SwitchField,
      Tags: components.TagsField,
      Text: components.TextField,
      Textarea: components.TextareaField,
    });
  });
});
