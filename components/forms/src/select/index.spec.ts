import { describe, expect, it } from "vitest";

import * as barrel from "#select/index.ts";

describe("index", () => {
  it("exports the sixteen parts and no other runtime name", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "ClearTrigger",
      "Content",
      "Control",
      "Indicator",
      "Item",
      "ItemDescription",
      "ItemGroup",
      "ItemGroupLabel",
      "ItemIndicator",
      "ItemLines",
      "ItemText",
      "Label",
      "Positioner",
      "Root",
      "Trigger",
      "ValueText",
    ]);
  });
});
