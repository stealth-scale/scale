import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { laidOut } from "#cartesian/cartesian.fixtures.ts";
import { type ViolinGroup, ViolinPlot, type ViolinPlotProps } from "#violin-plot/violin-plot.tsx";

/**
 * Lists two groups of response times: a cache's hits and misses, and an origin's single peak.
 */
const GROUPS: readonly ViolinGroup[] = [
  { key: "cache", label: "Cache", values: [18, 19, 20, 20, 21, 22, 58, 60, 61, 62] },
  { key: "origin", label: "Origin", values: [40, 42, 45, 47, 50, 52, 55] },
];

/**
 * Renders the groups with the props a case changes, and returns the container.
 */
function drawn(props: Partial<ViolinPlotProps> = {}): Element {
  laidOut();

  return render(<ViolinPlot groups={GROUPS} label="Response times" locale="en-US" {...props} />)
    .container;
}

/**
 * Returns the text of every element a selector matches inside a container, in document order.
 */
function textsOf(container: Element, selector: string): string[] {
  return [...container.querySelectorAll(selector)].map((element) => element.textContent);
}

/**
 * Returns the outline of every violin inside the chart's surface, the active one last.
 */
function outlinesOf(container: Element): Element[] {
  return [...container.querySelectorAll(".recharts-surface polygon")];
}

/**
 * Returns the x and the y of every point of an outline.
 */
function pointsOf(outline: Element | undefined): Array<readonly [number, number]> {
  return (outline?.getAttribute("points") ?? "").split(" ").map((point) => {
    const [x = 0, y = 0] = point.split(",").map(Number);

    return [x, y] as const;
  });
}

describe("ViolinPlot", () => {
  it("returns no accessibility violation", async () => {
    laidOut();

    await expect(
      accessibilityViolations(() => (
        <ViolinPlot caption="The cache responds in two peaks." groups={GROUPS} label="Times" />
      )),
    ).resolves.toStrictEqual([]);
  });

  it("renders a violin per group with values", () => {
    expect(outlinesOf(drawn())).toHaveLength(2);
  });

  it("leaves out a group without a finite value", () => {
    expect(
      outlinesOf(drawn({ groups: [...GROUPS, { key: "edge", label: "Edge", values: ["n/a"] }] })),
    ).toHaveLength(2);
  });

  it("heads the tooltip with the group's name", () => {
    expect(textsOf(drawn({ defaultIndex: 1 }), ".chart__heading")).toStrictEqual(["Origin"]);
  });

  it("names the tooltip's rows in English unless stated", () => {
    expect(textsOf(drawn({ defaultIndex: 0 }), ".chart__name")).toStrictEqual([
      "Median",
      "Middle half",
      "Range",
      "Peaks",
      "Count",
    ]);
  });

  it("names the tooltip's rows by the label props", () => {
    const container = drawn({
      countLabel: "Aantal",
      defaultIndex: 0,
      medianLabel: "Mediaan",
      peaksLabel: "Pieken",
      quartilesLabel: "Middelste helft",
      rangeLabel: "Bereik",
    });

    expect(textsOf(container, ".chart__name")).toStrictEqual([
      "Mediaan",
      "Middelste helft",
      "Bereik",
      "Pieken",
      "Aantal",
    ]);
  });

  it("writes the group's numbers in the tooltip", () => {
    expect(textsOf(drawn({ defaultIndex: 0 }), ".chart__value")).toStrictEqual([
      "21.5",
      "20–59.5",
      "18–62",
      "20.1, 59.9",
      "10",
    ]);
  });

  it("writes the values with valueOptions", () => {
    const container = drawn({
      defaultIndex: 0,
      valueOptions: { style: "unit", unit: "millisecond", unitDisplay: "narrow" },
    });

    expect(textsOf(container, ".chart__value").slice(0, 2)).toStrictEqual(["21.5ms", "20–59.5ms"]);
  });

  it("smooths every group with the bandwidth it states", () => {
    expect(textsOf(drawn({ bandwidth: 20, defaultIndex: 0 }), ".chart__value")[3]).toBe("25");
  });

  it("samples each density at resolution points", () => {
    expect(pointsOf(outlinesOf(drawn({ resolution: 10 }))[0])).toHaveLength(20);
  });

  it("fills the violins with the theme's first series color", () => {
    expect(outlinesOf(drawn())[0]?.getAttribute("fill")).toBe("var(--colors-series-1)");
  });

  it("fills the violins with the chart color of the palette color names", () => {
    expect(outlinesOf(drawn({ color: "accent" }))[0]?.getAttribute("fill")).toBe(
      "var(--colors-accent-chart)",
    );
  });

  it("fills the active group's violin at the stronger opacity", () => {
    expect(
      outlinesOf(drawn({ defaultIndex: 0 })).map((outline) => outline.getAttribute("fill-opacity")),
    ).toStrictEqual(["0.28", "0.5"]);
  });

  it("widens each violin to at most 110px in a wider band", () => {
    const xs = pointsOf(outlinesOf(drawn())[0]).map(([x]) => x);

    expect(Math.max(...xs) - Math.min(...xs)).toBeCloseTo(110, 6);
  });

  it("renders the quartile marker inside each violin", () => {
    expect(drawn().querySelectorAll(".recharts-surface .chart-quartiles")).toHaveLength(2);
  });

  it("renders no marker while quartiles is false", () => {
    expect(
      drawn({ quartiles: false }).querySelectorAll(".recharts-surface .chart-quartiles"),
    ).toHaveLength(0);
  });

  it("renders the key naming the violin's parts below the plot", () => {
    expect(textsOf(drawn(), ".chart__key li")).toStrictEqual(["Density", "Middle half", "Median"]);
  });

  it("names the density in the key by densityLabel", () => {
    expect(textsOf(drawn({ densityLabel: "Dichtheid" }), ".chart__key li")[0]).toBe("Dichtheid");
  });

  it("names the density alone in the key while quartiles is false", () => {
    expect(textsOf(drawn({ quartiles: false }), ".chart__key li")).toStrictEqual(["Density"]);
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
    expect(textsOf(drawn(), ".recharts-yAxis-tick-labels text").at(0)).toBe("15");
  });

  it("sets the value axis' domain by valueDomain", () => {
    expect(
      textsOf(drawn({ valueDomain: [0, 100] }), ".recharts-yAxis-tick-labels text").at(-1),
    ).toBe("100");
  });

  it("renders no grid when grid is off", () => {
    expect(drawn({ grid: false }).querySelector(".recharts-cartesian-grid")).toBeNull();
  });

  it("names the keyboard layer by the label", () => {
    expect(drawn().querySelector(".recharts-surface title")?.textContent).toBe("Response times");
  });

  it("names the figure by its caption", () => {
    expect(
      textsOf(drawn({ caption: "The cache responds in two peaks." }), "figcaption"),
    ).toStrictEqual(["The cache responds in two peaks."]);
  });

  it("renders recharts children inside the chart", () => {
    expect(drawn({ children: <g className="probe" /> }).querySelector(".probe")).not.toBeNull();
  });

  it("passes none of its own props to the figure", () => {
    const figure = drawn({
      animate: false,
      bandwidth: 2,
      color: "accent",
      quartiles: false,
      resolution: 32,
    }).querySelector("figure");

    expect(figure?.getAttributeNames().toSorted()).toStrictEqual(["class", "data-recipe"]);
  });

  it("renders every violin at its full height without animate", () => {
    vi.useFakeTimers();

    const ys = pointsOf(outlinesOf(drawn())[0]).map(([, y]) => y);

    vi.useRealTimers();

    expect(Math.max(...ys) - Math.min(...ys)).toBeGreaterThan(1);
  });

  it("starts every violin flat when animate is set", () => {
    vi.useFakeTimers();

    const ys = pointsOf(outlinesOf(drawn({ animate: true }))[0]).map(([, y]) => y);

    vi.useRealTimers();

    expect(new Set(ys).size).toBe(1);
  });
});
