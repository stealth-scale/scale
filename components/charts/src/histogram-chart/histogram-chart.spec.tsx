import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { barsOf, laidOut } from "#cartesian/cartesian.fixtures.ts";
import { HistogramChart, type HistogramChartProps } from "#histogram-chart/histogram-chart.tsx";

/**
 * Lists twenty response times in milliseconds, which fall into bins 20 wide.
 */
const LATENCIES = [
  12, 18, 21, 25, 30, 33, 35, 38, 41, 44, 47, 52, 55, 61, 68, 74, 88, 120, 180, 410,
];

/**
 * Renders the response times with the props a case changes, and returns the container.
 */
function drawn(props: Partial<HistogramChartProps> = {}): Element {
  laidOut();

  return render(
    <HistogramChart label="Response times" locale="en-US" values={LATENCIES} {...props} />,
  ).container;
}

/**
 * Returns the edge axis' labels inside a container, of which recharts in happy-dom keeps the last.
 */
function edgeLabelsOf(container: Element): string[] {
  return [
    ...container.querySelectorAll(
      ".recharts-xAxis-tick-labels .recharts-cartesian-axis-tick-value",
    ),
  ].map((label) => label.textContent);
}

/**
 * Returns the text of every element a selector matches inside a container, in document order.
 */
function textsOf(container: Element, selector: string): string[] {
  return [...container.querySelectorAll(selector)].map((element) => element.textContent);
}

describe("HistogramChart", () => {
  it("returns no accessibility violation", async () => {
    laidOut();

    await expect(
      accessibilityViolations(() => (
        <HistogramChart
          caption="Most requests finish under 100 ms."
          label="Response times"
          values={LATENCIES}
        />
      )),
    ).resolves.toStrictEqual([]);
  });

  it("renders a bar per bin that contains a value", () => {
    expect(barsOf(drawn({ bins: 5 }))).toHaveLength(3);
  });

  it("renders each bar from its lower edge to the next bar", () => {
    const [first, second] = barsOf(drawn({ domain: [0, 100], values: [10, 30, 60] }));

    expect((first?.x ?? 0) + (first?.width ?? 0)).toBeCloseTo(second?.x ?? -1, 6);
  });

  it("starts the first bar at the start of the plot", () => {
    const container = drawn({ domain: [0, 100], values: [10, 30, 60] });
    const [first] = barsOf(container);

    expect(first?.x).toBeCloseTo(
      Number(container.querySelector("clipPath rect")?.getAttribute("x")),
      6,
    );
  });

  it("ends the last bar at the end of the plot", () => {
    const container = drawn({ bins: 23, values: [0, 230] });
    const last = barsOf(container).at(-1);
    const plot = container.querySelector("clipPath rect");

    expect((last?.x ?? 0) + (last?.width ?? 0)).toBeCloseTo(
      Number(plot?.getAttribute("x")) + Number(plot?.getAttribute("width")),
      6,
    );
  });

  it("labels the edges at an even step", () => {
    expect(edgeLabelsOf(drawn({ bins: 9, values: [0, 90] })).at(-1)).toBe("80");
  });

  it("heads the tooltip with the bin's range", () => {
    expect(textsOf(drawn({ defaultIndex: 1 }), ".chart__heading")).toStrictEqual(["20–40"]);
  });

  it("writes the range with valueOptions", () => {
    const container = drawn({
      defaultIndex: 1,
      valueOptions: { style: "unit", unit: "millisecond", unitDisplay: "narrow" },
    });

    expect(textsOf(container, ".chart__heading")).toStrictEqual(["20–40ms"]);
  });

  it("writes the bin's count in the tooltip", () => {
    expect(textsOf(drawn({ defaultIndex: 1 }), ".chart__value")).toStrictEqual(["6"]);
  });

  it("names the count by countLabel", () => {
    expect(
      textsOf(drawn({ countLabel: "Requests", defaultIndex: 1 }), ".chart__name"),
    ).toStrictEqual(["Requests"]);
  });

  it("names the count Count unless stated", () => {
    expect(textsOf(drawn({ defaultIndex: 1 }), ".chart__name")).toStrictEqual(["Count"]);
  });

  it("fills the bars with the theme's first series color", () => {
    expect(drawn().querySelector(".recharts-bar-rectangle path")?.getAttribute("fill")).toBe(
      "var(--colors-series-1)",
    );
  });

  it("fills the bars with the chart color of the palette color names", () => {
    expect(
      drawn({ color: "accent" })
        .querySelector(".recharts-bar-rectangle path")
        ?.getAttribute("fill"),
    ).toBe("var(--colors-accent-chart)");
  });

  it("renders No data in the plot's place without a finite value", () => {
    expect(textsOf(drawn({ values: ["n/a"] }), ".chart__empty")).toStrictEqual(["No data"]);
  });

  it("renders the empty message it states", () => {
    expect(textsOf(drawn({ empty: "No requests", values: [] }), ".chart__empty")).toStrictEqual([
      "No requests",
    ]);
  });

  it("renders a grid line at every count tick", () => {
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

  it("names the keyboard layer by the label", () => {
    expect(drawn().querySelector(".recharts-surface title")?.textContent).toBe("Response times");
  });

  it("names the figure by its caption", () => {
    expect(
      textsOf(drawn({ caption: "Most requests finish under 100 ms." }), "figcaption"),
    ).toStrictEqual(["Most requests finish under 100 ms."]);
  });

  it("renders recharts children inside the chart", () => {
    expect(drawn({ children: <g className="probe" /> }).querySelector(".probe")).not.toBeNull();
  });

  it("passes none of its own props to the figure", () => {
    const figure = drawn({
      animate: false,
      bins: 5,
      color: "accent",
      countLabel: "Requests",
    }).querySelector("figure");

    expect(figure?.getAttributeNames().toSorted()).toStrictEqual(["class", "data-recipe"]);
  });

  it("renders every bar at once without animate", () => {
    vi.useFakeTimers();

    const bars = barsOf(drawn());

    vi.useRealTimers();

    expect(bars.length).toBeGreaterThan(0);
  });

  it("starts every bar at no height when animate is set", () => {
    vi.useFakeTimers();

    const bars = barsOf(drawn({ animate: true }));

    vi.useRealTimers();

    expect(bars).toStrictEqual([]);
  });
});
