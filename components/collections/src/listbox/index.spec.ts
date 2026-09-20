import { describe, expect, it } from "vitest";

import * as barrel from "#listbox/index.ts";

describe("index", () => {
  it("names every part a caller composes", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Content",
      "Empty",
      "Input",
      "Item",
      "ItemCheckbox",
      "ItemDescription",
      "ItemGroup",
      "ItemGroupLabel",
      "ItemIndicator",
      "ItemLines",
      "ItemText",
      "Label",
      "Root",
      "Row",
      "SelectAll",
      "Simple",
      "ValueText",
      "Window",
    ]);
  });

  it("publishes neither the recipe nor the binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
