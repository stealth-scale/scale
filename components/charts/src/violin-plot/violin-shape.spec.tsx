import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type BoxSummary } from "#stats/box.ts";
import { type ViolinRow, ViolinShape, type ViolinShapeProps } from "#violin-plot/violin-shape.tsx";

/**
 * Summary of values from 0 to 100 without outliers.
 */
const SUMMARY: BoxSummary = {
  count: 10,
  iqr: 50,
  max: 100,
  median: 50,
  min: 0,
  outliers: [],
  q1: 25,
  q3: 75,
  whiskerHigh: 100,
  whiskerLow: 0,
};

/**
 * Row of one group whose density is densest at 50.
 */
const ROW: ViolinRow = {
  density: [
    { density: 1, value: 0 },
    { density: 4, value: 50 },
    { density: 2, value: 100 },
  ],
  key: "north",
  label: "North",
  peaks: [50],
  range: [0, 100],
  summary: SUMMARY,
  widest: 4,
};

/**
 * Renders the violin in a bar 40px wide from 40 to 240px, two pixels per unit, and returns the
 * container.
 */
function drawn(props: Partial<ViolinShapeProps> = {}): Element {
  return render(
    <svg>
      <ViolinShape fill="red" height={200} payload={ROW} width={40} x={100} y={40} {...props} />
    </svg>,
  ).container;
}

/**
 * Returns the named attributes of an element, an empty string for each it lacks.
 */
function attributesOf(element: Element | null | undefined, names: readonly string[]): string[] {
  return names.map((name) => element?.getAttribute(name) ?? "");
}

describe("ViolinShape", () => {
  it("renders nothing without a row", () => {
    expect(drawn({ payload: undefined }).querySelector("svg")?.childElementCount).toBe(0);
  });

  it("mirrors the density about the middle of the bar", () => {
    expect(drawn().querySelector("polygon")?.getAttribute("points")).toBe(
      "125,240 140,140 130,40 110,40 100,140 115,240",
    );
  });

  it("renders the outline on the middle while no point has density", () => {
    expect(
      drawn({ payload: { ...ROW, widest: 0 } })
        .querySelector("polygon")
        ?.getAttribute("points"),
    ).toBe("120,240 120,140 120,40 120,40 120,140 120,240");
  });

  it("paints the outline in the bar's fill", () => {
    expect(attributesOf(drawn().querySelector("polygon"), ["fill", "stroke"])).toStrictEqual([
      "red",
      "red",
    ]);
  });

  it("paints the outline in currentColor without a fill", () => {
    expect(drawn({ fill: undefined }).querySelector("polygon")?.getAttribute("fill")).toBe(
      "currentColor",
    );
  });

  it.each([
    { active: false, edge: "1", opacity: "0.28" },
    { active: true, edge: "2", opacity: "0.5" },
  ])("fills the outline at $opacity inside a $edge px edge when active is $active", (want) => {
    expect(
      attributesOf(drawn({ active: want.active }).querySelector("polygon"), [
        "fill-opacity",
        "stroke-width",
      ]),
    ).toStrictEqual([want.opacity, want.edge]);
  });

  it("runs the whisker line from the upper whisker to the lower", () => {
    expect(
      attributesOf(drawn().querySelector(".chart-whisker"), ["x1", "x2", "y1", "y2"]),
    ).toStrictEqual(["120", "120", "40", "240"]);
  });

  it("renders the quartile bar from the third quartile to the first", () => {
    expect(attributesOf(drawn().querySelector(".chart-quartiles"), ["y", "height"])).toStrictEqual([
      "90",
      "100",
    ]);
  });

  it("centres a 3px quartile bar in a narrow violin", () => {
    expect(attributesOf(drawn().querySelector(".chart-quartiles"), ["x", "width"])).toStrictEqual([
      "118.5",
      "3",
    ]);
  });

  it("widens the quartile bar to 0.055 of a wide violin", () => {
    expect(
      attributesOf(drawn({ width: 200 }).querySelector(".chart-quartiles"), ["x", "width"]),
    ).toStrictEqual(["194.5", "11"]);
  });

  it("renders the median as a point at its value", () => {
    expect(
      attributesOf(drawn().querySelector("circle.chart-median"), ["cx", "cy", "r"]),
    ).toStrictEqual(["120", "140", "2.5"]);
  });

  it("sizes the median point to the quartile bar of a wide violin", () => {
    expect(
      Number(drawn({ width: 200 }).querySelector("circle.chart-median")?.getAttribute("r")),
    ).toBeCloseTo(6.05, 9);
  });

  it("renders no marker while quartiles is false", () => {
    expect(
      drawn({ quartiles: false }).querySelectorAll(
        ".chart-whisker, .chart-quartiles, .chart-median",
      ),
    ).toHaveLength(0);
  });
});
