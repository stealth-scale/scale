/**
 * Lists the field components a form hands each field by name, so a form written by hand renders
 * `<field.Select />` inside `form.AppField`.
 */

import * as components from "#form/index.ts";

/**
 * The field components, by the name a field reads each under.
 */
export const fieldComponents = {
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
};
