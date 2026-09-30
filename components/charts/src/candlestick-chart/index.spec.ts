import { describe, expect, it } from "vitest";

import * as candlestickChart from "#candlestick-chart/index.ts";

describe("index", () => {
  it("exports CandlestickChart with the functions that read a candle", () => {
    expect(Object.keys(candlestickChart).toSorted()).toStrictEqual([
      "CandlestickChart",
      "candleChange",
      "candleDirection",
    ]);
  });
});
