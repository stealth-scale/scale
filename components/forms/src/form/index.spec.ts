import { describe, expect, it } from "vitest";

import * as components from "#form/index.ts";

describe("index", () => {
  it("exports every field component of the binding", () => {
    expect(Object.keys(components).toSorted()).toStrictEqual([
      "CheckboxCardsField",
      "CheckboxField",
      "ChoicesField",
      "ComboboxField",
      "DateField",
      "DatePickerField",
      "MaskedField",
      "NumberField",
      "PasswordField",
      "PhoneField",
      "RadioCardsField",
      "RadioField",
      "SegmentField",
      "SelectField",
      "SliderField",
      "SwitchField",
      "TagsField",
      "TextField",
      "TextareaField",
    ]);
  });
});
