import { describe, expect, it } from "vitest";

import { type Entry } from "#data-table/data-table.fixtures.tsx";
import { selectColumn } from "#data-table/select-column.tsx";

const COLUMN = selectColumn<Entry>({
  allLabel: "Select every entry",
  label: (entry) => entry.account,
});

describe("selectColumn", () => {
  it("sets the id select", () => {
    expect(COLUMN.id).toBe("select");
  });

  it("marks the column as one that selects rows and fits its content", () => {
    expect(COLUMN.meta).toStrictEqual({ fit: true, selects: true });
  });

  it("sets the column's size to 60 pixels", () => {
    expect(COLUMN.size).toBe(60);
  });

  it("bounds the column's size at 60 pixels whatever the table's default column states", () => {
    expect([COLUMN.minSize, COLUMN.maxSize]).toStrictEqual([60, 60]);
  });

  it.each([
    "enableCellSelection",
    "enableColumnFilter",
    "enableGlobalFilter",
    "enableGrouping",
    "enableHiding",
    "enableResizing",
    "enableSorting",
  ] as const)("turns %s off", (option) => {
    expect(COLUMN[option]).toBe(false);
  });
});
