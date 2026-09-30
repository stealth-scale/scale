import { render } from "@testing-library/react";
import { Bar, BarChart, XAxis } from "recharts";
import { describe, expect, it } from "vitest";

import { barsOf, laidOut } from "#cartesian/cartesian.fixtures.ts";
import { BinShape } from "#histogram-chart/bin-shape.tsx";

/**
 * Lists two bins of 0 to 100, with a count for each of two series.
 */
const BINS = [
  { first: 1, from: 0, middle: 25, second: 3, to: 50 },
  { first: 2, from: 50, middle: 75, second: 4, to: 100 },
];

/**
 * Renders the bins with a bar per series, each rendered by the shape at its place among the series
 * shown, and returns the container.
 */
function drawn(keys: readonly string[], rows: readonly object[] = BINS): Element {
  laidOut();

  return render(
    <BarChart barCategoryGap={0} data={[...rows]} height={270} width={480}>
      <XAxis dataKey="middle" domain={[0, 100]} type="number" />
      {keys.map((key, place) => (
        <Bar
          dataKey={key}
          isAnimationActive={false}
          key={key}
          shape={<BinShape place={place} shown={keys.length} />}
        />
      ))}
    </BarChart>,
  ).container;
}

/**
 * Returns the plot's start and width from its clip path.
 */
function plotOf(container: Element): [number, number] {
  const rect = container.querySelector("clipPath rect");

  return [Number(rect?.getAttribute("x")), Number(rect?.getAttribute("width"))];
}

describe("BinShape", () => {
  it("renders the bar of one series across its bin", () => {
    const container = drawn(["first"]);
    const [start, width] = plotOf(container);
    const [first] = barsOf(container);

    expect([first?.x, first?.width]).toStrictEqual([start, width / 2]);
  });

  it("renders the next bin's bar from the edge the first ends at", () => {
    const container = drawn(["first"]);
    const [start, width] = plotOf(container);
    const [, second] = barsOf(container);

    expect(second?.x).toBeCloseTo(start + width / 2, 6);
  });

  it("gives each series shown its share of the bin in the order of the series", () => {
    const container = drawn(["first", "second"]);
    const [start, width] = plotOf(container);
    const bars = barsOf(container);

    expect(bars.map((bar) => [bar.x, bar.width])).toStrictEqual([
      [start, width / 4],
      [start + width / 2, width / 4],
      [start + width / 4, width / 4],
      [start + (3 * width) / 4, width / 4],
    ]);
  });

  it("renders nothing for a row without an upper edge", () => {
    expect(barsOf(drawn(["first"], [{ first: 1, from: 0, middle: 25 }]))).toStrictEqual([]);
  });

  it("renders nothing outside a chart", () => {
    const { container } = render(
      <svg>
        <BinShape height={10} payload={BINS[0]} place={0} shown={1} width={10} x={0} y={0} />
      </svg>,
    );

    expect(container.querySelector("path")).toBeNull();
  });
});
