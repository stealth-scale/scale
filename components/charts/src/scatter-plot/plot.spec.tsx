import { describe, expect, it } from "vitest";

import {
  drawn,
  NAMES,
  scored,
  textsOf,
  type Vendor,
} from "#scatter-plot/scatter-plot.fixtures.tsx";

/**
 * Lists three vendors whose middle one scores 0.65 on both axes, between the middle of 0 to 1 and
 * the middle of the three scores, 0.7.
 */
const SPREAD: Vendor[] = [
  { execution: 0.4, name: "Low", vision: 0.4 },
  { execution: 1, name: "High", vision: 1 },
  { execution: 0.65, name: "Mid", vision: 0.65 },
];

/**
 * Returns the heading of the tooltip at the middle vendor, whose quadrant shows where the plot
 * divides.
 */
function middleOf(props: Parameters<typeof scored>[0]): string[] {
  return textsOf(
    scored({ defaultIndex: 2, series: [{ key: "vendors", points: SPREAD }], ...props }),
    ".chart__heading",
  );
}

describe("plot", () => {
  it("renders a symbol per point", () => {
    expect(drawn().querySelectorAll(".recharts-symbols")).toHaveLength(5);
  });

  it("fills each series' points with its series color", () => {
    const fills = [...drawn().querySelectorAll(".recharts-scatter")].map((scatter) =>
      scatter.querySelector(".recharts-symbols")?.getAttribute("fill"),
    );

    expect(fills).toStrictEqual(["var(--colors-series-1)", "var(--colors-series-2)"]);
  });

  it("titles both axes", () => {
    expect(textsOf(drawn(), ".recharts-label")).toStrictEqual(["Deal size", "Days to close"]);
  });

  it("names the keyboard layer by the label", () => {
    expect(drawn().querySelector(".recharts-surface title")?.textContent).toBe(
      "Days to close by deal size",
    );
  });

  it.each([
    { axis: "x", grid: "vertical" },
    { axis: "y", grid: "horizontal" },
  ])("renders 7 $grid grid lines over the $axis axis' 5 ticks and 2 edges", ({ axis, grid }) => {
    const container = drawn();

    expect(
      [
        `.recharts-cartesian-grid-${grid} line`,
        `.recharts-${axis}Axis-tick-labels .recharts-cartesian-axis-tick-value`,
      ].map((selector) => container.querySelectorAll(selector).length),
    ).toStrictEqual([7, 5]);
  });

  it("renders the plot's 2 edges alone as vertical grid lines along an x axis with named ends", () => {
    expect(
      scored({ xEnds: ["Low", "High"] }).querySelectorAll(".recharts-cartesian-grid-vertical line"),
    ).toHaveLength(2);
  });

  it("renders the plot's 2 edges alone as horizontal grid lines along a y axis with named ends", () => {
    expect(
      scored({ yEnds: ["Low", "High"] }).querySelectorAll(
        ".recharts-cartesian-grid-horizontal line",
      ),
    ).toHaveLength(2);
  });

  it("renders no grid when grid is off", () => {
    expect(drawn({ grid: false }).querySelector(".recharts-cartesian-grid")).toBeNull();
  });

  it("renders recharts children inside the chart", () => {
    const container = drawn({ children: <g className="probe" /> });

    expect(container.querySelector(".probe")).not.toBeNull();
  });

  it("renders the two dividing lines with quadrants", () => {
    expect(scored().querySelectorAll(".chart-division line")).toHaveLength(2);
  });

  it("renders no dividing line without quadrants", () => {
    expect(drawn().querySelector(".chart-division")).toBeNull();
  });

  it("divides at the middle of each stated domain", () => {
    expect(middleOf({})).toStrictEqual(["Mid, Leaders"]);
  });

  it("divides at the middle of the points' values without a stated domain", () => {
    expect(middleOf({ xDomain: undefined, yDomain: undefined })).toStrictEqual(["Mid, Niche"]);
  });

  it("divides an axis with named ends at the middle of 0 to 1", () => {
    expect(
      middleOf({
        xDomain: undefined,
        xEnds: ["Low", "High"],
        yDomain: undefined,
        yEnds: ["Low", "High"],
      }),
    ).toStrictEqual(["Mid, Leaders"]);
  });

  it("divides at the values the quadrants state", () => {
    expect(middleOf({ quadrants: { names: NAMES, x: 0.9, y: 0.9 } })).toStrictEqual(["Mid, Niche"]);
  });

  it("writes each point's words beside it with a label field", () => {
    expect(textsOf(scored(), ".chart-point-label")).toStrictEqual([
      "Alder",
      "Birch",
      "Cedar",
      "Maple",
    ]);
  });

  it("writes no words beside the points without a label field", () => {
    expect(drawn().querySelector(".chart-point-label")).toBeNull();
  });

  it("names the ends of an axis in place of its ticks", () => {
    expect(
      textsOf(
        scored({ xEnds: ["Blurry", "Clear"] }),
        ".recharts-xAxis-tick-labels .recharts-cartesian-axis-tick-value",
      ),
    ).toStrictEqual(["Blurry", "Clear"]);
  });
});
