import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CandleKey } from "#candlestick-chart/candle-key.tsx";
import { charted } from "#chart/chart.fixtures.tsx";

/**
 * Names the colors and the parts of a candle.
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
 * Renders the key in a chart's root and returns its entries.
 */
function itemsOf(flat = false): Element[] {
  const { container } = render(charted({ children: <CandleKey flat={flat} words={WORDS} /> }));

  return [...container.querySelectorAll("li")];
}

describe("CandleKey", () => {
  it("names the colors and the parts in reading order", () => {
    expect(itemsOf().map((item) => item.textContent)).toStrictEqual([
      "Up",
      "Down",
      "Open to close",
      "Low to high",
    ]);
  });

  it("names the flat color while the chart has a flat candle", () => {
    expect(itemsOf(true).map((item) => item.textContent)).toStrictEqual([
      "Up",
      "Down",
      "Flat",
      "Open to close",
      "Low to high",
    ]);
  });

  it("renders each color as the data package's color swatch", () => {
    expect(
      itemsOf(true).reduce(
        (count, item) => count + item.querySelectorAll(".color-swatch").length,
        0,
      ),
    ).toBe(3);
  });

  it("renders the body and the wick in the whisker's class", () => {
    const [, , body, wick] = itemsOf();

    expect([
      body?.querySelectorAll("rect.chart-whisker").length,
      wick?.querySelectorAll("line.chart-whisker").length,
    ]).toStrictEqual([1, 1]);
  });
});
