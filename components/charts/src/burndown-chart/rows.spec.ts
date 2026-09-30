import { describe, expect, it } from "vitest";

import { burndownFinish, type BurndownPoint, burndownRows } from "#burndown-chart/rows.ts";

/**
 * Lists a five-day sprint read on its first three days, falling 8 points a day from 40.
 */
const SPRINT: readonly BurndownPoint[] = [
  { at: "Mon", remaining: 40 },
  { at: "Tue", remaining: 32 },
  { at: "Wed", remaining: 24 },
  { at: "Thu" },
  { at: "Fri" },
];

/**
 * Lists a five-day sprint whose work rose on its third day.
 */
const RISING: readonly BurndownPoint[] = [
  { at: "Mon", remaining: 30 },
  { at: "Tue", remaining: 30 },
  { at: "Wed", remaining: 34 },
  { at: "Thu" },
  { at: "Fri" },
];

describe("rows", () => {
  it("runs the ideal line from the first reading to zero over the points", () => {
    expect(burndownRows(SPRINT).map((row) => row.ideal)).toStrictEqual([40, 30, 20, 10, 0]);
  });

  it("runs the ideal line from the stated total", () => {
    expect(burndownRows(SPRINT, { total: 80 }).map((row) => row.ideal)).toStrictEqual([
      80, 60, 40, 20, 0,
    ]);
  });

  it("runs the ideal line to zero at the end of the stated periods", () => {
    expect(burndownRows(SPRINT, { periods: 3 }).map((row) => row.ideal)).toStrictEqual([
      40, 20, 0, 0, 0,
    ]);
  });

  it("puts the ideal line at zero for a plan of one period", () => {
    expect(burndownRows(SPRINT, { periods: 1 }).map((row) => row.ideal)).toStrictEqual([
      0, 0, 0, 0, 0,
    ]);
  });

  it("puts the ideal line at zero without a reading or a total", () => {
    expect(burndownRows([{ at: "Mon" }, { at: "Tue" }]).map((row) => row.ideal)).toStrictEqual([
      0, 0,
    ]);
  });

  it("keeps each reading as the work remaining", () => {
    expect(burndownRows(SPRINT).map((row) => row.remaining)).toStrictEqual([
      40,
      32,
      24,
      undefined,
      undefined,
    ]);
  });

  it("reads a value that is not a finite number as no reading", () => {
    expect(
      burndownRows([
        { at: "Mon", remaining: 40 },
        { at: "Tue", remaining: Number.NaN },
      ]).map((row) => row.remaining),
    ).toStrictEqual([40, undefined]);
  });

  it("projects the trend from the last reading on", () => {
    expect(burndownRows(SPRINT).map((row) => row.projected)).toStrictEqual([
      undefined,
      undefined,
      24,
      16,
      8,
    ]);
  });

  it("stops the projection at zero", () => {
    const points = [
      { at: "Mon", remaining: 40 },
      { at: "Tue", remaining: 20 },
      { at: "Wed" },
      { at: "Thu" },
    ];

    expect(burndownRows(points).map((row) => row.projected)).toStrictEqual([undefined, 20, 0, 0]);
  });

  it("projects nothing when the work does not fall", () => {
    expect(burndownRows(RISING).every((row) => row.projected === undefined)).toBe(true);
  });

  it("projects nothing with one reading", () => {
    expect(
      burndownRows([{ at: "Mon", remaining: 40 }, { at: "Tue" }]).every(
        (row) => row.projected === undefined,
      ),
    ).toBe(true);
  });

  it("returns the period the projection falls to zero", () => {
    expect(burndownFinish(SPRINT)).toBe(5);
  });

  it("returns no finish when the work does not fall", () => {
    expect(burndownFinish(RISING)).toBeUndefined();
  });

  it("returns no finish with one reading", () => {
    expect(burndownFinish([{ at: "Mon", remaining: 40 }])).toBeUndefined();
  });
});
