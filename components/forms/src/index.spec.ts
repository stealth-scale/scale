import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("exports every component of the package and nothing else", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Checkbox",
      "Field",
      "Fieldset",
      "Input",
      "InputGroup",
      "InputPropsProvider",
      "SearchInput",
      "Switch",
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
