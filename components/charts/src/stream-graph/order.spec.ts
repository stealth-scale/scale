import { describe, expect, it } from "vitest";

import { insideOutOrder, streamOnset } from "#stream-graph/order.ts";

/**
 * Lists four rows in which each of four series has its whole weight in one row, the early series
 * in the first row and the late one in the last, and a fifth series has none.
 */
const SPREAD = [
  { early: 1, first: 0, late: 0, none: 0, second: 0 },
  { early: 0, first: 1, late: 0, none: 0, second: 0 },
  { early: 0, first: 0, late: 0, none: 0, second: 1 },
  { early: 0, first: 0, late: 1, none: 0, second: 0 },
];

describe("order", () => {
  it("returns the index of a series' centre of mass as its onset", () => {
    expect(streamOnset([{ visits: 1 }, { visits: 1 }, { visits: 2 }], "visits")).toBe(1.25);
  });

  it("weighs negative and missing values as zero", () => {
    expect(streamOnset([{ visits: -5 }, { visits: 2 }, {}], "visits")).toBe(1);
  });

  it("returns NaN as the onset of a series without a positive value", () => {
    expect(streamOnset([{ visits: 0 }, { visits: -2 }], "visits")).toBeNaN();
  });

  it("keeps the order of fewer than three keys", () => {
    expect(insideOutOrder(SPREAD, ["late", "early"])).toStrictEqual(["late", "early"]);
  });

  it("puts the earliest series in the middle of the stack", () => {
    expect(insideOutOrder(SPREAD, ["late", "second", "first", "early"])).toStrictEqual([
      "second",
      "early",
      "first",
      "late",
    ]);
  });

  it("returns one order for the same series in any order", () => {
    expect(insideOutOrder(SPREAD, ["early", "first", "second", "late"])).toStrictEqual(
      insideOutOrder(SPREAD, ["late", "second", "first", "early"]),
    );
  });

  it("puts a series without weight at the bottom edge of the stack", () => {
    expect(insideOutOrder(SPREAD, ["none", "late", "second", "first", "early"])).toStrictEqual([
      "none",
      "second",
      "early",
      "first",
      "late",
    ]);
  });

  it("keeps series of equal onset in their order", () => {
    const data = [
      { a: 0, b: 0, c: 1 },
      { a: 1, b: 1, c: 0 },
    ];

    expect(insideOutOrder(data, ["a", "b", "c"])).toStrictEqual(["b", "c", "a"]);
  });
});
