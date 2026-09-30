import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { laidOut, pathsOf } from "#cartesian/cartesian.fixtures.ts";
import { type CartesianSeries } from "#cartesian/types.ts";
import { StreamGraph, type StreamGraphProps } from "#stream-graph/stream-graph.tsx";

/**
 * Describes one week of visits per source.
 */
interface Week {
  readonly early: number;
  readonly first: number;
  readonly late: number;
  readonly second: number;
  readonly week: string;
}

/**
 * Lists four weeks in which most of each source's visits fall in one week, the early source's in
 * the first week and the late source's in the last.
 */
const WEEKS: Week[] = [
  { early: 9, first: 1, late: 1, second: 1, week: "W1" },
  { early: 1, first: 9, late: 1, second: 1, week: "W2" },
  { early: 1, first: 1, late: 1, second: 9, week: "W3" },
  { early: 1, first: 1, late: 9, second: 1, week: "W4" },
];

/**
 * Lists the sources in the order the caller states them.
 */
const SOURCES: readonly CartesianSeries[] = [
  { key: "late", label: "Late" },
  { key: "second", label: "Second" },
  { key: "first", label: "First" },
  { key: "early", label: "Early" },
];

/**
 * Renders the graph over the weeks with the props a case changes.
 */
function drawn(props: Partial<StreamGraphProps<Week>> = {}): Element {
  laidOut();

  return render(
    <StreamGraph categoryKey="week" data={WEEKS} label="Visits" series={SOURCES} {...props} />,
  ).container;
}

/**
 * Returns the fill of every band inside a container, in the order the bands stack.
 */
function fillsOf(container: Element): Array<null | string> {
  return [...container.querySelectorAll(".recharts-area-area")].map((area) =>
    area.getAttribute("fill"),
  );
}

describe("StreamGraph", () => {
  it("stacks the bands inside out", () => {
    expect(fillsOf(drawn())).toStrictEqual([
      "var(--colors-series-2)",
      "var(--colors-series-4)",
      "var(--colors-series-3)",
      "var(--colors-series-1)",
    ]);
  });

  it("stacks the bands in the series' order when insideOut is off", () => {
    expect(fillsOf(drawn({ insideOut: false }))).toStrictEqual([
      "var(--colors-series-1)",
      "var(--colors-series-2)",
      "var(--colors-series-3)",
      "var(--colors-series-4)",
    ]);
  });

  it("lists the series in the legend in their order", () => {
    expect(
      [...drawn().querySelectorAll(".chart__legend button")].map((button) => button.textContent),
    ).toStrictEqual(["Late", "Second", "First", "Early"]);
  });

  it("renders no value axis", () => {
    expect(drawn().querySelector(".recharts-yAxis")).toBeNull();
  });

  it("renders no grid by default", () => {
    expect(drawn().querySelector(".recharts-cartesian-grid")).toBeNull();
  });

  it("renders grid lines when grid is set", () => {
    expect(drawn({ grid: true }).querySelector(".recharts-cartesian-grid")).not.toBeNull();
  });

  it("renders no legend for more than eight series", () => {
    const series = Array.from({ length: 9 }, (_, index) => ({ key: `s${String(index)}` }));

    expect(drawn({ series }).querySelector(".chart__legend")).toBeNull();
  });

  it("renders no legend for one series", () => {
    expect(drawn({ series: [{ key: "early" }] }).querySelector(".chart__legend")).toBeNull();
  });

  it("renders the legend for more than eight series when legend is set", () => {
    const series = Array.from({ length: 9 }, (_, index) => ({ key: `s${String(index)}` }));

    expect(drawn({ legend: true, series }).querySelector(".chart__legend")).not.toBeNull();
  });

  it("centres the stack when baseline is silhouette", () => {
    expect(pathsOf(drawn({ baseline: "silhouette" }))).not.toStrictEqual(pathsOf(drawn()));
  });

  it("smooths each band's edges by default", () => {
    expect(pathsOf(drawn())[0]).toContain("C");
  });

  it("renders straight edges when curve is linear", () => {
    expect(pathsOf(drawn({ curve: "linear" }))[0]).not.toContain("C");
  });
});
