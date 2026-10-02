import { describe, expect, it } from "vitest";

import { createColumnHelper } from "#data-table/column-helper.ts";
import {
  BRANCHED,
  type Entry,
  SELECTING,
  SUMMED,
  tableOf,
} from "#data-table/data-table.fixtures.tsx";
import {
  BRANCHES,
  branchOf,
  leveledOf,
  levelMarksOf,
  levelsOf,
  moveOf,
  positionsOf,
  stepOf,
  treeColumnOf,
  UNLEVELED,
  type Walk,
} from "#data-table/levels.ts";
import { regionsOf } from "#data-table/rows.ts";
import { selectColumn } from "#data-table/select-column.tsx";
import { type DataTableOptions } from "#data-table/use-data-table.ts";
import { untyped } from "#data-table/windowed.fixtures.ts";

const column = createColumnHelper<Entry>();

const UNHEADED = column.columns([
  selectColumn<Entry>({ allLabel: "Select every entry", label: (entry) => entry.account }),
  column.accessor("region", { header: "Region" }),
  column.accessor("account", { header: "Account" }),
]);

const UNLEVELED_LEVELS = {
  ...UNLEVELED,
  detailed: false,
  grouped: 0,
  positions: new Map(),
  tree: undefined,
};

/**
 * Returns a walk over a table of the tree, with North open unless stated.
 */
function walkOf(given: Partial<DataTableOptions<Entry>> = {}): Walk {
  const table = untyped(
    tableOf({ ...BRANCHED, initialState: { expanded: { North: true } }, ...given }),
  );

  return { detailed: false, rows: regionsOf(table).map(({ row }) => row), table };
}

describe("levels", () => {
  it("returns false for a table without sub-rows or grouping", () => {
    expect(leveledOf(untyped(tableOf()))).toBe(false);
  });

  it("returns true for a table that states getSubRows", () => {
    expect(leveledOf(untyped(tableOf(BRANCHED)))).toBe(true);
  });

  it("returns true for a table that groups its rows", () => {
    expect(leveledOf(untyped(tableOf({ initialState: { grouping: ["region"] } })))).toBe(true);
  });

  it.each([
    { id: "North", want: { index: 1, size: 3 } },
    { id: "Central", want: { index: 3, size: 3 } },
    { id: "Bergen", want: { index: 2, size: 2 } },
    { id: "Oslo West", want: { index: 2, size: 2 } },
  ])("returns $want as the place of $id", ({ id, want }) => {
    expect(positionsOf(untyped(tableOf(BRANCHED))).get(id)).toStrictEqual(want);
  });

  it("returns the places of the sorted rows", () => {
    const table = tableOf({
      ...BRANCHED,
      initialState: { sorting: [{ desc: true, id: "account" }] },
    });

    expect(positionsOf(untyped(table)).get("South")).toStrictEqual({ index: 1, size: 3 });
  });

  it("returns the places of the group rows and their records", () => {
    const table = untyped(tableOf({ columns: SUMMED, initialState: { grouping: ["region"] } }));
    const positions = positionsOf(table);

    expect([positions.get("region:South"), positions.get("Account 04")]).toStrictEqual([
      { index: 2, size: 2 },
      { index: 2, size: 6 },
    ]);
  });

  it("returns no tree column for a table that states no getSubRows", () => {
    expect(treeColumnOf(untyped(tableOf()))).toBeUndefined();
  });

  it("returns the row-header column as the tree column", () => {
    expect(treeColumnOf(untyped(tableOf({ ...BRANCHED, columns: SELECTING })))).toBe("account");
  });

  it("returns the first column with an accessor without a row-header column", () => {
    expect(treeColumnOf(untyped(tableOf({ ...BRANCHED, columns: UNHEADED })))).toBe("region");
  });

  it("returns no levels for a table without levels", () => {
    expect(levelsOf(untyped(tableOf()), UNLEVELED)).toBeUndefined();
  });

  it("returns the grouping's depth and the tree column as the levels", () => {
    const table = untyped(tableOf({ ...BRANCHED, initialState: { grouping: ["region"] } }));
    const levels = levelsOf(table, { active: "North", branches: BRANCHES });

    expect([levels?.active, levels?.grouped, levels?.tree, levels?.detailed]).toStrictEqual([
      "North",
      1,
      "account",
      false,
    ]);
  });

  it("returns true for a row with sub-rows", () => {
    expect(branchOf(untyped(tableOf(BRANCHED)).getRow("North"), true)).toBe(true);
  });

  it("returns false for a row without sub-rows the table does not let expand", () => {
    expect(branchOf(untyped(tableOf(BRANCHED)).getRow("Central"), false)).toBe(false);
  });

  it("returns true for a row the table lets expand while no column renders details", () => {
    const table = untyped(tableOf({ ...BRANCHED, getRowCanExpand: () => true }));

    expect(branchOf(table.getRow("Central"), false)).toBe(true);
  });

  it("returns false for a row the table lets expand while a column renders details", () => {
    const table = untyped(tableOf({ ...BRANCHED, getRowCanExpand: () => true }));

    expect(branchOf(table.getRow("Central"), true)).toBe(false);
  });

  it("returns the marks of a closed row with sub-rows that has the tab stop", () => {
    const table = untyped(tableOf({ ...BRANCHED, initialState: { expanded: { North: true } } }));
    const levels = levelsOf(table, { active: "Oslo", branches: BRANCHES });

    expect(
      levelMarksOf(table, table.getRow("Oslo"), levels ?? UNLEVELED_LEVELS, "p"),
    ).toStrictEqual({
      "aria-expanded": false,
      "aria-level": 2,
      "aria-posinset": 1,
      "aria-setsize": 2,
      "data-key": "record:Oslo",
      id: "p-row-Oslo",
      tabIndex: 0,
    });
  });

  it("states no state on a row that opens nothing", () => {
    const table = untyped(tableOf({ ...BRANCHED, initialState: { expanded: { North: true } } }));
    const levels = levelsOf(table, UNLEVELED) ?? UNLEVELED_LEVELS;

    expect(levelMarksOf(table, table.getRow("Bergen"), levels, "p")).not.toHaveProperty(
      "aria-expanded",
    );
  });

  it("states no place on a row outside the rows before expansion", () => {
    const table = untyped(tableOf(BRANCHED));

    expect(levelMarksOf(table, table.getRow("North"), UNLEVELED_LEVELS, "p")).not.toHaveProperty(
      "aria-posinset",
    );
  });

  it.each([
    { key: "ArrowDown", want: "next" },
    { key: "ArrowUp", want: "previous" },
    { key: "Home", want: "first" },
    { key: "End", want: "last" },
    { key: "ArrowRight", want: "open" },
    { key: "ArrowLeft", want: "close" },
    { key: "Enter", want: "toggle" },
    { key: " ", want: "toggle" },
    { key: "a", want: undefined },
  ])("returns $want as the move of $key left to right", ({ key, want }) => {
    expect(moveOf(key, false)).toBe(want);
  });

  it.each([
    { key: "ArrowRight", want: "close" },
    { key: "ArrowLeft", want: "open" },
    { key: "ArrowDown", want: "next" },
    { key: "a", want: undefined },
  ])("returns $want as the move of $key right to left", ({ key, want }) => {
    expect(moveOf(key, true)).toBe(want);
  });

  it.each([
    { from: "North", move: "next", want: { focus: "Oslo" } },
    { from: "Oslo", move: "previous", want: { focus: "North" } },
    { from: "North", move: "previous", want: {} },
    { from: "Central", move: "next", want: {} },
    { from: "Bergen", move: "first", want: { focus: "North" } },
    { from: "North", move: "last", want: { focus: "Central" } },
  ] as const)("returns $want for $move from $from", ({ from, move, want }) => {
    expect(stepOf(walkOf(), from, move)).toStrictEqual(want);
  });

  it.each([
    { from: "Oslo", move: "open", want: { expanded: true } },
    { from: "North", move: "open", want: { focus: "Oslo" } },
    { from: "Bergen", move: "open", want: {} },
    { from: "North", move: "close", want: { expanded: false } },
    { from: "Bergen", move: "close", want: { focus: "North" } },
    { from: "Oslo", move: "close", want: { focus: "North" } },
    { from: "Central", move: "close", want: {} },
    { from: "South", move: "toggle", want: { expanded: true } },
    { from: "North", move: "toggle", want: { expanded: false } },
    { from: "Central", move: "toggle", want: {} },
  ] as const)("returns $want for $move on $from", ({ from, move, want }) => {
    expect(stepOf(walkOf(), from, move)).toStrictEqual(want);
  });

  it.each(["Bergen", "Central"])(
    "returns no step for open on the open row %s while its sub-rows have not arrived",
    (from) => {
      const walk = walkOf({
        getRowCanExpand: () => true,
        initialState: { expanded: { Bergen: true, Central: true, North: true } },
      });

      expect(stepOf(walk, from, "open")).toStrictEqual({});
    },
  );

  it("returns no step from a row the walk does not contain", () => {
    expect(stepOf(walkOf(), "Lisbon", "next")).toStrictEqual({});
  });
});
