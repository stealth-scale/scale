import { describe, expect, it } from "vitest";

import { boxStats } from "#stats/box.ts";

/**
 * Lists eleven response times with one slow outlier.
 */
const TIMES = [12, 18, 21, 25, 30, 33, 35, 38, 41, 44, 180];

describe("box", () => {
  it("returns the five numbers of the values", () => {
    expect(boxStats(TIMES)).toMatchObject({ max: 180, median: 33, min: 12, q1: 23, q3: 39.5 });
  });

  it("returns the interquartile range", () => {
    expect(boxStats(TIMES)?.iqr).toBe(16.5);
  });

  it("returns the count of the values", () => {
    expect(boxStats(TIMES)?.count).toBe(11);
  });

  it("extends each whisker to the furthest value within 1.5 IQR of the box", () => {
    expect(boxStats(TIMES)).toMatchObject({ whiskerHigh: 44, whiskerLow: 12 });
  });

  it("returns a value past the whiskers as an outlier", () => {
    expect(boxStats(TIMES)?.outliers).toStrictEqual([180]);
  });

  it("extends the whiskers as far as whisker states", () => {
    expect(boxStats(TIMES, 10)).toMatchObject({ outliers: [], whiskerHigh: 180 });
  });

  it("ends each whisker at the box when no value is within its reach", () => {
    expect(boxStats([1, 2], 0)).toMatchObject({ whiskerHigh: 1.75, whiskerLow: 1.25 });
  });

  it("returns every value outside the box as an outlier when whisker is 0", () => {
    expect(boxStats([1, 2], 0)?.outliers).toStrictEqual([1, 2]);
  });

  it("reads a negative whisker as 0", () => {
    expect(boxStats([1, 2], -10)).toMatchObject({ whiskerHigh: 1.75, whiskerLow: 1.25 });
  });

  it("leaves out a value that is not a finite number", () => {
    expect(boxStats([3, "n/a", Number.NaN, 1, 2])?.count).toBe(3);
  });

  it("returns nothing without a finite value", () => {
    expect(boxStats(["n/a"])).toBeUndefined();
  });
});
