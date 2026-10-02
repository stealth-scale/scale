import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type BoxRow, BoxShape, type BoxShapeProps } from "#box-plot/box-shape.tsx";
import { type BoxSummary } from "#stats/box.ts";

/**
 * Summary of values from 0 to 100 with an outlier at each end.
 */
const SUMMARY: BoxSummary = {
  count: 12,
  iqr: 50,
  max: 100,
  median: 50,
  min: 0,
  outliers: [0, 100],
  q1: 25,
  q3: 75,
  whiskerHigh: 90,
  whiskerLow: 10,
};

/**
 * Row of one group with the summary.
 */
const ROW: BoxRow = { key: "north", label: "North", range: [0, 100], summary: SUMMARY };

/**
 * Renders the box in a bar 40px wide from 40 to 240px, two pixels per unit, and returns the
 * container.
 */
function drawn(props: Partial<BoxShapeProps> = {}): Element {
  return render(
    <svg>
      <BoxShape fill="red" height={200} payload={ROW} width={40} x={100} y={40} {...props} />
    </svg>,
  ).container;
}

/**
 * Returns the named attributes of an element, an empty string for each it lacks.
 */
function attributesOf(element: Element | null | undefined, names: readonly string[]): string[] {
  return names.map((name) => element?.getAttribute(name) ?? "");
}

/**
 * Returns the whisker lines inside a container: the upper whisker, the lower whisker, then the
 * upper cap and the lower cap.
 */
function whiskersOf(container: Element): Element[] {
  return [...container.querySelectorAll(".chart-whisker")];
}

describe("BoxShape", () => {
  it("renders nothing without a row", () => {
    expect(drawn({ payload: undefined }).querySelector("svg")?.childElementCount).toBe(0);
  });

  it("places the box from the third quartile to the first", () => {
    expect(attributesOf(drawn().querySelector("rect"), ["y", "height"])).toStrictEqual([
      "90",
      "100",
    ]);
  });

  it("spans the box across the bar", () => {
    expect(attributesOf(drawn().querySelector("rect"), ["x", "width"])).toStrictEqual([
      "100",
      "40",
    ]);
  });

  it("crosses the box with the median at its value", () => {
    expect(
      attributesOf(drawn().querySelector(".chart-median"), ["x1", "x2", "y1", "y2"]),
    ).toStrictEqual(["100", "140", "140", "140"]);
  });

  it("runs the upper whisker from its end to the box", () => {
    expect(attributesOf(whiskersOf(drawn())[0], ["x1", "x2", "y1", "y2"])).toStrictEqual([
      "120",
      "120",
      "60",
      "90",
    ]);
  });

  it("runs the lower whisker from the box to its end", () => {
    expect(attributesOf(whiskersOf(drawn())[1], ["x1", "x2", "y1", "y2"])).toStrictEqual([
      "120",
      "120",
      "190",
      "220",
    ]);
  });

  it("caps each whisker at 0.4 of the box's width", () => {
    const [, , upper, lower] = whiskersOf(drawn());

    expect([
      attributesOf(upper, ["x1", "x2", "y1"]),
      attributesOf(lower, ["x1", "x2", "y1"]),
    ]).toStrictEqual([
      ["112", "128", "60"],
      ["112", "128", "220"],
    ]);
  });

  it("caps a narrow box's whiskers 4px wide", () => {
    expect(attributesOf(whiskersOf(drawn({ width: 5 }))[2], ["x1", "x2"])).toStrictEqual([
      "100.5",
      "104.5",
    ]);
  });

  it("renders each outlier as a point at its value", () => {
    const points = [...drawn().querySelectorAll(".chart-outlier")];

    expect(points.map((point) => attributesOf(point, ["cx", "cy"]))).toStrictEqual([
      ["120", "240"],
      ["120", "40"],
    ]);
  });

  it("renders outliers of equal value as one point", () => {
    const summary = { ...SUMMARY, outliers: [0, 0, 100] };

    expect(drawn({ payload: { ...ROW, summary } }).querySelectorAll(".chart-outlier")).toHaveLength(
      2,
    );
  });

  it("edges each outlier in the box's color", () => {
    expect(drawn().querySelector(".chart-outlier")?.getAttribute("stroke")).toBe("red");
  });

  it("renders no outlier point while outliers is false", () => {
    expect(drawn({ outliers: false }).querySelectorAll(".chart-outlier")).toHaveLength(0);
  });

  it("paints the box in the bar's fill", () => {
    expect(attributesOf(drawn().querySelector("rect"), ["fill", "stroke"])).toStrictEqual([
      "red",
      "red",
    ]);
  });

  it("paints the box in currentColor without a fill", () => {
    expect(drawn({ fill: undefined }).querySelector("rect")?.getAttribute("fill")).toBe(
      "currentColor",
    );
  });

  it.each([
    { active: false, edge: "1", opacity: "0.35" },
    { active: true, edge: "2", opacity: "0.6" },
  ])("fills the box at $opacity inside a $edge px edge when active is $active", (want) => {
    expect(
      attributesOf(drawn({ active: want.active }).querySelector("rect"), [
        "fill-opacity",
        "stroke-width",
      ]),
    ).toStrictEqual([want.opacity, want.edge]);
  });

  it("places every part of a group whose values are equal at the bar's top", () => {
    const equal: BoxSummary = {
      ...SUMMARY,
      iqr: 0,
      max: 5,
      median: 5,
      min: 5,
      outliers: [],
      q1: 5,
      q3: 5,
      whiskerHigh: 5,
      whiskerLow: 5,
    };
    const container = drawn({ height: 0, payload: { ...ROW, summary: equal }, y: 80 });

    expect([
      attributesOf(container.querySelector("rect"), ["y", "height"]),
      attributesOf(container.querySelector(".chart-median"), ["y1"]),
    ]).toStrictEqual([["80", "1"], ["80"]]);
  });
});
