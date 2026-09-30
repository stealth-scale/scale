import { describe, expect, it } from "vitest";

import { namingOf, rowsOf } from "#spark/rows.ts";

describe("rows", () => {
  it("returns a row per value at its place in the run", () => {
    expect(rowsOf([4, 7])).toStrictEqual([
      { at: 0, value: 4 },
      { at: 1, value: 7 },
    ]);
  });

  it("keeps the place of a missing value as a gap", () => {
    expect(rowsOf([4, null, undefined, 7]).map((row) => row.value)).toStrictEqual([
      4,
      null,
      null,
      7,
    ]);
  });

  it("turns a value that is not a finite number into a gap", () => {
    expect(rowsOf([Number.NaN, Number.POSITIVE_INFINITY]).map((row) => row.value)).toStrictEqual([
      null,
      null,
    ]);
  });

  it("names a run with a label as an image", () => {
    expect(namingOf("Revenue per day")).toStrictEqual({
      "aria-label": "Revenue per day",
      role: "img",
    });
  });

  it("hides a run without a label from assistive technology", () => {
    expect(namingOf()).toStrictEqual({ "aria-hidden": true });
  });
});
