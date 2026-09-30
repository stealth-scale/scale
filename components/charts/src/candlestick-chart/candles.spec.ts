import { describe, expect, it } from "vitest";

import {
  candleChange,
  candleDirection,
  candlesOf,
  directionColor,
} from "#candlestick-chart/candles.ts";

/**
 * Row of a period that rose from 100 to 103.
 */
const RISE = { close: 103, day: "Mon", high: 104, low: 98, open: 100 };

describe("candles", () => {
  it.each([
    { close: 103, open: 100, want: "up" },
    { close: 97, open: 100, want: "down" },
    { close: 100, open: 100, want: "flat" },
  ])("reads a close of $close against an open of $open as $want", ({ close, open, want }) => {
    expect(candleDirection({ close, open })).toBe(want);
  });

  it("returns the change from open to close with its share of the open", () => {
    expect(candleChange({ close: 103, open: 100 })).toStrictEqual({ absolute: 3, ratio: 0.03 });
  });

  it("returns no share for an open of 0", () => {
    expect(candleChange({ close: 3, open: 0 })).toStrictEqual({ absolute: 3, ratio: undefined });
  });

  it.each([
    { direction: "up" as const, want: "var(--colors-success-chart)" },
    { direction: "down" as const, want: "var(--colors-error-chart)" },
    { direction: "flat" as const, want: "var(--colors-neutral-chart)" },
  ])("colors a $direction candle $want", ({ direction, want }) => {
    expect(directionColor(direction)).toBe(want);
  });

  it("returns a row per period for the chart to render", () => {
    expect(candlesOf([RISE], "day")).toStrictEqual([
      {
        candle: { close: 103, high: 104, low: 98, open: 100 },
        category: "Mon",
        color: "var(--colors-success-chart)",
        direction: "up",
        range: [98, 104],
      },
    ]);
  });

  it.each(["open", "high", "low", "close"])("leaves out a row without a finite %s", (field) => {
    expect(candlesOf([{ ...RISE, [field]: Number.NaN }], "day")).toStrictEqual([]);
  });

  it("widens a candle's range to its open and close past its high and low", () => {
    expect(candlesOf([{ ...RISE, high: 101, low: 102 }], "day")[0]?.range).toStrictEqual([
      100, 103,
    ]);
  });
});
