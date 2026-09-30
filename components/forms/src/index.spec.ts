import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("exports exactly the components of the package", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "AngleSlider",
      "Checkbox",
      "CheckboxCard",
      "ColorPicker",
      "Combobox",
      "DateInput",
      "DatePicker",
      "Editable",
      "Field",
      "Fieldset",
      "FileUpload",
      "Input",
      "InputGroup",
      "InputMask",
      "InputPropsProvider",
      "NativeSelect",
      "NumberInput",
      "PasswordInput",
      "PhoneInput",
      "PinInput",
      "RadioCard",
      "RadioGroup",
      "RatingGroup",
      "SearchInput",
      "SegmentGroup",
      "Select",
      "SignaturePad",
      "Slider",
      "Switch",
      "TagsInput",
      "Textarea",
    ]);
  });

  it("exports a component with parts as a namespace of the part names", () => {
    expect(Object.keys(barrel.Field).toSorted()).toStrictEqual([
      "Control",
      "Counter",
      "ErrorText",
      "HelperText",
      "Label",
      "RequiredIndicator",
      "Root",
      "Textarea",
      "useField",
    ]);
  });

  it("exports no recipe binding or hook at the top level", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
