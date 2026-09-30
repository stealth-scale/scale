import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { laidOut, pathsOf } from "#cartesian/cartesian.fixtures.ts";
import { RangeChart, type RangeChartProps } from "#range-chart/range-chart.tsx";

/**
 * Describes one day of a forecast: its low end, its estimate and its high end.
 */
interface Forecast {
  readonly day: string;
  readonly estimate: number;
  readonly high: number;
  readonly low: number;
}

/**
 * Lists three days of a forecast.
 */
const FORECAST: Forecast[] = [
  { day: "2026-09-21", estimate: 120, high: 140, low: 100 },
  { day: "2026-09-22", estimate: 180, high: 200, low: 150 },
  { day: "2026-09-23", estimate: 150, high: 170, low: 120 },
];

/**
 * Renders the chart over the forecast with its band, an estimate line and the props a case
 * changes.
 */
function drawn(props: Partial<RangeChartProps<Forecast>> = {}): Element {
  laidOut();

  return render(
    <RangeChart
      band={{ high: "high", key: "range", label: "Likely range", low: "low" }}
      categoryKey="day"
      data={FORECAST}
      label="Forecast"
      locale="en-US"
      series={[{ key: "estimate", label: "Estimate" }]}
      {...props}
    />,
  ).container;
}

describe("RangeChart", () => {
  it("fills the band at 0.2 opacity", () => {
    expect(drawn().querySelector(".recharts-area-area")?.getAttribute("fill-opacity")).toBe("0.2");
  });

  it("renders the band without an edge", () => {
    const container = drawn();

    expect(
      [".recharts-area-area", ".recharts-area-curve"].map(
        (part) => container.querySelectorAll(part).length,
      ),
    ).toStrictEqual([1, 0]);
  });

  it("renders a line per series over the band", () => {
    expect(drawn().querySelectorAll(".recharts-line-curve")).toHaveLength(1);
  });

  it("renders the band alone without series", () => {
    expect(drawn({ series: undefined }).querySelector(".recharts-line-curve")).toBeNull();
  });

  it("names the band in the legend by its label", () => {
    expect(
      [...drawn().querySelectorAll(".chart__legend button")].map((button) => button.textContent),
    ).toStrictEqual(["Likely range", "Estimate"]);
  });

  it("writes the band's two ends in the tooltip as a range", () => {
    expect(
      [...drawn({ defaultIndex: 0 }).querySelectorAll(".chart__value")].map(
        (value) => value.textContent,
      ),
    ).toStrictEqual(["100–140", "120"]);
  });

  it("smooths the band's edges by default", () => {
    expect(drawn().querySelector(".recharts-area-area")?.getAttribute("d")).toContain("C");
  });

  it("renders straight band edges when curve is linear", () => {
    const band = drawn({ curve: "linear" }).querySelector(".recharts-area-area");

    expect(band?.getAttribute("d")).not.toContain("C");
  });

  it("renders straight lines over the band when curve is linear", () => {
    expect(pathsOf(drawn({ curve: "linear" }))[0]).not.toContain("C");
  });
});
