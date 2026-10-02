import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CandleShape, type CandleShapeProps } from "#candlestick-chart/candle-shape.tsx";
import { type CandleRow } from "#candlestick-chart/candles.ts";

/**
 * Row of a period from 0 to 100 that rose from 25 to 75.
 */
const ROW: CandleRow = {
  candle: { close: 75, high: 100, low: 0, open: 25 },
  category: "Mon",
  color: "green",
  direction: "up",
  range: [0, 100],
};

/**
 * Renders the candle in a bar 20px wide from 40 to 240px, two pixels per unit, and returns the
 * container.
 */
function drawn(props: Partial<CandleShapeProps> = {}): Element {
  return render(
    <svg>
      <CandleShape height={200} payload={ROW} width={20} x={100} y={40} {...props} />
    </svg>,
  ).container;
}

/**
 * Returns the named attributes of an element, an empty string for each it lacks.
 */
function attributesOf(element: Element | null | undefined, names: readonly string[]): string[] {
  return names.map((name) => element?.getAttribute(name) ?? "");
}

describe("CandleShape", () => {
  it("renders nothing without a row", () => {
    expect(drawn({ payload: undefined }).querySelector("svg")?.childElementCount).toBe(0);
  });

  it("runs the wick from the high to the low through the middle", () => {
    expect(attributesOf(drawn().querySelector("line"), ["x1", "x2", "y1", "y2"])).toStrictEqual([
      "110",
      "110",
      "40",
      "240",
    ]);
  });

  it("renders the body from the higher of open and close to the lower", () => {
    expect(attributesOf(drawn().querySelector("rect"), ["y", "height"])).toStrictEqual([
      "90",
      "100",
    ]);
  });

  it("renders a falling body from the open to the close", () => {
    const payload = { ...ROW, candle: { ...ROW.candle, close: 25, open: 75 } };

    expect(attributesOf(drawn({ payload }).querySelector("rect"), ["y", "height"])).toStrictEqual([
      "90",
      "100",
    ]);
  });

  it("spans the body across the bar", () => {
    expect(attributesOf(drawn().querySelector("rect"), ["x", "width"])).toStrictEqual([
      "100",
      "20",
    ]);
  });

  it("renders a doji's body 1.5px high", () => {
    const payload = { ...ROW, candle: { ...ROW.candle, close: 50, open: 50 } };

    expect(drawn({ payload }).querySelector("rect")?.getAttribute("height")).toBe("1.5");
  });

  it("paints the wick and the body in the candle's color", () => {
    const container = drawn();

    expect([
      container.querySelector("line")?.getAttribute("stroke"),
      container.querySelector("rect")?.getAttribute("fill"),
    ]).toStrictEqual(["green", "green"]);
  });

  it.each([
    { active: false, edge: "0", wick: "1" },
    { active: true, edge: "2", wick: "2" },
  ])("widens the wick to $wick px and the edge to $edge px when active is $active", (want) => {
    const container = drawn({ active: want.active });

    expect([
      container.querySelector("line")?.getAttribute("stroke-width"),
      container.querySelector("rect")?.getAttribute("stroke-width"),
    ]).toStrictEqual([want.wick, want.edge]);
  });
});
