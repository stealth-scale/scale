import { createElement } from "react";

import { act, render, renderHook } from "@testing-library/react";
import { Area, Bar, Line } from "recharts";
import { describe, expect, it } from "vitest";

import { LINES, ROWS, SERIES } from "#cartesian/cartesian.fixtures.ts";
import { fillsOf, marksOf, type MarksOptions } from "#cartesian/marks.tsx";
import { type CoreSeries, type Shape } from "#cartesian/types.ts";
import { useChart } from "#chart/use-chart.ts";

/**
 * Returns the options of marks over the fixture series, the shape changed by a patch.
 */
function optionsOf(patch: Partial<Shape>, animate = false, hidden: string[] = []): MarksOptions {
  const chart = renderHook(() =>
    useChart({ data: ROWS, defaultHiddenKeys: hidden, series: SERIES }),
  ).result.current;

  return { animate, chart, gradient: "fill", series: SERIES, shape: { ...LINES, ...patch } };
}

/**
 * Returns the options of line marks while the legend points at one series.
 */
function highlightedOf(key: string): MarksOptions {
  const { result } = renderHook(() => useChart({ data: ROWS, series: SERIES }));

  act(() => {
    result.current.highlight(key);
  });

  return { animate: false, chart: result.current, gradient: "fill", series: SERIES, shape: LINES };
}

/**
 * Returns the options of marks in a mixed shape over declared series.
 */
function mixedOf(series: readonly CoreSeries[]): MarksOptions {
  const chart = renderHook(() => useChart({ data: ROWS, series })).result.current;

  return { animate: false, chart, gradient: "fill", series, shape: { ...LINES, mark: "mixed" } };
}

/**
 * Renders the gradients of a shape inside an `svg` and returns the container.
 */
function filled(patch: Partial<Shape>): Element {
  return render(createElement("svg", null, fillsOf(optionsOf(patch)))).container;
}

describe("marks", () => {
  it("returns a line per series for a line shape", () => {
    expect(marksOf(optionsOf({})).map((mark) => mark.type)).toStrictEqual([Line, Line]);
  });

  it("returns an area per series for an area shape", () => {
    expect(marksOf(optionsOf({ mark: "area" })).map((mark) => mark.type)).toStrictEqual([
      Area,
      Area,
    ]);
  });

  it("returns a bar per series for a bar shape", () => {
    expect(marksOf(optionsOf({ mark: "bar" })).map((mark) => mark.type)).toStrictEqual([Bar, Bar]);
  });

  it("colors each line with its series' color", () => {
    const [paid] = marksOf(optionsOf({}));

    expect(paid?.props).toMatchObject({
      dataKey: "paid",
      stroke: "var(--colors-series-1)",
      strokeWidth: 2,
      type: "monotone",
    });
  });

  it("renders each line without dots", () => {
    const [paid] = marksOf(optionsOf({}));

    expect(paid?.props).toMatchObject({ dot: false });
  });

  it("renders a dot of radius 5 at the point the tooltip is at", () => {
    const [paid] = marksOf(optionsOf({}));

    expect(paid?.props).toMatchObject({ activeDot: { r: 5 } });
  });

  it("dashes the line of a series stated as dashed", () => {
    const [, refunded] = marksOf(optionsOf({}));

    expect(refunded?.props).toMatchObject({ strokeDasharray: "6 4" });
  });

  it("renders the line of any other series without dashes", () => {
    const [paid] = marksOf(optionsOf({}));

    expect(paid?.props).not.toHaveProperty("strokeDasharray");
  });

  it("renders a step curve as recharts' stepAfter", () => {
    const [paid] = marksOf(optionsOf({ curve: "step" }));

    expect(paid?.props).toMatchObject({ type: "stepAfter" });
  });

  it("fills an unstacked area with the gradient of its position at full fill opacity", () => {
    const [, refunded] = marksOf(optionsOf({ mark: "area" }));

    expect(refunded?.props).toMatchObject({ fill: "url(#fill-1)", fillOpacity: 1 });
  });

  it("fills a stacked area at 0.85 opacity in one stack", () => {
    const [paid] = marksOf(optionsOf({ mark: "area", stack: "stacked" }));

    expect(paid?.props).toMatchObject({ fillOpacity: 0.85, stackId: "stack" });
  });

  it("rounds the top of an unstacked upright bar", () => {
    const [paid] = marksOf(optionsOf({ mark: "bar" }));

    expect(paid?.props).toMatchObject({ radius: [4, 4, 0, 0] });
  });

  it("rounds the end of an unstacked bar on its side", () => {
    const [paid] = marksOf(optionsOf({ direction: "horizontal", mark: "bar" }));

    expect(paid?.props).toMatchObject({ radius: [0, 4, 4, 0] });
  });

  it("renders square ends on a stacked bar", () => {
    const [paid] = marksOf(optionsOf({ mark: "bar", stack: "stacked" }));

    expect(paid?.props).toMatchObject({ radius: 0 });
  });

  it("stacks every bar of a stack summed to 100% in one stack", () => {
    expect(
      marksOf(optionsOf({ mark: "bar", stack: "percent" })).map((mark) => mark.props),
    ).toMatchObject([{ stackId: "stack" }, { stackId: "stack" }]);
  });

  it("stacks nothing without a stack", () => {
    const [paid] = marksOf(optionsOf({ mark: "bar" }));

    expect(paid?.props).not.toHaveProperty("stackId");
  });

  it("hides a series the legend hides", () => {
    expect(marksOf(optionsOf({}, false, ["refunded"])).map((mark) => mark.props)).toMatchObject([
      { hide: false },
      { hide: true },
    ]);
  });

  it("renders every mark at full opacity while the legend points at no series", () => {
    expect(marksOf(optionsOf({})).map((mark) => mark.props)).toMatchObject([
      { opacity: "1" },
      { opacity: "1" },
    ]);
  });

  it("fades the marks of every series but the one the legend points at", () => {
    expect(marksOf(highlightedOf("refunded")).map((mark) => mark.props)).toMatchObject([
      { opacity: "var(--chart-faded)" },
      { opacity: "1" },
    ]);
  });

  it("animates the marks outside reduced motion when animate is set", () => {
    const [paid] = marksOf(optionsOf({}, true));

    expect(paid?.props).toMatchObject({ isAnimationActive: "auto" });
  });

  it("does not animate the marks by default", () => {
    const [paid] = marksOf(optionsOf({}));

    expect(paid?.props).toMatchObject({ isAnimationActive: false });
  });

  it("returns defs with a gradient per series for areas that overlap", () => {
    expect(
      [...filled({ mark: "area" }).querySelectorAll("defs linearGradient")].map((each) => each.id),
    ).toStrictEqual(["fill-0", "fill-1"]);
  });

  it("runs each gradient down from the series' color at 0.3 opacity to transparent", () => {
    expect(
      [...filled({ mark: "area" }).querySelectorAll("#fill-0 stop")].map((stop) => [
        stop.getAttribute("offset"),
        stop.getAttribute("stop-color"),
        stop.getAttribute("stop-opacity"),
      ]),
    ).toStrictEqual([
      ["0", "var(--colors-series-1)", "0.3"],
      ["1", "var(--colors-series-1)", "0"],
    ]);
  });

  it("returns no defs for stacked areas", () => {
    expect(fillsOf(optionsOf({ mark: "area", stack: "stacked" }))).toBeNull();
  });

  it("returns no defs for lines", () => {
    expect(fillsOf(optionsOf({}))).toBeNull();
  });

  it("renders each series of a mixed shape as the mark it states", () => {
    const marks = marksOf(
      mixedOf([
        { key: "paid", mark: "bar" },
        { key: "refunded", mark: "area" },
      ]),
    );

    expect(marks.map((mark) => mark.type)).toStrictEqual([Bar, Area]);
  });

  it("renders a series of a mixed shape that states no mark as a line", () => {
    expect(marksOf(mixedOf([{ key: "paid" }])).map((mark) => mark.type)).toStrictEqual([Line]);
  });

  it("returns a gradient for the areas of a mixed shape alone", () => {
    const options = mixedOf([
      { key: "paid", mark: "bar" },
      { key: "refunded", mark: "area" },
    ]);

    expect(
      [
        ...render(createElement("svg", null, fillsOf(options))).container.querySelectorAll(
          "linearGradient",
        ),
      ].map((each) => each.id),
    ).toStrictEqual(["fill-1"]);
  });

  it("puts a series on the end axis when it states one", () => {
    const [, refunded] = marksOf(
      mixedOf([
        { key: "paid", mark: "bar" },
        { axis: "end", key: "refunded", mark: "line" },
      ]),
    );

    expect(refunded?.props).toMatchObject({ yAxisId: "end" });
  });

  it("leaves a series on the start axis unless it states one", () => {
    const [paid] = marksOf(mixedOf([{ key: "paid", mark: "bar" }]));

    expect(paid?.props).not.toHaveProperty("yAxisId");
  });

  it("renders a band as an area between its two fields", () => {
    const [band] = marksOf(mixedOf([{ band: { high: "paid", low: "refunded" }, key: "range" }]));
    const props = band?.props as { dataKey: (row: unknown) => unknown } | undefined;

    expect(props?.dataKey({ paid: 120, refunded: 12 })).toStrictEqual([12, 120]);
  });

  it("fills a band at 0.2 without an edge", () => {
    const [band] = marksOf(mixedOf([{ band: { high: "paid", low: "refunded" }, key: "range" }]));

    expect([band?.type, band?.props]).toMatchObject([
      Area,
      { activeDot: false, fillOpacity: 0.2, name: "range", stroke: "none" },
    ]);
  });

  it("returns the marks in the order stackOrder states", () => {
    const options = {
      ...optionsOf({ mark: "area", stack: "wiggle" }),
      stackOrder: ["refunded", "paid"],
    };

    expect(marksOf(options).map((mark) => mark.key)).toStrictEqual(["refunded", "paid"]);
  });

  it("keeps each series' color when stackOrder moves its mark", () => {
    const options = {
      ...optionsOf({ mark: "area", stack: "wiggle" }),
      stackOrder: ["refunded", "paid"],
    };

    expect(marksOf(options).map((mark) => mark.props)).toMatchObject([
      { fill: "var(--colors-series-2)" },
      { fill: "var(--colors-series-1)" },
    ]);
  });

  it("returns the marks in the order of the series without stackOrder", () => {
    expect(marksOf(optionsOf({})).map((mark) => mark.key)).toStrictEqual(["paid", "refunded"]);
  });

  it("returns no gradient for a band", () => {
    expect(
      fillsOf(mixedOf([{ band: { high: "paid", low: "refunded" }, key: "range", mark: "area" }])),
    ).toBeNull();
  });
});
