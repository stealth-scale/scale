import { describe, expect, it } from "vitest";

import { calendarCells } from "#heatmap/index.ts";

import { BOOKINGS, daysOf, DEPLOYS, PAGES } from "./days.ts";

/**
 * Returns the sum of each week's values, keyed by the week's first date, with weeks from Monday.
 */
function weeksOf(days: typeof DEPLOYS): ReadonlyMap<string, number> {
  const sums = new Map<string, number>();

  for (const cell of calendarCells(days, { locale: "en-GB", weekStartsOn: "mon" }).cells) {
    sums.set(cell.column, (sums.get(cell.column) ?? 0) + (cell.value ?? 0));
  }

  return sums;
}

describe("days", () => {
  it("returns a reading per day from a date on", () => {
    expect(daysOf("2026-02-27", 3, (weekday) => weekday).map((day) => day.date)).toStrictEqual([
      "2026-02-27",
      "2026-02-28",
      "2026-03-01",
    ]);
  });

  it("values a day from its weekday", () => {
    expect(daysOf("2026-03-01", 2, (weekday) => weekday).map((day) => day.value)).toStrictEqual([
      0, 1,
    ]);
  });

  it("lists a year of deploys from 1 October 2025", () => {
    expect([DEPLOYS.length, DEPLOYS[0]?.date, DEPLOYS.at(-1)?.date]).toStrictEqual([
      365,
      "2025-10-01",
      "2026-09-30",
    ]);
  });

  it("records no deploy from 9 to 22 February", () => {
    expect(DEPLOYS.filter((day) => day.value === null).map((day) => day.date)).toHaveLength(14);
  });

  it("makes the release week the busiest with 80 deploys", () => {
    const sums = weeksOf(DEPLOYS);

    expect([sums.get("2026-03-09"), Math.max(...sums.values())]).toStrictEqual([80, 80]);
  });

  it("pages the team 14 times during the incident", () => {
    expect(PAGES.find((day) => day.date === "2026-02-17")?.value).toBe(14);
  });

  it("pages the team at most six times on another day", () => {
    expect(
      Math.max(...PAGES.filter((day) => day.date !== "2026-02-17").map((day) => day.value ?? 0)),
    ).toBe(6);
  });

  it("books all 84 rooms over the conference", () => {
    expect(BOOKINGS.filter((day) => day.value === 84).map((day) => day.date)).toStrictEqual([
      "2026-05-12",
      "2026-05-13",
      "2026-05-14",
    ]);
  });

  it("books 30 to 82 rooms on another night", () => {
    const others = BOOKINGS.filter((day) => day.value !== 84).map((day) => day.value ?? 0);

    expect([Math.min(...others), Math.max(...others)]).toStrictEqual([30, 82]);
  });
});
