import { describe, expect, it } from "vitest";

import { GROUPED, tableOf } from "#data-table/data-table.fixtures.tsx";
import { rowsOf } from "#data-table/headers.ts";

/**
 * Returns each header row's cells as the column id and the row span.
 */
function spansOf(
  columns?: typeof GROUPED,
): ReadonlyArray<ReadonlyArray<readonly [string, number]>> {
  const table = tableOf(columns === undefined ? {} : { columns });

  return rowsOf(table.getHeaderGroups()).map((row) =>
    row.slots.map((slot) => [slot.header.column.id, slot.rowSpan] as const),
  );
}

describe("rowsOf", () => {
  it("returns one row of single-row cells for columns without groups", () => {
    expect(spansOf()).toStrictEqual([
      [
        ["account", 1],
        ["region", 1],
        ["amount", 1],
      ],
    ]);
  });

  it("spans a column no group spans over every header row", () => {
    expect(spansOf(GROUPED)[0]).toStrictEqual([
      ["account", 2],
      ["figures", 1],
    ]);
  });

  it("returns the grouped columns in the row below their group", () => {
    expect(spansOf(GROUPED)[1]).toStrictEqual([
      ["region", 1],
      ["amount", 1],
    ]);
  });

  it("returns the column's own header in place of its placeholder", () => {
    const table = tableOf({ columns: GROUPED });
    const [first] = rowsOf(table.getHeaderGroups());

    expect(first?.slots[0]?.header.isPlaceholder).toBe(false);
  });

  it("keys each row by its header group's id", () => {
    const table = tableOf({ columns: GROUPED });

    expect(rowsOf(table.getHeaderGroups()).map((row) => row.id)).toStrictEqual(
      table.getHeaderGroups().map((group) => group.id),
    );
  });
});
