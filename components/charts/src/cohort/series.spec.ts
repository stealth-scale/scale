import { describe, expect, it } from "vitest";

import { type Cohort } from "#cohort/cohorts.ts";
import { cohortSeriesKey, retentionSeries } from "#cohort/series.ts";

/**
 * Lists four cohorts, oldest first, observed for four, three, two and one periods.
 */
const COHORTS: readonly Cohort[] = [
  { key: "jan", label: "Jan", retained: [100, 60, 50, 40], size: 100 },
  { key: "feb", label: "Feb", retained: [100, 70, 55], size: 100 },
  { key: "mar", label: "Mar", retained: [100, 80], size: 100 },
  { key: "apr", label: "Apr", retained: [100], size: 100 },
];

describe("series", () => {
  it("keys a cohort's rate under cohort and its key", () => {
    expect(cohortSeriesKey("2026-01")).toBe("cohort:2026-01");
  });

  it("writes the dots of a cohort's key as their code", () => {
    expect(cohortSeriesKey("v1.2")).toBe("cohort:v1%2E2");
  });

  it("writes the brackets of a cohort's key as their codes", () => {
    expect(cohortSeriesKey("a[0]")).toBe("cohort:a%5B0%5D");
  });

  it("returns different keys for keys that differ in a dot", () => {
    expect(cohortSeriesKey("a.b")).not.toBe(cohortSeriesKey("a_b"));
  });

  it("returns a row per period with its words", () => {
    expect(
      retentionSeries(COHORTS, { periodLabel: (period) => `M${String(period)}` }).data.map(
        (row) => row.period,
      ),
    ).toStrictEqual(["M0", "M1", "M2", "M3"]);
  });

  it("names a period by its number without words", () => {
    expect(retentionSeries(COHORTS).data[2]?.period).toBe("2");
  });

  it("writes each cohort's rate under its series key", () => {
    expect(retentionSeries(COHORTS).data[1]).toMatchObject({
      "cohort:feb": 0.7,
      "cohort:jan": 0.6,
    });
  });

  it("writes no rate for a period past a cohort's last count", () => {
    expect(retentionSeries(COHORTS).data[1]?.["cohort:apr"]).toBeNull();
  });

  it("writes the average while enough cohorts have a rate at the period", () => {
    expect(retentionSeries(COHORTS).data.map((row) => row["average"])).toStrictEqual([
      1,
      0.7,
      null,
      null,
    ]);
  });

  it("writes the dashed average from the last solid period", () => {
    expect(retentionSeries(COHORTS).data.map((row) => row["sparse"])).toStrictEqual([
      null,
      0.7,
      0.525,
      0.4,
    ]);
  });

  it("renders the whole average solid at a floor of one cohort", () => {
    expect(
      retentionSeries(COHORTS, { minCohorts: 1 }).data.map((row) => row["sparse"]),
    ).toStrictEqual([null, null, null, null]);
  });

  it("returns a line per cohort in the stated color", () => {
    expect(
      retentionSeries(COHORTS, { color: "teal" })
        .series.slice(0, 4)
        .map(({ color, key }) => [key, color]),
    ).toStrictEqual([
      ["cohort:jan", "teal"],
      ["cohort:feb", "teal"],
      ["cohort:mar", "teal"],
      ["cohort:apr", "teal"],
    ]);
  });

  it("mixes each newer cohort further towards the ink", () => {
    expect(
      retentionSeries(COHORTS)
        .series.slice(0, 4)
        .map((series) => series.ink),
    ).toStrictEqual([0, 20, 40, 60]);
  });

  it("mixes no ink into a lone cohort", () => {
    expect(retentionSeries(COHORTS.slice(0, 1)).series[0]?.ink).toBe(0);
  });

  it("renders the average in the ink", () => {
    expect(retentionSeries(COHORTS).series.at(-2)).toMatchObject({
      ink: 100,
      key: "average",
      label: "All cohorts",
    });
  });

  it("renders the dashed average in the ink", () => {
    expect(retentionSeries(COHORTS).series.at(-1)).toMatchObject({
      dashed: true,
      ink: 100,
      key: "sparse",
      label: "All cohorts, few old enough",
    });
  });

  it("names the average's parts with the stated words", () => {
    expect(
      retentionSeries(COHORTS, { averageLabel: "Alle", sparseLabel: "Wenige" })
        .series.slice(-2)
        .map((series) => series.label),
    ).toStrictEqual(["Alle", "Wenige"]);
  });

  it("leaves out the dashed average while every period has enough cohorts", () => {
    expect(
      retentionSeries(COHORTS, { minCohorts: 1 }).series.map((series) => series.key),
    ).not.toContain("sparse");
  });

  it("leaves out the solid average while no period has enough cohorts", () => {
    expect(
      retentionSeries(COHORTS, { minCohorts: 9 }).series.map((series) => series.key),
    ).not.toContain("average");
  });

  it("reads the period's words on the category axis", () => {
    expect(retentionSeries(COHORTS).categoryKey).toBe("period");
  });

  it("spans the value axis from 0 to 1", () => {
    expect(retentionSeries(COHORTS).valueDomain).toStrictEqual([0, 1]);
  });

  it("writes the rates as percentages", () => {
    expect(retentionSeries(COHORTS).valueOptions).toStrictEqual({ style: "percent" });
  });
});
