import { describe, expect, it } from "vitest";

import * as barrel from "#sortable/index.ts";

describe("index", () => {
  it("exports the parts with useMove", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Board",
      "Empty",
      "Handle",
      "Item",
      "ItemContent",
      "Items",
      "List",
      "Root",
      "useMove",
    ]);
  });

  it("exports neither the recipe nor the binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with)/u);
    }
  });
});
