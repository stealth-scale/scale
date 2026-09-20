import { describe, expect, it } from "vitest";

import { type Column, depth, leaves, named, spans } from "#table/columns.ts";

/**
 * Describes one record the columns read.
 */
interface Account {
  /**
   * What the account came to.
   */
  amount: string;

  /**
   * The account's name.
   */
  name: string;
}

/**
 * A flat list of columns, none of them spanning.
 */
const FLAT: ReadonlyArray<Column<Account>> = [
  { key: "name", label: "Account", rowHeader: true },
  { key: "amount", label: "Amount", numeric: true },
];

/**
 * A list holding a name over two columns beside a column of its own.
 */
const SPANNED: ReadonlyArray<Column<Account>> = [
  { key: "name", label: "Account", rowHeader: true },
  {
    columns: [
      { key: "jan", label: "Jan" },
      { key: "feb", label: "Feb" },
    ],
    label: "Q1",
  },
];

describe("spans", () => {
  it("tells a name over columns from a column of values", () => {
    expect(SPANNED.map((column) => spans(column))).toStrictEqual([false, true]);
  });
});

describe("leaves", () => {
  it("answers the columns themselves where none of them span", () => {
    expect(leaves(FLAT).map((column) => column.key)).toStrictEqual(["name", "amount"]);
  });

  it("flattens a spanning name to the columns beneath it in the order they are drawn", () => {
    expect(leaves(SPANNED).map((column) => column.key)).toStrictEqual(["name", "jan", "feb"]);
  });
});

describe("depth", () => {
  it("answers one row of names for a list where nothing spans", () => {
    expect(depth(FLAT)).toBe(1);
  });

  it("answers a row per level of naming", () => {
    expect(depth(SPANNED)).toBe(2);
  });

  it("answers one row for a list of no columns at all", () => {
    expect(depth([])).toBe(1);
  });
});

describe("named", () => {
  it("draws one row of names where nothing spans", () => {
    expect(named(FLAT)).toHaveLength(1);
  });

  it("gives every name one column and one row where nothing spans", () => {
    expect(named(FLAT)[0]).toMatchObject([
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
    ]);
  });

  it("draws a row per level of naming", () => {
    expect(named(SPANNED)).toHaveLength(2);
  });

  it("spans a name across the columns beneath it", () => {
    expect(named(SPANNED)[0]?.[1]).toMatchObject({ colSpan: 2, label: "Q1", rowSpan: 1 });
  });

  it("takes a name with nothing under it down to the line the deepest name closes on", () => {
    expect(named(SPANNED)[0]?.[0]).toMatchObject({ colSpan: 1, label: "Account", rowSpan: 2 });
  });

  it("draws the spanned columns on the row beneath their name", () => {
    expect(named(SPANNED)[1]?.map((name) => name.key)).toStrictEqual(["jan", "feb"]);
  });

  it("names a spanning row after the first column it spans", () => {
    expect(named(SPANNED)[0]?.[1]?.key).toBe("jan");
  });

  it("names a spanning row after nothing where it spans no columns at all", () => {
    expect(named([{ columns: [], label: "Empty" }])[0]?.[0]?.key).toBe("");
  });

  it("carries the column itself on a name that heads one and not on a name that spans", () => {
    expect(named(SPANNED)[0]?.[0]?.column?.key).toBe("name");
    expect(named(SPANNED)[0]?.[1]?.column).toBeUndefined();
  });
});
