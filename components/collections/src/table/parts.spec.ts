import { describe, expect, it } from "vitest";

import * as parts from "#table/parts.ts";

describe("parts", () => {
  it("exports every part", () => {
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

  it("exports no Simple", () => {
    expect(Object.keys(parts)).not.toContain("Simple");
  });
});
