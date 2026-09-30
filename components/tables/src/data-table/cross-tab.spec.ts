import { describe, expect, it } from "vitest";

import {
  aggregatorOf,
  crossTabOf,
  type CrossTabOptions,
  type PivotAggregate,
  sharesGroupOf,
  textOf,
} from "#data-table/cross-tab.ts";

interface Order {
  readonly amount: number | string;
  readonly group: string;
  readonly part: string;
  readonly period: string;
}

/**
 * Lists one record of 10 in a/one/x, ninety-nine of 90 in a/one/y and one of 5 in b/two/x, so the
 * mean of a/one's two cell averages is 50 while its records average 89.2.
 */
const ORDERS: readonly Order[] = [
  { amount: 10, group: "a", part: "one", period: "x" },
  ...Array.from({ length: 99 }, () => ({ amount: 90, group: "a", part: "one", period: "y" })),
  { amount: 5, group: "b", part: "two", period: "x" },
];

/**
 * Returns twice the number of a cell's records, a caller's aggregate.
 */
function doubled(records: readonly Order[]): number {
  return records.length * 2;
}

/**
 * Returns the options of a cross-tab of orders by group and part per period.
 */
function optionsOf(aggregate: PivotAggregate = "sum"): CrossTabOptions<Order> {
  return {
    aggregate: aggregatorOf<Order>(aggregate, "amount"),
    column: "period",
    rows: ["group", "part"],
  };
}

describe("cross-tab", () => {
  it("returns a cell per row path per column value", () => {
    const tab = crossTabOf(ORDERS, optionsOf());

    expect(tab.rows.map((row) => [row.path, row.cells.map((cell) => cell.value)])).toStrictEqual([
      [
        ["a", "one"],
        [10, 8910],
      ],
      [
        ["b", "two"],
        [5, null],
      ],
    ]);
  });

  it("aggregates a row total from the records", () => {
    const tab = crossTabOf(ORDERS, optionsOf("average"));

    expect(tab.rows[0]?.total.value).toBeCloseTo(89.2, 6);
  });

  it("aggregates the grand total from every record", () => {
    const tab = crossTabOf(ORDERS, optionsOf("average"));

    expect([tab.grandTotal.count, tab.grandTotal.value]).toStrictEqual([101, 8925 / 101]);
  });

  it("aggregates a column total from every record with the column's value", () => {
    const tab = crossTabOf(ORDERS, optionsOf());

    expect(tab.columns[0]).toStrictEqual({ total: { count: 2, value: 15 }, value: "x" });
  });

  it("leaves a cell no record falls into null with a count of zero", () => {
    const tab = crossTabOf(ORDERS, optionsOf());

    expect(tab.rows[1]?.cells[1]).toStrictEqual({ count: 0, value: null });
  });

  it("keeps a cell whose records sum to zero at zero", () => {
    const tab = crossTabOf([{ amount: 0, group: "a", part: "one", period: "x" }], optionsOf());

    expect(tab.rows[0]?.cells[0]).toStrictEqual({ count: 1, value: 0 });
  });

  it("counts a cell's records without a value field", () => {
    const tab = crossTabOf(ORDERS, {
      aggregate: aggregatorOf<Order>("count"),
      column: "period",
      rows: ["group"],
    });

    expect(tab.rows[0]?.cells.map((cell) => cell.value)).toStrictEqual([1, 99]);
  });

  it("measures only the values that are finite numbers", () => {
    const tab = crossTabOf(
      [
        { amount: "nope", group: "a", part: "one", period: "x" },
        { amount: Number.NaN, group: "a", part: "one", period: "x" },
        { amount: 4, group: "a", part: "one", period: "x" },
      ],
      optionsOf(),
    );

    expect(tab.rows[0]?.cells[0]).toStrictEqual({ count: 3, value: 4 });
  });

  it("keeps the column values in the order they first appear", () => {
    const tab = crossTabOf(ORDERS.toReversed(), optionsOf());

    expect(tab.columns.map((column) => column.value)).toStrictEqual(["x", "y"]);
  });

  it("keeps the rows of an outer value together in the order the values first appear", () => {
    const tab = crossTabOf(
      [
        { amount: 1, group: "a", part: "one", period: "x" },
        { amount: 1, group: "b", part: "one", period: "x" },
        { amount: 1, group: "a", part: "two", period: "x" },
        { amount: 1, group: "b", part: "three", period: "x" },
      ],
      optionsOf(),
    );

    expect(tab.rows.map((row) => row.path.join("/"))).toStrictEqual([
      "a/one",
      "a/two",
      "b/one",
      "b/three",
    ]);
  });

  it("returns an empty cross-tab for no records", () => {
    const tab = crossTabOf([], optionsOf());

    expect([tab.columns, tab.rows, tab.grandTotal]).toStrictEqual([
      [],
      [],
      { count: 0, value: null },
    ]);
  });

  it("returns one row with an empty path without row dimensions", () => {
    const tab = crossTabOf(ORDERS, { ...optionsOf(), rows: [] });

    expect(tab.rows.map((row) => row.path)).toStrictEqual([[]]);
  });

  it.each([
    { aggregate: "sum", want: 6 },
    { aggregate: "average", want: 2 },
    { aggregate: "min", want: 1 },
    { aggregate: "max", want: 3 },
    { aggregate: "count", want: 4 },
  ] as const)("returns $want as the $aggregate of three figures beside a word", (each) => {
    const records = [{ amount: 3 }, { amount: 1 }, { amount: 2 }, { amount: "two" }];

    expect(aggregatorOf<{ amount: number | string }>(each.aggregate, "amount")(records)).toBe(
      each.want,
    );
  });

  it.each(["sum", "average", "min", "max"] as const)(
    "returns null as the %s of records without a finite figure",
    (aggregate) => {
      expect(aggregatorOf<{ amount: string }>(aggregate, "amount")([{ amount: "two" }])).toBeNull();
    },
  );

  it("returns the caller's aggregate function", () => {
    expect(aggregatorOf<Order>(doubled, "amount")).toBe(doubled);
  });

  it.each([
    { give: "North", label: "a string", want: "North" },
    { give: 2026, label: "a number", want: "2026" },
    { give: true, label: "a boolean", want: "true" },
    { give: 10n, label: "a big integer", want: "10" },
    { give: null, label: "null", want: "" },
    { give: undefined, label: "undefined", want: "" },
    { give: { code: "NO" }, label: "an object", want: '{"code":"NO"}' },
  ])("returns the text $label groups under", ({ give, want }) => {
    expect(textOf(give)).toBe(want);
  });

  it("returns true for paths that agree down to the depth", () => {
    expect(sharesGroupOf(["a", "one"], ["a", "two"], 0)).toBe(true);
  });

  it("returns false for paths whose outer values differ while their inner values agree", () => {
    expect(sharesGroupOf(["a", "one"], ["b", "one"], 1)).toBe(false);
  });
});
