import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, expectTypeOf, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { laidOut } from "#cartesian/cartesian.fixtures.ts";
import { RadarChart, type RadarChartProps } from "#radar-chart/radar-chart.tsx";

/**
 * Describes one spoke of the fixture: its dimension and two quarters' scores.
 */
interface Score {
  readonly current: number;
  readonly dimension: string;
  readonly previous: number;
}

/**
 * Lists five dimensions scored out of 10 over two quarters.
 */
const SCORES: Score[] = [
  { current: 8, dimension: "Latency", previous: 6 },
  { current: 7, dimension: "Throughput", previous: 7 },
  { current: 4, dimension: "Cost", previous: 6 },
  { current: 9, dimension: "Reliability", previous: 8 },
  { current: 6, dimension: "Coverage", previous: 4 },
];

/**
 * Lists the fixture's two series.
 */
const SERIES: RadarChartProps<Score>["series"] = [
  { key: "current", label: "This quarter" },
  { key: "previous", label: "Last quarter" },
];

/**
 * Renders the chart over the fixture scores, with the props a case changes.
 */
function drawn(props: Partial<RadarChartProps<Score>> = {}): ReturnType<typeof render> {
  laidOut();

  return render(
    <RadarChart
      categoryKey="dimension"
      data={SCORES}
      label="Service scores"
      series={SERIES}
      {...props}
    />,
  );
}

/**
 * Returns the text of every radius tick inside a container.
 */
function radiiOf(container: Element): string[] {
  return [...container.querySelectorAll(".recharts-polar-radius-axis-tick-value")].map(
    (tick) => tick.textContent,
  );
}

describe("RadarChart", () => {
  it("returns no accessibility violation", async () => {
    laidOut();

    await expect(
      accessibilityViolations(() => (
        <RadarChart
          caption="Cost is the only score that fell."
          categoryKey="dimension"
          data={SCORES}
          label="Service scores"
          series={SERIES}
        />
      )),
    ).resolves.toStrictEqual([]);
  });

  it("names the keyboard layer by the label", () => {
    const { container } = drawn();

    expect(container.querySelector(".recharts-surface title")?.textContent).toBe("Service scores");
  });

  it("names the figure by its caption", () => {
    const { getByRole } = drawn({ caption: "Cost is the only score that fell." });

    expect(getByRole("figure", { name: "Cost is the only score that fell." })).toBeDefined();
  });

  it("renders a polygon per series", () => {
    const { container } = drawn();

    expect(container.querySelectorAll(".recharts-radar-polygon")).toHaveLength(2);
  });

  it("takes no annotations", () => {
    expect(SERIES).toHaveLength(2);

    expectTypeOf<RadarChartProps<Score>>().not.toHaveProperty("annotations");
  });

  it("names each spoke by the category field", () => {
    const { container } = drawn();

    expect(
      [...container.querySelectorAll(".recharts-polar-angle-axis-tick-value")].map(
        (tick) => tick.textContent,
      ),
    ).toStrictEqual(["Latency", "Throughput", "Cost", "Reliability", "Coverage"]);
  });

  it("writes the spokes' names with labelOptions", () => {
    const { container } = drawn({
      categoryKey: "current",
      labelOptions: { day: "numeric", month: "short", timeZone: "UTC" },
      locale: "en-US",
    });

    expect(container.querySelector(".recharts-polar-angle-axis-tick-value")?.textContent).toBe(
      "Jan 1",
    );
  });

  it("renders the web unless stated", () => {
    const { container } = drawn();

    expect(container.querySelector(".recharts-polar-grid")).not.toBeNull();
  });

  it("renders no web when grid is off", () => {
    const { container } = drawn({ grid: false });

    expect(container.querySelector(".recharts-polar-grid")).toBeNull();
  });

  it("writes no radius ticks unless scale is on", () => {
    const { container } = drawn();

    expect(radiiOf(container)).toStrictEqual([]);
  });

  it("writes six radius ticks over valueDomain when scale is on", () => {
    const { container } = drawn({ locale: "en-US", scale: true, valueDomain: [0, 100] });

    expect(radiiOf(container)).toStrictEqual(["0", "20", "40", "60", "80", "100"]);
  });

  it("writes fractional radius ticks for a top of 1", () => {
    const { container } = drawn({
      data: [
        { current: 0.8, dimension: "Latency", previous: 0.6 },
        { current: 0.4, dimension: "Cost", previous: 0.6 },
        { current: 0.9, dimension: "Reliability", previous: 0.8 },
      ],
      locale: "en-US",
      scale: true,
      valueDomain: [0, 1],
    });

    expect(radiiOf(container)).toStrictEqual(["0", "0.2", "0.4", "0.6", "0.8", "1"]);
  });

  it("writes the radius ticks up the spoke at 12 o'clock", () => {
    const { container } = drawn({ scale: true, valueDomain: [0, 10] });
    const ticks = [...container.querySelectorAll(".recharts-polar-radius-axis-tick-value")];
    const center = container.querySelector(".recharts-polar-grid-angle line")?.getAttribute("x1");

    expect(new Set(ticks.map((tick) => tick.getAttribute("x")))).toStrictEqual(new Set([center]));
  });

  it("renders no radius axis line", () => {
    const { container } = drawn({ scale: true });

    expect(container.querySelector(".recharts-polar-radius-axis-line")).toBeNull();
  });

  it("renders a polygon unfilled when its series is not filled", () => {
    const { container } = drawn({
      series: [{ filled: false, key: "current" }, { key: "previous" }],
    });

    expect(
      [...container.querySelectorAll(".recharts-radar-polygon path")].map((path) =>
        path.getAttribute("fill-opacity"),
      ),
    ).toStrictEqual(["0", "0.25"]);
  });

  it("writes the radius ticks with valueOptions", () => {
    const { container } = drawn({
      locale: "en-US",
      scale: true,
      valueDomain: [0, 10],
      valueOptions: { minimumFractionDigits: 1 },
    });

    expect(radiiOf(container).at(-1)).toBe("10.0");
  });

  it("rounds the radius axis from zero around the scores unless stated", () => {
    const { container } = drawn({ locale: "en-US", scale: true });

    expect([radiiOf(container)[0], radiiOf(container).at(-1)]).toStrictEqual(["0", "10"]);
  });

  it("opens the tooltip at the spoke defaultIndex names", () => {
    const { container } = drawn({ defaultIndex: 2 });

    expect(container.querySelector(".chart__tooltip .chart__heading")?.textContent).toBe("Cost");
  });

  it("writes each series' value at the spoke in the tooltip", () => {
    const { container } = drawn({ defaultIndex: 2, locale: "en-US" });

    expect(
      [...container.querySelectorAll(".chart__tooltip .chart__row")].map((row) => row.textContent),
    ).toStrictEqual(["This quarter4", "Last quarter6"]);
  });

  it("writes the tooltip's values with valueOptions", () => {
    const { container } = drawn({
      defaultIndex: 2,
      locale: "en-US",
      valueOptions: { minimumFractionDigits: 1 },
    });

    expect(container.querySelector(".chart__tooltip .chart__value")?.textContent).toBe("4.0");
  });

  it("renders the legend for two series", () => {
    const { getByRole } = drawn({ legendLabel: "Quarters" });

    expect(getByRole("group", { name: "Quarters" })).toBeDefined();
  });

  it("renders no legend for one series", () => {
    const { container } = drawn({ series: [{ key: "current", label: "This quarter" }] });

    expect(container.querySelector("fieldset")).toBeNull();
  });

  it("renders the legend for one series when legend is on", () => {
    const { container } = drawn({ legend: true, series: [{ key: "current" }] });

    expect(container.querySelector("fieldset")).not.toBeNull();
  });

  it("renders no legend without rows", () => {
    const { container } = drawn({ data: [] });

    expect(container.querySelector("fieldset")).toBeNull();
  });

  it("hides a series' polygon when the legend hides it", () => {
    const { container, getByRole } = drawn();

    act(() => {
      fireEvent.click(getByRole("button", { name: "Last quarter" }));
    });

    expect(container.querySelectorAll(".recharts-radar-polygon")).toHaveLength(1);
  });

  it("renders No data in the plot's place without rows", () => {
    const { container } = drawn({ data: [] });

    expect(container.querySelector(".chart__empty")?.textContent).toBe("No data");
  });

  it("renders the stated message without rows", () => {
    const { container } = drawn({ data: [], empty: "No scores yet." });

    expect(container.querySelector(".chart__empty")?.textContent).toBe("No scores yet.");
  });

  it("gives the plot the landscape ratio unless stated", () => {
    const { container } = drawn();

    expect(container.querySelector(".chart__plot--landscape")).not.toBeNull();
  });

  it("passes the ratio to the figure", () => {
    const { container } = drawn({ ratio: "square" });

    expect(container.querySelector(".chart__plot--square")).not.toBeNull();
  });

  it("renders the children inside the chart", () => {
    const { container } = drawn({ children: <g className="probe" /> });

    expect(container.querySelector(".recharts-surface .probe")).not.toBeNull();
  });

  it("renders no caption without one", () => {
    const { container } = drawn();

    expect(container.querySelector("figcaption")).toBeNull();
  });

  it("extends each spoke to 72% of the plot's largest radius", () => {
    const { container } = drawn();
    const spoke = container.querySelector(".recharts-polar-grid-angle line");
    const [x1, y1, x2, y2] = ["x1", "y1", "x2", "y2"].map((name) =>
      Number(spoke?.getAttribute(name)),
    );

    expect(Math.hypot((x2 ?? 0) - (x1 ?? 0), (y2 ?? 0) - (y1 ?? 0))).toBeCloseTo(93.6);
  });
});
