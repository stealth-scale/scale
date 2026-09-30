import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { laidOut, pathsOf, ROWS, ticksOf } from "#cartesian/cartesian.fixtures.ts";
import { type ComboSeries } from "#cartesian/types.ts";
import { ComboChart, type ComboChartProps } from "#combo-chart/combo-chart.tsx";

/**
 * Lists paid payouts as bars and refunds as a line on the end axis.
 */
const MIXED: readonly ComboSeries[] = [
  { key: "paid", label: "Paid", mark: "bar" },
  { axis: "end", key: "refunded", label: "Refunded", mark: "line" },
];

/**
 * Renders the chart over the fixture rows with the props a case changes.
 */
function drawn(props: Partial<ComboChartProps<(typeof ROWS)[number]>> = {}): Element {
  laidOut();

  return render(
    <ComboChart categoryKey="day" data={ROWS} label="Payouts" series={MIXED} {...props} />,
  ).container;
}

describe("ComboChart", () => {
  it("renders each series as the mark it states", () => {
    const container = drawn();

    expect(
      [".recharts-bar-rectangle", ".recharts-line-curve"].map(
        (mark) => container.querySelectorAll(mark).length,
      ),
    ).toStrictEqual([3, 1]);
  });

  it("renders an end axis for a series that reads it", () => {
    expect(drawn().querySelectorAll(".recharts-yAxis")).toHaveLength(2);
  });

  it("renders one value axis while every series reads the start axis", () => {
    const container = drawn({ series: [{ key: "paid", mark: "bar" }] });

    expect(container.querySelectorAll(".recharts-yAxis")).toHaveLength(1);
  });

  it("writes the end axis' ticks with the end options", () => {
    expect(ticksOf(drawn({ endOptions: { style: "percent" } })).at(-1)).toBe("3,200%");
  });

  it("smooths each line by default", () => {
    expect(pathsOf(drawn())[0]).toContain("C");
  });

  it("renders straight lines when curve is linear", () => {
    expect(pathsOf(drawn({ curve: "linear" }))[0]).not.toContain("C");
  });
});
