import { parseDate, parseZonedDateTime } from "@internationalized/date";
import { describe, expect, it } from "vitest";

import { zoneOf } from "#zone.ts";

/**
 * Kick-off at 09:30 in New York.
 */
const KICK_OFF = parseZonedDateTime("2026-10-14T09:30[America/New_York]");

describe("zone", () => {
  it("returns the zone of a zoned value", () => {
    expect(zoneOf({ value: [KICK_OFF] })).toBe("America/New_York");
  });

  it("returns the zone of a zoned default value", () => {
    expect(zoneOf({ defaultValue: [KICK_OFF] })).toBe("America/New_York");
  });

  it("returns the zone of a zoned placeholder value", () => {
    expect(zoneOf({ placeholderValue: KICK_OFF })).toBe("America/New_York");
  });

  it("returns the zone of a zoned default placeholder value", () => {
    expect(zoneOf({ defaultPlaceholderValue: KICK_OFF })).toBe("America/New_York");
  });

  it("returns the timeZone the caller states over the value's zone", () => {
    expect(zoneOf({ defaultValue: [KICK_OFF], timeZone: "Europe/Amsterdam" })).toBe(
      "Europe/Amsterdam",
    );
  });

  it("returns nothing for a date without a zone", () => {
    expect(zoneOf({ value: [parseDate("2026-10-14")] })).toBeUndefined();
  });

  it("returns nothing without a date", () => {
    expect(zoneOf({})).toBeUndefined();
  });
});
