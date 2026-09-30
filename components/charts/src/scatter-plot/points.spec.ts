import { renderHook } from "@testing-library/react";
import { Scatter } from "recharts";
import { describe, expect, it } from "vitest";

import { useChart } from "#chart/use-chart.ts";
import { pointsOf, type PointsOptions } from "#scatter-plot/points.tsx";
import { scored, VENDORS } from "#scatter-plot/scatter-plot.fixtures.tsx";

/**
 * Lists a mid-market deal and an enterprise deal, one series each.
 */
const SERIES = [
  { key: "mid", points: [{ days: 28, size: 12_000 }] },
  { key: "enterprise", points: [{ days: 120, size: 85_000 }] },
];

/**
 * Returns the options of the points of both series, animated or not.
 */
function optionsOf(animate = false): PointsOptions {
  const chart = renderHook(() =>
    useChart({ data: SERIES.flatMap((each) => each.points), series: SERIES }),
  ).result.current;

  return { animate, chart, series: SERIES };
}

describe("points", () => {
  it("returns a Scatter per series in the order of the series", () => {
    expect(pointsOf(optionsOf()).map((points) => [points.type, points.key])).toStrictEqual([
      [Scatter, "mid"],
      [Scatter, "enterprise"],
    ]);
  });

  it("animates the points outside reduced motion when animate is set", () => {
    const [mid] = pointsOf(optionsOf(true));

    expect(mid?.props).toMatchObject({ isAnimationActive: "auto" });
  });

  it("does not animate the points by default", () => {
    const [mid] = pointsOf(optionsOf());

    expect(mid?.props).toMatchObject({ isAnimationActive: false });
  });

  it("writes each point's words through a label list over the label field", () => {
    const [mid] = pointsOf({ ...optionsOf(), labelKey: "name" });

    expect(mid?.props).toMatchObject({ children: { props: { dataKey: "name" } } });
  });

  it("writes no words without a label field", () => {
    const [mid] = pointsOf(optionsOf());

    expect(mid?.props).toMatchObject({ children: null });
  });

  it("places each label after the points of the series before it", () => {
    const container = scored({
      series: [
        { key: "ahead", label: "Ahead", points: VENDORS.slice(0, 2) },
        { key: "behind", label: "Behind", points: VENDORS.slice(2) },
      ],
    });

    expect(
      [...container.querySelectorAll<SVGGElement>("g.chart-node")].map(
        (group) => group.dataset["walk"],
      ),
    ).toStrictEqual(["0", "1", "2", "3"]);
  });
});
