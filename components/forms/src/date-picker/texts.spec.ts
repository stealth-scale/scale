import { parseDate } from "@internationalized/date";
import { describe, expect, it } from "vitest";

import { submittedIndexes, visibleText } from "#date-picker/texts.ts";

/**
 * Three days picked from one calendar: October 14, 20 and 26, 2026.
 */
const DAYS = [parseDate("2026-10-14"), parseDate("2026-10-20"), parseDate("2026-10-26")];

describe("texts", () => {
  it("joins a visible range's start to its end with an en dash", () => {
    expect(
      visibleText({
        visibleRangeText: { end: "November 2026", formatted: "", start: "October 2026" },
      }),
    ).toBe("October 2026 – November 2026");
  });

  it("returns the start alone when the end matches it", () => {
    expect(
      visibleText({
        visibleRangeText: { end: "October 2026", formatted: "", start: "October 2026" },
      }),
    ).toBe("October 2026");
  });

  it("returns two indexes for a range", () => {
    expect(submittedIndexes({ selectionMode: "range", value: [] })).toStrictEqual([0, 1]);
  });

  it("returns one index for a single date", () => {
    expect(submittedIndexes({ selectionMode: "single", value: DAYS.slice(0, 1) })).toStrictEqual([
      0,
    ]);
  });

  it("returns an index per date for multiple dates", () => {
    expect(submittedIndexes({ selectionMode: "multiple", value: DAYS })).toStrictEqual([0, 1, 2]);
  });

  it("returns one index for multiple dates while none is set", () => {
    expect(submittedIndexes({ selectionMode: "multiple", value: [] })).toStrictEqual([0]);
  });
});
