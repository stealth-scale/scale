import { describe, expect, it } from "vitest";

import {
  CAPACITY,
  HOURS,
  RAINFALL,
  type Reading,
  WIND,
} from "#polar-area-chart/examples/cycles.ts";

/**
 * Returns the key of the largest reading.
 */
function peakOf(readings: readonly Reading[]): string | undefined {
  return readings.toSorted((first, second) => second.value - first.value)[0]?.key;
}

describe("cycles", () => {
  it("puts the day's peak of requests at noon", () => {
    expect(peakOf(HOURS)).toBe("12");
  });

  it("uses 59% of the capacity at noon", () => {
    expect((HOURS[4]?.value ?? 0) / CAPACITY).toBe(0.59);
  });

  it("puts the year's wettest month in October", () => {
    expect(peakOf(RAINFALL)).toBe("oct");
  });

  it("puts the year's driest month in April", () => {
    expect(RAINFALL.toSorted((first, second) => first.value - second.value)[0]?.key).toBe("apr");
  });

  it("puts the month's prevailing wind in the south-west", () => {
    expect(peakOf(WIND)).toBe("sw");
  });

  it("sums the month's wind to 720 hours", () => {
    expect(WIND.reduce((sum, reading) => sum + reading.value, 0)).toBe(720);
  });
});
