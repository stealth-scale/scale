import { describe, expect, it } from "vitest";

import * as entry from "#form.ts";

describe("form", () => {
  it("exports the names the binding publishes", () => {
    expect(Object.keys(entry).toSorted()).toStrictEqual([
      "CheckboxCardsField",
      "CheckboxField",
      "ChoicesField",
      "ComboboxField",
      "DateField",
      "DatePickerField",
      "Form",
      "Frame",
      "Mark",
      "MaskedField",
      "NumberField",
      "PasswordField",
      "PhoneField",
      "RADIO_CHOICES",
      "RadioCardsField",
      "RadioField",
      "SELECT_CHOICES",
      "SegmentField",
      "SelectField",
      "SliderField",
      "Submit",
      "SwitchField",
      "TagsField",
      "TextField",
      "TextareaField",
      "fieldComponents",
      "iban",
      "layouts",
      "phone",
      "renderers",
      "useAppForm",
      "useBoundField",
      "useSchemaForm",
      "withFieldGroup",
      "withForm",
    ]);
  });
});
