import { describe, expect, it } from "vitest";

import { datesOf } from "#form/dates.ts";

describe("datesOf", () => {
  it("reads the date an ISO 8601 string names", () => {
    expect(datesOf("2026-10-01").map((date) => date.toString())).toStrictEqual(["2026-10-01"]);
  });

  it("returns no date for a value that is not a string", () => {
    expect(datesOf(20_261_001)).toStrictEqual([]);
  });

  it("returns no date for a string in another format", () => {
    expect(datesOf("01/10/2026")).toStrictEqual([]);
  });

  it("returns no date for a day the month lacks", () => {
    expect(datesOf("2026-02-30")).toStrictEqual([]);
  });

  it("returns no date for an empty field", () => {
    expect(datesOf()).toStrictEqual([]);
  });
});
