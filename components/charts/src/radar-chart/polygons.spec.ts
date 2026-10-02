import { act, renderHook } from "@testing-library/react";
import { Radar } from "recharts";
import { describe, expect, it } from "vitest";

import { ROWS, SERIES } from "#cartesian/cartesian.fixtures.ts";
import { useChart } from "#chart/use-chart.ts";
import { polygonsOf, type PolygonsOptions } from "#radar-chart/polygons.tsx";

/**
 * Returns the options of polygons over the fixture series.
 */
function optionsOf(
  patch: Partial<Omit<PolygonsOptions, "chart">> = {},
  hidden: string[] = [],
): PolygonsOptions {
  const chart = renderHook(() =>
    useChart({ data: ROWS, defaultHiddenKeys: hidden, series: SERIES }),
  ).result.current;

  return { animate: false, chart, unfilled: new Set<string>(), ...patch };
}

describe("polygonsOf", () => {
  it("returns a recharts Radar per series in the legend's order", () => {
    expect(polygonsOf(optionsOf()).map((polygon) => [polygon.type, polygon.key])).toStrictEqual([
      [Radar, "paid"],
      [Radar, "refunded"],
    ]);
  });

  it("fills a polygon at 0.25 of its series' color", () => {
    expect(polygonsOf(optionsOf())[0]?.props).toMatchObject({
      fill: "var(--colors-series-1)",
      fillOpacity: 0.25,
    });
  });

  it("leaves a polygon unfilled when its key is in unfilled", () => {
    expect(polygonsOf(optionsOf({ unfilled: new Set(["refunded"]) }))[1]?.props).toMatchObject({
      fillOpacity: 0,
    });
  });

  it("strokes each polygon in its series' color", () => {
    expect(polygonsOf(optionsOf())[1]?.props).toMatchObject({ stroke: "var(--colors-series-2)" });
  });

  it("renders each edge 2px wide", () => {
    expect(polygonsOf(optionsOf()).map((polygon) => polygon.props.strokeWidth)).toStrictEqual([
      2, 2,
    ]);
  });

  it("marks the spoke the tooltip is at with a dot of radius 5", () => {
    expect(polygonsOf(optionsOf())[0]?.props).toMatchObject({ activeDot: { r: 5 } });
  });

  it("hides the polygon of a series the legend hides", () => {
    expect(polygonsOf(optionsOf({}, ["paid"])).map((polygon) => polygon.props.hide)).toStrictEqual([
      true,
      false,
    ]);
  });

  it("fades every other polygon while the legend points at a series", () => {
    const { result } = renderHook(() => useChart({ data: ROWS, series: SERIES }));

    act(() => {
      result.current.highlight("paid");
    });

    expect(
      polygonsOf({ animate: false, chart: result.current, unfilled: new Set() }).map(
        (polygon) => polygon.props.opacity,
      ),
    ).toStrictEqual(["1", "var(--chart-faded)"]);
  });

  it("animates each polygon outside reduced motion when animate is on", () => {
    expect(polygonsOf(optionsOf({ animate: true }))[0]?.props).toMatchObject({
      isAnimationActive: "auto",
    });
  });

  it("renders each polygon at rest when animate is off", () => {
    expect(polygonsOf(optionsOf())[0]?.props).toMatchObject({ isAnimationActive: false });
  });
});
