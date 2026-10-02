import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { type BoxGroup, BoxPlot, type BoxPlotProps } from "#box-plot/box-plot.tsx";
import { laidOut } from "#cartesian/cartesian.fixtures.ts";

/**
 * Lists two groups of response times, the first with one slow outlier.
 */
const GROUPS: readonly BoxGroup[] = [
  { key: "api", label: "API", values: [12, 18, 21, 25, 30, 33, 35, 38, 41, 44, 180] },
  { key: "web", label: "Web", values: [20, 24, 27, 31, 36, 40, 45] },
];

/**
 * Renders the groups with the props a case changes, and returns the container.
 */
function drawn(props: Partial<BoxPlotProps> = {}): Element {
  laidOut();

  return render(<BoxPlot groups={GROUPS} label="Response times" locale="en-US" {...props} />)
    .container;
}

/**
 * Returns the text of every element a selector matches inside a container, in document order.
 */
function textsOf(container: Element, selector: string): string[] {
  return [...container.querySelectorAll(selector)].map((element) => element.textContent);
}

/**
 * Returns the box of every group inside the chart's surface, in document order: the resting
 * boxes, then the active box, which recharts renders in a later layer in place of its resting one.
 */
function boxesOf(container: Element): Element[] {
  return [...container.querySelectorAll(".recharts-surface rect[fill-opacity]")];
}

describe("BoxPlot", () => {
  it("returns no accessibility violation", async () => {
    laidOut();

    await expect(
      accessibilityViolations(() => (
        <BoxPlot caption="The API has one slow outlier." groups={GROUPS} label="Response times" />
      )),
    ).resolves.toStrictEqual([]);
  });

  it("renders a box per group with values", () => {
    expect(boxesOf(drawn())).toHaveLength(2);
  });

  it("leaves out a group without a finite value", () => {
    expect(
      boxesOf(drawn({ groups: [...GROUPS, { key: "cdn", label: "CDN", values: ["n/a"] }] })),
    ).toHaveLength(2);
  });

  it("leaves out a group without values or a summary", () => {
    expect(boxesOf(drawn({ groups: [...GROUPS, { key: "cdn", label: "CDN" }] }))).toHaveLength(2);
  });

  it("renders a group from its summary in place of its values", () => {
    const summary = {
      count: 4,
      iqr: 2,
      max: 9,
      median: 7,
      min: 1,
      outliers: [],
      q1: 6,
      q3: 8,
      whiskerHigh: 9,
      whiskerLow: 1,
    };
    const container = drawn({
      defaultIndex: 0,
      groups: [{ key: "api", label: "API", summary, values: [100, 200, 300] }],
    });

    expect(textsOf(container, ".chart__value")[0]).toBe("7");
  });

  it("heads the tooltip with the group's name", () => {
    expect(textsOf(drawn({ defaultIndex: 1 }), ".chart__heading")).toStrictEqual(["Web"]);
  });

  it("names the tooltip's rows in English unless stated", () => {
    expect(textsOf(drawn({ defaultIndex: 0 }), ".chart__name")).toStrictEqual([
      "Median",
      "Middle half",
      "Whiskers",
      "Outliers",
      "Count",
    ]);
  });

  it("names the tooltip's rows by the label props", () => {
    const container = drawn({
      countLabel: "Aantal",
      defaultIndex: 0,
      medianLabel: "Mediaan",
      outliersLabel: "Uitschieters",
      quartilesLabel: "Middelste helft",
      whiskersLabel: "Snorharen",
    });

    expect(textsOf(container, ".chart__name")).toStrictEqual([
      "Mediaan",
      "Middelste helft",
      "Snorharen",
      "Uitschieters",
      "Aantal",
    ]);
  });

  it("writes the group's numbers in the tooltip", () => {
    expect(textsOf(drawn({ defaultIndex: 0 }), ".chart__value")).toStrictEqual([
      "33",
      "23–39.5",
      "12–44",
      "1",
      "11",
    ]);
  });

  it("writes the values with valueOptions", () => {
    const container = drawn({
      defaultIndex: 0,
      valueOptions: { style: "unit", unit: "millisecond", unitDisplay: "narrow" },
    });

    expect(textsOf(container, ".chart__value").slice(0, 2)).toStrictEqual(["33ms", "23–39.5ms"]);
  });

  it("writes the counts without valueOptions", () => {
    const container = drawn({
      defaultIndex: 0,
      valueOptions: { style: "unit", unit: "millisecond", unitDisplay: "narrow" },
    });

    expect(textsOf(container, ".chart__value").slice(3)).toStrictEqual(["1", "11"]);
  });

  it("renders each outlier as a point", () => {
    expect(drawn().querySelectorAll(".recharts-bar-rectangle .chart-outlier")).toHaveLength(1);
  });

  it("extends the whiskers as far as whisker states", () => {
    expect(
      drawn({ whisker: 10 }).querySelectorAll(".recharts-bar-rectangle .chart-outlier"),
    ).toHaveLength(0);
  });

  it("renders no outlier point while outliers is false", () => {
    expect(drawn({ outliers: false }).querySelectorAll(".chart-outlier")).toHaveLength(0);
  });

  it("fills the boxes with the theme's first series color", () => {
    expect(boxesOf(drawn())[0]?.getAttribute("fill")).toBe("var(--colors-series-1)");
  });

  it("fills the boxes with the chart color of the palette color names", () => {
    expect(boxesOf(drawn({ color: "accent" }))[0]?.getAttribute("fill")).toBe(
      "var(--colors-accent-chart)",
    );
  });

  it("caps each box at 72px wide in a wider band", () => {
    expect(boxesOf(drawn()).map((box) => box.getAttribute("width"))).toStrictEqual(["72", "72"]);
  });

  it("fills the active group's box at the stronger opacity", () => {
    expect(
      boxesOf(drawn({ defaultIndex: 0 })).map((box) => box.getAttribute("fill-opacity")),
    ).toStrictEqual(["0.35", "0.6"]);
  });

  it("renders the key naming the box's parts below the plot", () => {
    expect(textsOf(drawn(), ".chart__key li")).toStrictEqual([
      "Middle half",
      "Median",
      "Whiskers",
      "Outliers",
    ]);
  });

  it("renders no key when legend is false", () => {
    expect(drawn({ legend: false }).querySelector(".chart__key")).toBeNull();
  });

  it("renders no key without a group to render", () => {
    expect(drawn({ groups: [] }).querySelector(".chart__key")).toBeNull();
  });

  it("renders No data in the plot's place without a group to render", () => {
    expect(textsOf(drawn({ groups: [] }), ".chart__empty")).toStrictEqual(["No data"]);
  });

  it("renders the empty message it states", () => {
    expect(textsOf(drawn({ empty: "No requests", groups: [] }), ".chart__empty")).toStrictEqual([
      "No requests",
    ]);
  });

  it("rounds the value axis around the values", () => {
    const groups = [{ key: "api", label: "API", values: [1010, 1040, 1060, 1090] }];

    expect(textsOf(drawn({ groups }), ".recharts-yAxis-tick-labels text").at(-1)).toBe("1,100");
  });

  it("sets the value axis' domain by valueDomain", () => {
    expect(
      textsOf(drawn({ valueDomain: [0, 500] }), ".recharts-yAxis-tick-labels text").at(-1),
    ).toBe("500");
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

  it("names the keyboard layer by the label", () => {
    expect(drawn().querySelector(".recharts-surface title")?.textContent).toBe("Response times");
  });

  it("names the figure by its caption", () => {
    expect(
      textsOf(drawn({ caption: "The API has one slow outlier." }), "figcaption"),
    ).toStrictEqual(["The API has one slow outlier."]);
  });

  it("renders recharts children inside the chart", () => {
    expect(drawn({ children: <g className="probe" /> }).querySelector(".probe")).not.toBeNull();
  });

  it("passes none of its own props to the figure", () => {
    const figure = drawn({
      animate: false,
      color: "accent",
      countLabel: "Requests",
      whisker: 3,
    }).querySelector("figure");

    expect(figure?.getAttributeNames().toSorted()).toStrictEqual(["class", "data-recipe"]);
  });

  it("renders every box at its full height without animate", () => {
    vi.useFakeTimers();

    const heights = boxesOf(drawn()).map((box) => Number(box.getAttribute("height")));

    vi.useRealTimers();

    expect(Math.min(...heights)).toBeGreaterThan(1);
  });

  it("starts every box flat when animate is set", () => {
    vi.useFakeTimers();

    const heights = boxesOf(drawn({ animate: true })).map((box) => box.getAttribute("height"));

    vi.useRealTimers();

    expect(heights).toStrictEqual(["1", "1"]);
  });
});
