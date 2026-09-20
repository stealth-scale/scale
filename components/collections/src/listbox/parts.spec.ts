import { describe, expect, it } from "vitest";

import * as parts from "#listbox/parts.ts";

describe("parts", () => {
  it("names every part the ready-made components are built from", () => {
    expect(Object.keys(parts).toSorted()).toStrictEqual([
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
      "SelectAll",
      "ValueText",
      "Window",
    ]);
  });

  it("holds back the ready-made components that are built from these", () => {
    expect(Object.keys(parts)).not.toContain("Row");
    expect(Object.keys(parts)).not.toContain("Simple");
  });
});
