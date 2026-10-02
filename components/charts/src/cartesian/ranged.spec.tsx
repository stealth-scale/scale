import { type ReactElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { laidOut } from "#cartesian/cartesian.fixtures.ts";
import { type BarBox } from "#cartesian/placement.ts";
import { RANGE, rangedPlotOf, type RangedPlotOptions } from "#cartesian/ranged.tsx";
import { API, charted } from "#chart/chart.fixtures.tsx";
import { Plot } from "#chart/plot.tsx";
import { type ChartApi } from "#chart/use-chart.ts";

/**
 * Describes the props of the probe shape: the bar recharts passes and whether it is the active one.
 */
interface ProbeProps extends BarBox {
  readonly active: boolean;
}

/**
 * Renders the bar recharts passes as a `rect` that states whether it is the active one.
 */
function Probe({ active, height, width, x, y }: ProbeProps): ReactElement {
  return (
    <rect
      className="probe"
      data-active={active ? "yes" : "no"}
      height={height}
      width={width}
      x={x}
      y={y}
    />
  );
}

/**
 * Chart of two rows, each with a range.
 */
const CHART: ChartApi = {
  ...API,
  data: [
    { name: "North", range: [1010, 1040] },
    { name: "South", range: [1060, 1090] },
  ],
};

/**
 * Renders the plot of the rows inside a chart's root with the options a case changes, and returns
 * the container.
 */
function drawn(options: Partial<RangedPlotOptions> = {}): Element {
  laidOut();

  return render(
    charted({
      children: (
        <Plot>
          {rangedPlotOf({
            activeShape: <Probe active />,
            animate: false,
            categoryKey: "name",
            chart: CHART,
            facts: () => [{ key: "median", name: "Median", value: "1,025" }],
            formatValue: (value) => `${String(value)} ms`,
            grid: true,
            label: "Ranges",
            shape: <Probe active={false} />,
            widest: 30,
            ...options,
          })}
        </Plot>
      ),
    }),
  ).container;
}

/**
 * Returns the text of every element a selector matches inside a container, in document order.
 */
function textsOf(container: Element, selector: string): string[] {
  return [...container.querySelectorAll(selector)].map((element) => element.textContent);
}

describe("rangedPlotOf", () => {
  it("names the series key range", () => {
    expect(RANGE).toBe("range");
  });

  it("renders a shape per row over its range", () => {
    expect(drawn().querySelectorAll(".probe")).toHaveLength(2);
  });

  it("renders the shapes at rest without a default index", () => {
    expect(
      [...drawn().querySelectorAll<SVGElement>(".probe")].map((probe) => probe.dataset["active"]),
    ).toStrictEqual(["no", "no"]);
  });

  it("renders the active row's shape as activeShape", () => {
    expect(
      [...drawn({ defaultIndex: 0 }).querySelectorAll<SVGElement>(".probe")].map(
        (probe) => probe.dataset["active"],
      ),
    ).toStrictEqual(["no", "yes"]);
  });

  it("renders each shape at most widest pixels wide", () => {
    expect(
      [...drawn().querySelectorAll(".probe")].map((probe) => probe.getAttribute("width")),
    ).toStrictEqual(["30", "30"]);
  });

  it("writes the value ticks with formatValue", () => {
    expect(textsOf(drawn(), ".recharts-yAxis-tick-labels text").at(-1)).toBe("1100 ms");
  });

  it("rounds the value axis around the values unless a domain is stated", () => {
    expect(textsOf(drawn(), ".recharts-yAxis-tick-labels text").at(0)).toBe("1000 ms");
  });

  it("sets the value axis' domain by valueDomain", () => {
    expect(
      textsOf(drawn({ valueDomain: [0, 2000] }), ".recharts-yAxis-tick-labels text").at(0),
    ).toBe("0 ms");
  });

  it("steps the value ticks by niceTicks", () => {
    const chart = { ...CHART, data: [{ name: "North", range: [182.4, 214.9] }] };

    expect(
      [undefined, "snap125" as const].map((niceTicks) =>
        textsOf(drawn({ chart, niceTicks }), ".recharts-yAxis-tick-labels text").at(-1),
      ),
    ).toStrictEqual(["216 ms", "220 ms"]);
  });

  it("writes the category ticks with formatLabel", () => {
    expect(
      textsOf(
        drawn({ formatLabel: (value) => `${String(value)}!` }),
        ".recharts-xAxis-tick-labels text",
      ).at(-1),
    ).toBe("South!");
  });

  it("heads the tooltip with formatLabel", () => {
    expect(
      textsOf(
        drawn({ defaultIndex: 1, formatLabel: (value) => `${String(value)}!` }),
        ".chart__heading",
      ),
    ).toStrictEqual(["South!"]);
  });

  it("writes the tooltip's rows from facts", () => {
    expect(textsOf(drawn({ defaultIndex: 0 }), ".chart__row")).toStrictEqual(["Median1,025"]);
  });

  it("renders a grid line at every value tick", () => {
    const container = drawn();

    expect(
      [
        ".recharts-cartesian-grid-horizontal line",
        ".recharts-yAxis-tick-labels .recharts-cartesian-axis-tick-value",
      ].map((selector) => container.querySelectorAll(selector).length),
    ).toStrictEqual([5, 5]);
  });

  it("renders no grid when grid is off", () => {
    expect(drawn({ grid: false }).querySelector(".recharts-cartesian-grid")).toBeNull();
  });

  it("renders recharts children inside the chart", () => {
    expect(drawn({ children: <g className="child" /> }).querySelector(".child")).not.toBeNull();
  });

  it("renders every shape at its full height without animate", () => {
    vi.useFakeTimers();

    const heights = [...drawn().querySelectorAll(".probe")].map((probe) =>
      Number(probe.getAttribute("height")),
    );

    vi.useRealTimers();

    expect(Math.min(...heights)).toBeGreaterThan(0);
  });

  it("starts every shape at no height when animate is set", () => {
    vi.useFakeTimers();

    const heights = [...drawn({ animate: true }).querySelectorAll(".probe")].map((probe) =>
      probe.getAttribute("height"),
    );

    vi.useRealTimers();

    expect(heights).toStrictEqual(["0", "0"]);
  });
});
