import { describe, expect, it } from "vitest";

import { candleDirection } from "#candlestick-chart/candles.ts";
import { EURO } from "#candlestick-chart/examples/euro.ts";

describe("euro", () => {
  it("lists the 22 trading days of September 2026", () => {
    expect(EURO).toHaveLength(22);
  });

  it("closes September 14 alone at its open", () => {
    expect(
      EURO.filter((day) => candleDirection(day) === "flat").map((day) => day.day),
    ).toStrictEqual(["2026-09-14"]);
  });

  it("runs from 1.0781 to 1.1080", () => {
    expect([
      Math.min(...EURO.map((day) => day.low)),
      Math.max(...EURO.map((day) => day.high)),
    ]).toStrictEqual([1.0781, 1.108]);
  });

  it("opens the month at 1.0917 and closes it at 1.1059", () => {
    expect([EURO[0]?.open, EURO.at(-1)?.close]).toStrictEqual([1.0917, 1.1059]);
  });
});
