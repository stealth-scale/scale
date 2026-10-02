import { describe, expect, it } from "vitest";

import { BRANCHED, EXPANDING, SELECTING, tableOf } from "#data-table/data-table.fixtures.tsx";
import {
  checkedOf,
  detailableOf,
  detailedOf,
  detailIdOf,
  detailOf,
  everySelectedOf,
  expandedOf,
  lineKeyOf,
  pinIdOf,
  pinnableOf,
  pinOf,
  recordIdOf,
  regionsOf,
  rowIdOf,
  selectableOf,
  selectedOf,
  selectsOf,
} from "#data-table/rows.ts";

/**
 * Returns a table row whose `data-key` is the key given.
 */
function keyed(key: string): HTMLTableRowElement {
  const row = document.createElement("tr");

  row.dataset["key"] = key;

  return row;
}

/**
 * Returns each placed row as its id, its region and whether it ends its region, under the pins
 * given.
 */
function placesOf(top: string[], bottom: string[]): string[] {
  const table = tableOf({ initialState: { rowPinning: { bottom, top } } });

  return regionsOf(table).map(
    ({ ends, region, row }) => `${row.id}:${region}${ends ? ":end" : ""}`,
  );
}

describe("rows", () => {
  it("places every row in the center while no row is pinned", () => {
    expect(placesOf([], []).every((place) => /^Account \d+:center$/u.test(place))).toBe(true);
  });

  it("places the rows pinned to the top first in their pinned order", () => {
    expect(placesOf(["Account 05", "Account 02"], []).slice(0, 3)).toStrictEqual([
      "Account 05:top",
      "Account 02:top:end",
      "Account 01:center",
    ]);
  });

  it("places the rows pinned to the bottom last after the center's last row", () => {
    expect(placesOf([], ["Account 01"]).slice(-2)).toStrictEqual([
      "Account 12:center:end",
      "Account 01:bottom",
    ]);
  });

  it("returns no rows for a table without records", () => {
    expect(regionsOf(tableOf({ data: [] }))).toStrictEqual([]);
  });

  it.each([
    { id: "Account 02", want: "top" },
    { id: "Account 03", want: "bottom" },
    { id: "Account 04", want: false },
  ])("returns $want as the region of $id", ({ id, want }) => {
    const table = tableOf({
      initialState: { rowPinning: { bottom: ["Account 03"], top: ["Account 02"] } },
    });

    expect(pinOf(table, id)).toBe(want);
  });

  it("returns false for a row the table does not let pin", () => {
    const table = tableOf({ enableRowPinning: (row) => row.id !== "Account 03" });

    expect(pinnableOf(table, "Account 03")).toBe(false);
  });

  it("returns true for a row the table lets pin", () => {
    expect(pinnableOf(tableOf(), "Account 03")).toBe(true);
  });

  it("returns true for a selected row", () => {
    const table = tableOf({ initialState: { rowSelection: { "Account 01": true } } });

    expect(selectedOf(table, "Account 01")).toBe(true);
  });

  it("returns false for a row that is not selected", () => {
    expect(selectedOf(tableOf(), "Account 01")).toBe(false);
  });

  it("returns false for a row the table does not let select", () => {
    const table = tableOf({ enableRowSelection: (row) => row.id !== "Account 03" });

    expect(selectableOf(table, "Account 03")).toBe(false);
  });

  it("returns false for every selected state while no row is selected", () => {
    expect(everySelectedOf(tableOf())).toBe(false);
  });

  it("returns indeterminate while some rows are selected", () => {
    const table = tableOf({ initialState: { rowSelection: { "Account 01": true } } });

    expect(everySelectedOf(table)).toBe("indeterminate");
  });

  it("returns true while every row is selected", () => {
    const table = tableOf();
    const every = Object.fromEntries(
      table.getCoreRowModel().rows.map((row) => [row.id, true as const]),
    );

    expect(everySelectedOf(tableOf({ initialState: { rowSelection: every } }))).toBe(true);
  });

  it("returns true for a table with a visible selecting column", () => {
    expect(selectsOf(tableOf({ columns: SELECTING }))).toBe(true);
  });

  it("returns false for a table whose selecting column is hidden", () => {
    const table = tableOf({
      columns: SELECTING,
      initialState: { columnVisibility: { select: false } },
    });

    expect(selectsOf(table)).toBe(false);
  });

  it("returns false for a table without a selecting column", () => {
    expect(selectsOf(tableOf())).toBe(false);
  });

  it("returns false for a row that is not expanded", () => {
    expect(expandedOf(tableOf(), "Account 01")).toBe(false);
  });

  it("returns true for a row the state expands by id", () => {
    const table = tableOf({ initialState: { expanded: { "Account 01": true } } });

    expect(expandedOf(table, "Account 01")).toBe(true);
  });

  it("returns true for every row while the state expands every row", () => {
    expect(expandedOf(tableOf({ initialState: { expanded: true } }), "Account 07")).toBe(true);
  });

  it("returns false for a detail of a row the table does not let expand", () => {
    expect(detailableOf(tableOf(), "Account 01")).toBe(false);
  });

  it("returns true for a detail of a row the table lets expand", () => {
    expect(detailableOf(tableOf({ getRowCanExpand: () => true }), "Account 01")).toBe(true);
  });

  it("returns false for a detail of a row with sub-rows", () => {
    const table = tableOf({ ...BRANCHED, getRowCanExpand: () => true });

    expect(detailableOf(table, "North")).toBe(false);
  });

  it("returns true as the box of a selected row", () => {
    const table = tableOf({ ...BRANCHED, initialState: { rowSelection: { Central: true } } });

    expect(checkedOf(table, "Central")).toBe(true);
  });

  it("returns true as the box of a row whose every sub-row is selected", () => {
    const table = tableOf({
      ...BRANCHED,
      initialState: { rowSelection: { "Oslo East": true, "Oslo West": true } },
    });

    expect(checkedOf(table, "Oslo")).toBe(true);
  });

  it("returns indeterminate as the box of a row with some sub-rows selected", () => {
    const table = tableOf({ ...BRANCHED, initialState: { rowSelection: { "Oslo East": true } } });

    expect(checkedOf(table, "Oslo")).toBe("indeterminate");
  });

  it("returns false as the box of a row without a selected sub-row", () => {
    expect(checkedOf(tableOf(BRANCHED), "South")).toBe(false);
  });

  it("returns true for an expanded row while a column renders details", () => {
    const table = tableOf({
      columns: EXPANDING,
      initialState: { expanded: { "Account 02": true } },
    });

    expect(detailedOf(table, table.getRow("Account 02"), true, false)).toBe(true);
  });

  it("returns false for a row that is not expanded while a column renders details", () => {
    const table = tableOf({ columns: EXPANDING });

    expect(detailedOf(table, table.getRow("Account 02"), true, false)).toBe(false);
  });

  it("returns false for an expanded row with sub-rows", () => {
    const table = tableOf({ ...BRANCHED, initialState: { expanded: { North: true } } });

    expect(detailedOf(table, table.getRow("North"), true, true)).toBe(false);
  });

  it("returns true for an expanded row that waits for sub-rows in a table with levels", () => {
    const table = tableOf({
      ...BRANCHED,
      getRowCanExpand: () => true,
      initialState: { expanded: { Central: true } },
    });

    expect(detailedOf(table, table.getRow("Central"), false, true)).toBe(true);
  });

  it("returns false for an expanded row that cannot expand in a table with levels", () => {
    const table = tableOf({ ...BRANCHED, initialState: { expanded: true } });

    expect(detailedOf(table, table.getRow("Central"), false, true)).toBe(false);
  });

  it("returns false for an expanded row in a table without details or levels", () => {
    const table = tableOf({
      getRowCanExpand: () => true,
      initialState: { expanded: { "Account 02": true } },
    });

    expect(detailedOf(table, table.getRow("Account 02"), false, false)).toBe(false);
  });

  it("encodes the record's id into the row's id", () => {
    expect(rowIdOf("r1", "Account 01")).toBe("r1-row-Account%2001");
  });

  it("returns the record's id of a record's row", () => {
    expect(recordIdOf(keyed("record:Account 01"))).toBe("Account 01");
  });

  it("returns undefined for the detail row under a record", () => {
    expect(recordIdOf(keyed("detail:Account 01"))).toBeUndefined();
  });

  it("returns undefined for a row without a key", () => {
    expect(recordIdOf(document.createElement("tr"))).toBeUndefined();
  });

  it("returns undefined for an element that is not a row", () => {
    expect(recordIdOf(document.createElement("td"))).toBeUndefined();
  });

  it("returns the detail of the column that states one", () => {
    const detail = detailOf(tableOf({ columns: EXPANDING }));

    expect(detail?.({ account: "Account 01", amount: 0, region: "North" })).toBe(
      "Account 01 is in the North region.",
    );
  });

  it("returns undefined for a table without a detail column", () => {
    expect(detailOf(tableOf())).toBeUndefined();
  });

  it("returns undefined while the detail column is hidden", () => {
    const table = tableOf({
      columns: EXPANDING,
      initialState: { columnVisibility: { expand: false } },
    });

    expect(detailOf(table)).toBeUndefined();
  });

  it("encodes the row's id into the detail row's id", () => {
    expect(detailIdOf("r1", "Account 01")).toBe("r1-detail-Account%2001");
  });

  it("encodes the row's id into the pin toggle's id", () => {
    expect(pinIdOf("r1", "Account 01")).toBe("r1-pin-Account%2001");
  });

  it.each([
    { detail: false, want: "record:Account 01" },
    { detail: true, want: "detail:Account 01" },
  ])("returns $want as the key of a line whose detail is $detail", ({ detail, want }) => {
    expect(lineKeyOf("Account 01", detail)).toBe(want);
  });
});
