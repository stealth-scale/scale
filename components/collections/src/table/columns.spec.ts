import { describe, expect, it } from "vitest";

import { type Column, depth, leaves, named, spans } from "#table/columns.ts";

/**
 * Describes one record of the fixture.
 */
interface Account {
  /**
   * Amount of the account.
   */
  amount: string;

  /**
   * Name of the account.
   */
  name: string;
}

/**
 * A row-header column beside a numeric column.
 */
const FLAT: ReadonlyArray<Column<Account>> = [
  { key: "name", label: "Account", rowHeader: true },
  { key: "amount", label: "Amount", numeric: true },
];

/**
 * A leaf column beside a branch over two leaves.
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
  it("returns true for a branch and false for a leaf", () => {
    expect(SPANNED.map((column) => spans(column))).toStrictEqual([false, true]);
  });
});

describe("leaves", () => {
  it("returns flat columns unchanged", () => {
    expect(leaves(FLAT).map((column) => column.key)).toStrictEqual(["name", "amount"]);
  });

  it("flattens a branch to its leaves in render order", () => {
    expect(leaves(SPANNED).map((column) => column.key)).toStrictEqual(["name", "jan", "feb"]);
  });
});

describe("depth", () => {
  it("returns 1 for flat columns", () => {
    expect(depth(FLAT)).toBe(1);
  });

  it("returns one more per level of branches", () => {
    expect(depth(SPANNED)).toBe(2);
  });

  it("returns 1 for no columns", () => {
    expect(depth([])).toBe(1);
  });
});

describe("named", () => {
  it("returns one header row for flat columns", () => {
    expect(named(FLAT)).toHaveLength(1);
  });

  it("spans every flat header one column and one row", () => {
    expect(named(FLAT)[0]).toMatchObject([
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
    ]);
  });

  it("returns one header row per level", () => {
    expect(named(SPANNED)).toHaveLength(2);
  });

  it("spans a branch across its leaves", () => {
    expect(named(SPANNED)[0]?.[1]).toMatchObject({ colSpan: 2, label: "Q1", rowSpan: 1 });
  });

  it("spans a leaf beside a branch down every header row", () => {
    expect(named(SPANNED)[0]?.[0]).toMatchObject({ colSpan: 1, label: "Account", rowSpan: 2 });
  });

  it("returns a branch's leaves on the next header row", () => {
    expect(named(SPANNED)[1]?.map((name) => name.key)).toStrictEqual(["jan", "feb"]);
  });

  it("keys a branch by its first leaf", () => {
    expect(named(SPANNED)[0]?.[1]?.key).toBe("jan");
  });

  it("keys a branch without leaves by an empty string", () => {
    expect(named([{ columns: [], label: "Empty" }])[0]?.[0]?.key).toBe("");
  });

  it("returns the leaf on a leaf's header", () => {
    expect(named(SPANNED)[0]?.[0]?.column?.key).toBe("name");
  });

  it("returns no leaf on a branch's header", () => {
    expect(named(SPANNED)[0]?.[1]?.column).toBeUndefined();
  });
});
