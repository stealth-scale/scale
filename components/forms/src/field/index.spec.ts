import { describe, expect, it } from "vitest";

import * as barrel from "#field/index.ts";

describe("index", () => {
  it("exports the eight parts and the hook that reads the field's state", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
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

  it("exports no recipe binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|PropsProvider)/u);
    }
  });
});
