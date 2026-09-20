import { describe, expect, it } from "vitest";

import * as parts from "#table/parts.ts";

describe("parts", () => {
  it("names every part a table is built from", () => {
    expect(Object.keys(parts).toSorted()).toStrictEqual([
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
      "Sorter",
    ]);
  });

  it("holds back the whole table that is built from these", () => {
    expect(Object.keys(parts)).not.toContain("Simple");
  });
});
