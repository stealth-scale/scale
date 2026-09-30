import { describe, expect, it } from "vitest";

import { heatmapDomain } from "#heat/scale.ts";
import {
  ATTENDANCE,
  AUTHORISATIONS,
  BUILD_MINUTES,
  ERRORS,
  gridOf,
  HEADCOUNT_VARIANCE,
  hoursOf,
  OCCUPANCY,
  SCANS_LAST_WEEK,
  SCANS_THIS_WEEK,
} from "#heatmap/examples/readings.ts";
import { type HeatmapCell } from "#heatmap/index.ts";

/**
 * Returns the reading of a row and a column.
 */
function at(cells: readonly HeatmapCell[], row: string, column: string): null | number | undefined {
  return cells.find((cell) => cell.row === row && cell.column === column)?.value;
}

/**
 * Returns the readings with the greatest value.
 */
function busiest(cells: readonly HeatmapCell[]): readonly HeatmapCell[] {
  const { max } = heatmapDomain(cells);

  return cells.filter((cell) => cell.value === max);
}

describe("readings", () => {
  it("leaves the rest of a short row missing", () => {
    expect(gridOf(["a", "b"], [["x", [1]]])).toStrictEqual([
      { column: "a", row: "x", value: 1 },
      { column: "b", row: "x", value: null },
    ]);
  });

  it("writes an hour's key as the hour on the clock", () => {
    expect(hoursOf(["17"])).toStrictEqual([{ key: "17", label: "17:00" }]);
  });

  it("lists 84 hours of authorisations", () => {
    expect(AUTHORISATIONS).toHaveLength(84);
  });

  it("puts the busiest authorisation hour on Tuesday at 17:00 with 405", () => {
    expect(busiest(AUTHORISATIONS)).toStrictEqual([{ column: "17", row: "tue", value: 405 }]);
  });

  it("leaves six ward readings missing", () => {
    expect(OCCUPANCY.filter((cell) => cell.value === null)).toHaveLength(6);
  });

  it("counts 8 beds at the fewest", () => {
    expect(heatmapDomain(OCCUPANCY).min).toBe(8);
  });

  it("builds payments-web for 388 minutes on Friday", () => {
    expect(at(BUILD_MINUTES, "payments-web", "fri")).toBe(388);
  });

  it("spans both weeks of scans from 320 to 1940", () => {
    expect(heatmapDomain([...SCANS_THIS_WEEK, ...SCANS_LAST_WEEK])).toStrictEqual({
      max: 1940,
      min: 320,
    });
  });

  it("spans last week's scans from 320 to 1060", () => {
    expect(heatmapDomain(SCANS_LAST_WEEK)).toStrictEqual({ max: 1060, min: 320 });
  });

  it("runs payments 9 under plan in Q2", () => {
    expect(at(HEADCOUNT_VARIANCE, "payments", "q2")).toBe(-9);
  });

  it("ends security 11 over plan in Q4", () => {
    expect(at(HEADCOUNT_VARIANCE, "security", "q4")).toBe(11);
  });

  it("puts checkout-api's 512 errors at 12:00", () => {
    expect(busiest(ERRORS)).toStrictEqual([{ column: "12", row: "checkout-api", value: 512 }]);
  });

  it("lists 180 days of attendance", () => {
    expect(ATTENDANCE).toHaveLength(180);
  });

  it("dips attendance to 82% in weeks 15 and 16", () => {
    const { min } = heatmapDomain(ATTENDANCE);

    expect(min).toBe(82);
    expect(
      ATTENDANCE.filter((cell) => cell.value === min).map((cell) => cell.column),
    ).toStrictEqual(["15", "15", "16"]);
  });

  it("peaks attendance at 97%", () => {
    expect(heatmapDomain(ATTENDANCE).max).toBe(97);
  });
});
