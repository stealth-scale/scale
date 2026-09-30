import { describe, expect, it } from "vitest";

import { createColumnHelper } from "#data-table/column-helper.ts";
import {
  fitOf,
  footedOf,
  hideableOf,
  labelOf,
  nameIdOf,
  pinnedOf,
  placementOf,
  regionOf,
  sizedOf,
  sortOf,
  spanEndOf,
  spansOf,
} from "#data-table/columns.ts";
import {
  type Entry,
  FOOTED,
  SELECTING,
  SPANNING,
  tableOf,
} from "#data-table/data-table.fixtures.tsx";
import { type DataTableOptions } from "#data-table/use-data-table.ts";

/**
 * Returns whether the amount column may hide in a table with the options given.
 */
function amountHides(options: Partial<DataTableOptions<Entry>>): boolean {
  const table = tableOf(options);
  const amount = table.getColumn("amount");

  return amount !== undefined && hideableOf(table, amount);
}

const column = createColumnHelper<Entry>();

/**
 * Returns the name of the amount column the given definition renders.
 */
function nameOf(amount: ReturnType<typeof column.accessor<"amount", number>>): string {
  const table = tableOf({ columns: column.columns([amount]) });
  const [leaf] = table.getAllLeafColumns();

  return leaf === undefined ? "" : labelOf(leaf);
}

/**
 * Returns the attributes of each column's cells under the pins given.
 */
function pinsOf(start: string[], end: string[]): ReadonlyArray<ReturnType<typeof pinnedOf>> {
  const table = tableOf({ initialState: { columnPinning: { end, start } } });

  return table.getAllLeafColumns().map((leaf) => pinnedOf(table, leaf));
}

describe("columns", () => {
  it("returns undefined for a column that is not sorted", () => {
    expect(sortOf(tableOf(), "amount")).toBeUndefined();
  });

  it("returns ascending for a column sorted ascending", () => {
    const table = tableOf({ initialState: { sorting: [{ desc: false, id: "amount" }] } });

    expect(sortOf(table, "amount")).toBe("ascending");
  });

  it("returns descending for a column sorted descending", () => {
    const table = tableOf({ initialState: { sorting: [{ desc: true, id: "amount" }] } });

    expect(sortOf(table, "amount")).toBe("descending");
  });

  it.each([
    { end: [], start: ["amount"], want: "start" },
    { end: ["amount"], start: [], want: "end" },
    { end: [], start: [], want: false },
  ])(
    "returns $want as the region of a column pinned to $start and $end",
    ({ end, start, want }) => {
      const table = tableOf({ initialState: { columnPinning: { end, start } } });

      expect(regionOf(table, "amount")).toBe(want);
    },
  );

  it("lets a column hide while another column that can hide is visible", () => {
    expect(amountHides({})).toBe(true);
  });

  it("keeps the last visible column that can hide", () => {
    expect(
      amountHides({ initialState: { columnVisibility: { account: false, region: false } } }),
    ).toBe(false);
  });

  it("keeps a column that cannot hide", () => {
    expect(amountHides({ enableHiding: false })).toBe(false);
  });

  it("returns the header of a column whose header is a string", () => {
    expect(nameOf(column.accessor("amount", { header: "Amount" }))).toBe("Amount");
  });

  it("returns meta.label over the header", () => {
    expect(
      nameOf(column.accessor("amount", { header: () => "Σ", meta: { label: "Amount paid" } })),
    ).toBe("Amount paid");
  });

  it("returns the column's id when the header is not a string", () => {
    expect(nameOf(column.accessor("amount", { header: () => "Σ" }))).toBe("amount");
  });

  it("returns data-fit for a column that states meta.fit", () => {
    const [select] = tableOf({ columns: SELECTING }).getAllLeafColumns();

    expect(select === undefined ? undefined : fitOf(select)).toStrictEqual({ "data-fit": "" });
  });

  it("returns no attribute for a column that states no fit", () => {
    const [account] = tableOf().getAllLeafColumns();

    expect(account === undefined ? undefined : fitOf(account)).toStrictEqual({});
  });

  it("returns no spans for a cell that spans one row and one column", () => {
    const [cell] = tableOf().getRowModel().rows[0]?.getVisibleCells() ?? [];

    expect(cell === undefined ? undefined : spansOf(cell)).toStrictEqual({});
  });

  it("returns the rows a cell spans while its column spans equal values", () => {
    const table = tableOf({
      columns: SPANNING,
      initialState: { sorting: [{ desc: true, id: "region" }] },
    });
    const region = table.getRowModel().rows[0]?.getAllCellsByColumnId()["region"];

    expect(region === undefined ? undefined : spansOf(region)).toStrictEqual({ rowSpan: 6 });
  });

  it.each([
    { at: 7, label: "ends on the last row", want: { "data-span-end": "" } },
    { at: 0, label: "ends before the last row", want: {} },
  ])("returns $want as the span end of a spanning cell that $label", ({ at, want }) => {
    const table = tableOf({
      columns: SPANNING,
      initialState: { sorting: [{ desc: true, id: "region" }] },
    });
    const region = table.getRowModel().rows[at]?.getAllCellsByColumnId()["region"];

    expect(region === undefined ? undefined : spanEndOf(table, region)).toStrictEqual(want);
  });

  it("returns no span end for a cell that spans one row", () => {
    const table = tableOf();
    const [cell] = table.getRowModel().rows.at(-1)?.getVisibleCells() ?? [];

    expect(cell === undefined ? undefined : spanEndOf(table, cell)).toStrictEqual({});
  });

  it("returns the columns a cell spans while its column states a span", () => {
    const table = tableOf({ columns: SPANNING });
    const account = table.getRowModel().rows[0]?.getAllCellsByColumnId()["account"];

    expect(account === undefined ? undefined : spansOf(account)).toStrictEqual({ colSpan: 2 });
  });

  it("encodes the header's id in the id of its name", () => {
    expect(nameIdOf("table", "net amount")).toBe("table-name-net%20amount");
  });

  it("lays out a table without pins or resizing by its content", () => {
    expect(sizedOf(tableOf())).toBe(false);
  });

  it("sizes the columns of a table that resizes", () => {
    expect(sizedOf(tableOf({ enableColumnResizing: true }))).toBe(true);
  });

  it("sizes the columns of a table with a pinned column", () => {
    const table = tableOf({ initialState: { columnPinning: { end: [], start: ["account"] } } });

    expect(sizedOf(table)).toBe(true);
  });

  it("returns no attributes for a column that is not pinned", () => {
    expect(pinsOf([], [])[1]).toStrictEqual({});
  });

  it("pins the first start column at no offset away from the region's edge", () => {
    expect(pinsOf(["account", "region"], [])[0]).toStrictEqual({
      "data-pinned": "start",
      style: { "--pin-offset": "0px" },
    });
  });

  it("pins the last start column after the columns before it at the region's edge", () => {
    expect(pinsOf(["account", "region"], [])[1]).toStrictEqual({
      "data-pinned": "start",
      "data-pinned-edge": "",
      style: { "--pin-offset": "150px" },
    });
  });

  it("pins the first end column at the region's edge after the columns after it", () => {
    expect(pinsOf([], ["region", "amount"])[1]).toStrictEqual({
      "data-pinned": "end",
      "data-pinned-edge": "",
      style: { "--pin-offset": "150px" },
    });
  });

  it("opens a panel under the header's end for a column of figures", () => {
    const amount = tableOf().getColumn("amount");

    expect(amount === undefined ? undefined : placementOf(amount)).toBe("bottom-end");
  });

  it("opens a panel under the header's start for a column of words", () => {
    const account = tableOf().getColumn("account");

    expect(account === undefined ? undefined : placementOf(account)).toBe("bottom-start");
  });

  it("returns true for footed while a visible column states a footer", () => {
    expect(footedOf(tableOf({ columns: FOOTED }))).toBe(true);
  });

  it("returns false for footed while no visible column states a footer", () => {
    expect(footedOf(tableOf())).toBe(false);
  });
});
