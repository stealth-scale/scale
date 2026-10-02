import { type Time } from "@zag-js/timer";
import { describe, expect, it } from "vitest";

import { spoken } from "#timer/spoken.ts";

/**
 * Returns a time with the units a case states, zero for the other units, and 250 milliseconds.
 */
function timeOf(units: Partial<Time>): Time {
  return { days: 0, hours: 0, milliseconds: 250, minutes: 0, seconds: 0, ...units };
}

describe("spoken", () => {
  it.each([
    { time: { minutes: 2, seconds: 5 }, want: "2 minutes, 5 seconds" },
    {
      time: { days: 2, hours: 3, minutes: 14, seconds: 5 },
      want: "2 days, 3 hours, 14 minutes, 5 seconds",
    },
    {
      time: { days: 1, hours: 1, minutes: 1, seconds: 1 },
      want: "1 day, 1 hour, 1 minute, 1 second",
    },
    { time: { minutes: 25 }, want: "25 minutes, 0 seconds" },
    { time: {}, want: "0 seconds" },
  ])("returns $want", ({ time, want }) => {
    expect(spoken(timeOf(time))).toBe(want);
  });
});
