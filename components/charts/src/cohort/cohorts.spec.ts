import { describe, expect, it } from "vitest";

import {
  type Cohort,
  cohortAverages,
  type CohortCell,
  cohortCells,
  type CohortGrid,
  type CohortOptions,
  retentionRate,
} from "#cohort/cohorts.ts";

/**
 * Describes January's cohort of 200, observed for three periods.
 */
const JANUARY: Cohort = { key: "jan", label: "Jan", retained: [200, 120, 90], size: 200 };

/**
 * Describes February's cohort of 100, observed for two periods, its second count missing.
 */
const FEBRUARY: Cohort = { key: "feb", label: "Feb", retained: [100, null], size: 100 };

/**
 * Describes March's cohort of 50, observed for one period.
 */
const MARCH: Cohort = { key: "mar", label: "Mar", retained: [50], size: 50 };

/**
 * Lists the three cohorts, oldest first.
 */
const COHORTS: readonly Cohort[] = [JANUARY, FEBRUARY, MARCH];

/**
 * Returns the grid of the fixture's cohorts in American English and the options a case states.
 */
function laid(
  changes: Partial<CohortOptions> = {},
  cohorts: readonly Cohort[] = COHORTS,
): CohortGrid {
  return cohortCells(cohorts, { locale: "en-US", ...changes });
}

/**
 * Returns the cell of a row and a period.
 */
function cellAt(
  row: string,
  period: number,
  changes: Partial<CohortOptions> = {},
): CohortCell | undefined {
  return laid(changes).cells.find((cell) => cell.row === row && cell.period === period);
}

describe("cohorts", () => {
  it("returns the share of a cohort that remained at a period", () => {
    expect(retentionRate(JANUARY, 1)).toBe(0.6);
  });

  it("returns no rate for a count nobody measured", () => {
    expect(retentionRate(FEBRUARY, 1)).toBeNull();
  });

  it("returns no rate for a period past the cohort's last count", () => {
    expect(retentionRate(MARCH, 1)).toBeNull();
  });

  it("returns no rate for a cohort of none", () => {
    expect(retentionRate({ key: "apr", label: "Apr", retained: [0], size: 0 }, 0)).toBeNull();
  });

  it("weighs each cohort's rate by its size", () => {
    expect(
      cohortAverages([
        { key: "a", label: "A", retained: [9], size: 10 },
        { key: "b", label: "B", retained: [400], size: 1000 },
      ]),
    ).toStrictEqual([409 / 1010]);
  });

  it("averages only the cohorts with a rate at a period", () => {
    expect(cohortAverages(COHORTS)).toStrictEqual([1, 0.6, 0.45]);
  });

  it("returns no average at a period without a rate", () => {
    expect(
      cohortAverages([{ key: "a", label: "A", retained: [10, null], size: 10 }]),
    ).toStrictEqual([1, null]);
  });

  it("leaves a cohort of none out of the average", () => {
    expect(
      cohortAverages([
        { key: "a", label: "A", retained: [5], size: 10 },
        { key: "b", label: "B", retained: [3], size: 0 },
      ]),
    ).toStrictEqual([0.5]);
  });

  it("returns no averages without a cohort", () => {
    expect(cohortAverages([])).toStrictEqual([]);
  });

  it("returns a row per cohort in order", () => {
    expect(laid().rows).toStrictEqual([
      { key: "cohort:jan", label: "Jan" },
      { key: "cohort:feb", label: "Feb" },
      { key: "cohort:mar", label: "Mar" },
    ]);
  });

  it("names a cohort's row with the stated words", () => {
    expect(
      laid({ label: (cohort) => `${cohort.label} · ${String(cohort.size)}` }).rows[0],
    ).toStrictEqual({ key: "cohort:jan", label: "Jan · 200" });
  });

  it("returns a last row of the averages while it is named", () => {
    expect(laid({ average: "All cohorts" }).rows.at(-1)).toStrictEqual({
      key: "average",
      label: "All cohorts",
    });
  });

  it("returns a column per period of the widest cohort", () => {
    expect(laid().columns).toStrictEqual([
      { key: "0", label: "0" },
      { key: "1", label: "1" },
      { key: "2", label: "2" },
    ]);
  });

  it("names a period with the stated words", () => {
    expect(laid({ periodLabel: (period) => `M${String(period)}` }).columns[2]?.label).toBe("M2");
  });

  it("returns a cell per observed period of each cohort", () => {
    expect(laid().cells).toHaveLength(6);
  });

  it("fills a cell with the cohort's rate", () => {
    expect(cellAt("cohort:jan", 2)?.value).toBe(0.45);
  });

  it("returns a missing rate for a count nobody measured", () => {
    expect(cellAt("cohort:feb", 1)?.value).toBeNull();
  });

  it("returns no cell for a period past the cohort's last count", () => {
    expect(cellAt("cohort:mar", 1)).toBeUndefined();
  });

  it("gives a cell its cohort period and count", () => {
    expect(cellAt("cohort:jan", 1)).toMatchObject({ cohort: JANUARY, period: 1, retained: 120 });
  });

  it("writes no words of its own for a rate", () => {
    expect(cellAt("cohort:jan", 1)?.text).toBeUndefined();
  });

  it("writes the count in the locale for a count", () => {
    expect(
      cohortCells([{ key: "a", label: "A", retained: [1840], size: 2000 }], {
        locale: "de-DE",
        measure: "count",
      }).cells[0]?.text,
    ).toBe("1.840");
  });

  it("writes no count for a count nobody measured", () => {
    expect(cellAt("cohort:feb", 1, { measure: "count" })?.text).toBeUndefined();
  });

  it("fills the average's cells with the size-weighted rates", () => {
    expect(
      laid({ average: "All cohorts" })
        .cells.filter((cell) => cell.row === "average")
        .map((cell) => cell.value),
    ).toStrictEqual([1, 0.6, 0.45]);
  });

  it("gives the average's cells no cohort", () => {
    expect(cellAt("average", 0, { average: "All cohorts" })?.cohort).toBeUndefined();
  });

  it("returns no average's cell while the average is not named", () => {
    expect(cellAt("average", 0)).toBeUndefined();
  });

  it("scales the rates from 0 to 1", () => {
    expect(laid().domain).toStrictEqual({ max: 1, min: 0 });
  });

  it("writes the rates as percentages", () => {
    expect(laid().valueOptions).toStrictEqual({ style: "percent" });
  });

  it("returns a sparse grid", () => {
    expect(laid().sparse).toBe(true);
  });
});
