import { describe, expect, it } from "vitest";

import { candleChange } from "#candlestick-chart/candles.ts";
import { ACME } from "#candlestick-chart/examples/acme.ts";

describe("acme", () => {
  it("lists the 22 trading days of September 2026", () => {
    expect([ACME.length, ACME[0]?.day, ACME.at(-1)?.day]).toStrictEqual([
      22,
      "2026-09-01",
      "2026-09-30",
    ]);
  });

  it("opens the month at $156.22 and closes it at $176.03", () => {
    expect([ACME[0]?.open, ACME.at(-1)?.close]).toStrictEqual([156.22, 176.03]);
  });

  it("rises most on September 25", () => {
    const largest = ACME.reduce((most, day) =>
      candleChange(day).absolute > candleChange(most).absolute ? day : most,
    );

    expect(largest.day).toBe("2026-09-25");
  });

  it("keeps every close and open between the day's low and high", () => {
    expect(
      ACME.every(
        (day) =>
          Math.min(day.open, day.close) >= day.low && Math.max(day.open, day.close) <= day.high,
      ),
    ).toBe(true);
  });
});
