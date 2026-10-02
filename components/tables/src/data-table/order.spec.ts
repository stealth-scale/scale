import { describe, expect, it } from "vitest";

import { SELECTING, tableOf } from "#data-table/data-table.fixtures.tsx";
import { listedOf, reordered, visibleOf } from "#data-table/order.ts";
import { type DataTableApi } from "#data-table/use-data-table.ts";

/**
 * Returns a table over the selecting columns with the visibility given.
 */
function selectingOf(columnVisibility: Record<string, boolean> = {}): DataTableApi {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the readers read records as RowData
  return tableOf({
    columns: SELECTING,
    initialState: { columnVisibility },
  }) as unknown as DataTableApi;
}

describe("order", () => {
  it("lists every leaf column that can hide in the table's order", () => {
    expect(listedOf(selectingOf()).map((column) => column.id)).toStrictEqual([
      "account",
      "region",
      "amount",
    ]);
  });

  it("returns true for a column the table shows", () => {
    expect(visibleOf(selectingOf(), "region")).toBe(true);
  });

  it("returns false for a column the table hides", () => {
    expect(visibleOf(selectingOf({ region: false }), "region")).toBe(false);
  });

  it("orders the listed columns anew and keeps every other column at its place", () => {
    expect(
      reordered(["select", "account", "region", "amount"], ["amount", "account", "region"]),
    ).toStrictEqual(["select", "amount", "account", "region"]);
  });
});
