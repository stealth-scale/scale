import { describe, expect, it } from "vitest";

import * as barrel from "#table/index.ts";

describe("index", () => {
  it("exports the parts with Simple and the column types", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Body",
      "Caption",
      "Cell",
      "Column",
      "ColumnGroup",
      "ColumnHeader",
      "Footer",
      "Header",
      "Root",
      "Row",
      "RowHeader",
      "Scroller",
      "Simple",
      "Sorter",
    ]);
  });

  it("exports neither the recipe nor the binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
