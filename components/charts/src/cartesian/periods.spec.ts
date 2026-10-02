import { describe, expect, it } from "vitest";

import { alignPeriods, changeWordsOf, seriesOptionsOf } from "#cartesian/periods.ts";
import { type TooltipEntry } from "#chart/tooltip.tsx";

/**
 * Lists three days of this week.
 */
const THIS_WEEK = [
  { day: "2026-09-21", visits: 120 },
  { day: "2026-09-22", visits: 90 },
  { day: "2026-09-23", visits: 150 },
];

/**
 * Lists two days of last week, one fewer than this week.
 */
const LAST_WEEK = [
  { day: "2026-09-14", visits: 100 },
  { day: "2026-09-15", visits: 120 },
];

/**
 * Returns the tooltip entry of this week's visits for a row.
 */
function entryOf(payload: object): TooltipEntry {
  return { dataKey: "visits", payload };
}

/**
 * Returns the writer of this week's values against last week's, in a locale.
 */
function wordsOf(locale = "en-US"): (value: unknown, entry?: TooltipEntry) => string {
  return changeWordsOf({
    locale,
    series: [{ key: "visits" }, { key: "visitsPrevious", previousOf: "visits" }],
    write: String,
  });
}

describe("periods", () => {
  it("copies the previous period's values into the current row at the same position", () => {
    expect(
      alignPeriods(THIS_WEEK, LAST_WEEK, { categoryKey: "day", keys: ["visits"] })[1],
    ).toStrictEqual({
      day: "2026-09-22",
      dayPrevious: "2026-09-15",
      visits: 90,
      visitsPrevious: 120,
    });
  });

  it("leaves a row past the end of a shorter previous period without its values", () => {
    expect(
      alignPeriods(THIS_WEEK, LAST_WEEK, { categoryKey: "day", keys: ["visits"] })[2],
    ).toStrictEqual({ day: "2026-09-23", visits: 150 });
  });

  it("names the copied fields with the stated suffix", () => {
    expect(
      Object.keys(
        alignPeriods(THIS_WEEK, LAST_WEEK, {
          categoryKey: "day",
          keys: ["visits"],
          suffix: "_before",
        })[0] ?? {},
      ),
    ).toStrictEqual(["day", "visits", "day_before", "visits_before"]);
  });

  it("gives an earlier period without a color the neutral palette", () => {
    expect(
      seriesOptionsOf([{ key: "visits" }, { key: "visitsPrevious", previousOf: "visits" }]).map(
        (each) => each.color,
      ),
    ).toStrictEqual([undefined, "neutral"]);
  });

  it("keeps the stated color of an earlier period", () => {
    expect(
      seriesOptionsOf([{ color: "accent", key: "visitsPrevious", previousOf: "visits" }])[0]?.color,
    ).toBe("accent");
  });

  it("returns the writer as it is without an earlier period", () => {
    expect(changeWordsOf({ locale: "en-US", series: [{ key: "visits" }], write: String })).toBe(
      String,
    );
  });

  it("writes the change from the earlier period after the value", () => {
    expect(wordsOf()(120, entryOf({ visits: 120, visitsPrevious: 100 }))).toBe("120, +20%");
  });

  it("writes a fall as a negative change to one decimal", () => {
    expect(wordsOf()(100, entryOf({ visits: 100, visitsPrevious: 120 }))).toBe("100, -16.7%");
  });

  it("divides the change by the size of a negative earlier value", () => {
    expect(wordsOf()(50, entryOf({ visits: 50, visitsPrevious: -100 }))).toBe("50, +150%");
  });

  it("joins the change with the locale's list separator", () => {
    expect(wordsOf("ja-JP")(120, entryOf({ visits: 120, visitsPrevious: 100 }))).toBe("120、+20%");
  });

  it.each([
    { name: "without an earlier value", payload: { visits: 150 } },
    { name: "after an earlier value of zero", payload: { visits: 150, visitsPrevious: 0 } },
  ])("writes the value alone $name", ({ payload }) => {
    expect(wordsOf()(150, entryOf(payload))).toBe("150");
  });

  it("writes a value that is not a number alone", () => {
    expect(wordsOf()("n/a", entryOf({ visitsPrevious: 100 }))).toBe("n/a");
  });

  it("writes the value alone without an entry", () => {
    expect(wordsOf()(150)).toBe("150");
  });

  it("writes the earlier period's own value alone", () => {
    expect(
      wordsOf()(100, { dataKey: "visitsPrevious", payload: { visits: 120, visitsPrevious: 100 } }),
    ).toBe("100");
  });
});
