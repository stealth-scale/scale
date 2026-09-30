import { describe, expect, it } from "vitest";

import * as barrel from "#data-table/index.ts";

describe("index", () => {
  it("exports the parts beside the hook and the column factories only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "ColumnFilter",
      "ColumnManager",
      "ColumnMenu",
      "PageSize",
      "Pagination",
      "Root",
      "Search",
      "Table",
      "createColumnHelper",
      "expandColumn",
      "pinColumn",
      "pivot",
      "selectColumn",
      "useDataTable",
    ]);
  });
});
