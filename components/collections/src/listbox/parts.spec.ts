import { describe, expect, it } from "vitest";

import * as parts from "#listbox/parts.ts";

describe("parts", () => {
  it("exports every part", () => {
    expect(Object.keys(parts).toSorted()).toStrictEqual([
      "Content",
      "Empty",
      "Frame",
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

  it("exports neither Row nor Simple", () => {
    expect(Object.keys(parts).filter((name) => name === "Row" || name === "Simple")).toStrictEqual(
      [],
    );
  });
});
