import { describe, expect, it, vi } from "vitest";

import {
  type Calendar,
  calendarCells,
  type CalendarDay,
  type CalendarOptions,
} from "#heatmap/calendar.ts";

/**
 * Lists three readings in March 2026: Wednesday the 4th, Thursday the 5th missing, and Tuesday
 * the 17th.
 */
const DAYS: readonly CalendarDay[] = [
  { date: "2026-03-04", value: 3 },
  { date: "2026-03-05", value: null },
  { date: "2026-03-17", value: 8 },
];

/**
 * Returns the calendar of the fixture's days in American English and the options a case states.
 */
function laid(
  changes: Partial<CalendarOptions> = {},
  days: readonly CalendarDay[] = DAYS,
): Calendar {
  return calendarCells(days, { locale: "en-US", ...changes });
}

/**
 * Returns the value of the cell of a date, or undefined without a cell.
 */
function valueAt(date: string, days: readonly CalendarDay[] = DAYS): null | number | undefined {
  return laid({}, days).cells.find((cell) => cell.date === date)?.value;
}

describe("calendarCells", () => {
  it("returns a row per weekday from the locale's first day", () => {
    expect(laid().rows.map((row) => row.key)).toStrictEqual([
      "sun",
      "mon",
      "tue",
      "wed",
      "thu",
      "fri",
      "sat",
    ]);
  });

  it("starts the rows on a German week's Monday", () => {
    expect(laid({ locale: "de-DE" }).rows[0]).toStrictEqual({ key: "mon", label: "Mo" });
  });

  it("starts the rows on a stated first day", () => {
    expect(laid({ weekStartsOn: "sat" }).rows[0]?.key).toBe("sat");
  });

  it("names each weekday in the locale's short words", () => {
    expect(laid().rows.map((row) => row.label)).toStrictEqual([
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ]);
  });

  it("returns a column per week keyed by the week's first date", () => {
    expect(laid().columns.map((column) => column.key)).toStrictEqual([
      "2026-03-01",
      "2026-03-08",
      "2026-03-15",
    ]);
  });

  it("keys the weeks by a stated first day", () => {
    expect(laid({ weekStartsOn: "mon" }).columns[0]?.key).toBe("2026-03-02");
  });

  it("hides each week's heading", () => {
    expect(laid().columns.every((column) => column.hidden === true)).toBe(true);
  });

  it("writes a week's heading as its dates in the window", () => {
    expect(laid().columns.map((column) => column.label)).toStrictEqual([
      "Mar 4 – 7, 2026",
      "Mar 8 – 14, 2026",
      "Mar 15 – 17, 2026",
    ]);
  });

  it("groups a week under the month of its first day in the window", () => {
    expect(
      laid({ from: "2026-03-01", to: "2026-03-01", weekStartsOn: "mon" }).columns[0]?.group,
    ).toBe("2026-03");
  });

  it("groups the weeks by month in order", () => {
    expect(
      laid({ from: "2026-01-20", to: "2026-03-10" }).groups.map((group) => group.key),
    ).toStrictEqual(["2026-01", "2026-02", "2026-03"]);
  });

  it("names the first month with its year", () => {
    expect(laid({ from: "2025-11-20", to: "2026-02-10" }).groups[0]?.label).toBe("Nov 2025");
  });

  it("names a later month without its year", () => {
    expect(laid({ from: "2025-11-20", to: "2026-02-10" }).groups[1]?.label).toBe("Dec");
  });

  it("names a later January without its year", () => {
    expect(laid({ from: "2025-11-20", to: "2026-02-10" }).groups[2]?.label).toBe("Jan");
  });

  it("returns a cell per day of the window", () => {
    expect(laid().cells).toHaveLength(14);
  });

  it("places a day in its week's column and its weekday's row", () => {
    expect(laid().cells.find((cell) => cell.date === "2026-03-17")).toMatchObject({
      column: "2026-03-15",
      row: "tue",
    });
  });

  it("places a day in the column of a week that starts on a stated day", () => {
    expect(
      laid({ weekStartsOn: "mon" }).cells.find((cell) => cell.date === "2026-03-17")?.column,
    ).toBe("2026-03-16");
  });

  it("labels a day with its date in the locale's full words", () => {
    expect(laid().cells[0]?.label).toBe("Wednesday, March 4, 2026");
  });

  it("returns a day's value", () => {
    expect(valueAt("2026-03-17")).toBe(8);
  });

  it("returns null for a day measured as missing", () => {
    expect(valueAt("2026-03-05")).toBeNull();
  });

  it("returns null for a day without a reading", () => {
    expect(valueAt("2026-03-06")).toBeNull();
  });

  it("applies the later of two readings for one date", () => {
    expect(valueAt("2026-03-04", [...DAYS, { date: "2026-03-04", value: 5 }])).toBe(5);
  });

  it.each(["2026-02-30", "2026-3-4", "yesterday"])("leaves out the date %s", (date) => {
    expect(laid({}, [...DAYS, { date, value: 9 }]).cells).toHaveLength(14);
  });

  it("leaves out a day before a stated window", () => {
    expect(laid({ from: "2026-03-10" }).cells[0]?.date).toBe("2026-03-10");
  });

  it("leaves out a day after a stated window", () => {
    expect(laid({ to: "2026-03-10" }).cells.at(-1)?.date).toBe("2026-03-10");
  });

  it("lays out a stated window without readings", () => {
    expect(laid({ from: "2026-03-01", to: "2026-03-31" }, []).cells).toHaveLength(31);
  });

  it("returns no cell without a day or a window", () => {
    expect(laid({}, [])).toStrictEqual({
      cells: [],
      columns: [],
      groups: [],
      rows: [],
      shape: "square",
      sparse: true,
    });
  });

  it("returns no cell for a window that ends before it starts", () => {
    expect(laid({ from: "2026-03-10", to: "2026-03-01" }).cells).toStrictEqual([]);
  });

  it("returns no cell for a window end that is no date", () => {
    expect(laid({ to: "soon" }).cells).toStrictEqual([]);
  });

  it("returns square cells in a sparse grid", () => {
    expect(laid()).toMatchObject({ shape: "square", sparse: true });
  });

  it("places a date on its own day in a zone west of Greenwich", () => {
    vi.stubEnv("TZ", "Pacific/Honolulu");

    expect(laid({}, [{ date: "2026-03-15", value: 1 }]).cells[0]).toMatchObject({
      label: "Sunday, March 15, 2026",
      row: "sun",
    });
  });
});
