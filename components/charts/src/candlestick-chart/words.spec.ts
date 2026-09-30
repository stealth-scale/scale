import { describe, expect, it } from "vitest";

import { type CandleRow } from "#candlestick-chart/candles.ts";
import { factsOf } from "#candlestick-chart/words.ts";
import { numberFormatter } from "#chart/format.ts";

/**
 * Names the tooltip's rows.
 */
const WORDS = {
  body: "Open to close",
  change: "Change",
  close: "Close",
  down: "Down",
  flat: "Flat",
  high: "High",
  low: "Low",
  open: "Open",
  up: "Up",
  wick: "Low to high",
};

/**
 * Writes prices in dollars, changes with their sign, and a change's share as a signed percentage.
 */
const FORMATS = {
  change: numberFormatter("en-US", {
    currency: "USD",
    signDisplay: "exceptZero",
    style: "currency",
  }),
  percent: numberFormatter("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    signDisplay: "exceptZero",
    style: "percent",
  }),
  value: numberFormatter("en-US", { currency: "USD", style: "currency" }),
};

/**
 * Row of a period that rose from 156.40 to 162.34.
 */
const ROW: CandleRow = {
  candle: { close: 162.34, high: 163.1, low: 155.8, open: 156.4 },
  category: "Mon",
  color: "green",
  direction: "up",
  range: [155.8, 163.1],
};

/**
 * Returns the tooltip's rows for a row.
 */
function rowsOf(row: CandleRow): ReturnType<ReturnType<typeof factsOf>> {
  return factsOf(WORDS, FORMATS)([{ payload: row }]);
}

describe("words", () => {
  it("names the rows in reading order", () => {
    expect(rowsOf(ROW).map((row) => row.name)).toStrictEqual([
      "Open",
      "High",
      "Low",
      "Close",
      "Change",
    ]);
  });

  it.each([
    { key: "open", value: "$156.40" },
    { key: "high", value: "$163.10" },
    { key: "low", value: "$155.80" },
    { key: "close", value: "$162.34" },
    { key: "change", value: "+$5.94 (+3.80%)" },
  ])("writes $key as $value", ({ key, value }) => {
    expect(rowsOf(ROW).find((row) => row.key === key)?.value).toBe(value);
  });

  it("writes a fall with its sign", () => {
    const candle = { ...ROW.candle, close: 150, open: 160 };

    expect(rowsOf({ ...ROW, candle }).at(-1)?.value).toBe("-$10.00 (-6.25%)");
  });

  it("writes the change without a share for an open of 0", () => {
    const candle = { ...ROW.candle, close: 2, open: 0 };

    expect(rowsOf({ ...ROW, candle }).at(-1)?.value).toBe("+$2.00");
  });

  it("returns no rows without an entry", () => {
    expect(factsOf(WORDS, FORMATS)([])).toStrictEqual([]);
  });
});
