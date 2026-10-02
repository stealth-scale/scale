import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useChart } from "#chart/use-chart.ts";
import { areaRadius, FLOOR, type Wedge, wedgeOf, wedgesOf } from "#polar-area-chart/wedges.ts";
import { type PieSlice } from "#polar/types.ts";

/**
 * Lists four hours of requests, the last without a finite value.
 */
const HOURS: readonly PieSlice[] = [
  { key: "00", label: "00:00", value: 100 },
  { key: "06", label: "06:00", value: 400 },
  { key: "12", label: "12:00", value: 200 },
  { key: "18", label: "18:00", value: Number.NaN },
];

/**
 * Returns the chart over the hours, every wedge in the first series color, with a first set of
 * hidden keys.
 */
function chartOf(hidden: string[] = []): ReturnType<typeof useChart> {
  return renderHook(() =>
    useChart({
      data: [...HOURS],
      defaultHiddenKeys: hidden,
      series: HOURS.map((slice) => ({ color: "series.1" as const, key: slice.key })),
    }),
  ).result.current;
}

/**
 * Returns a field of every wedge of the hours.
 */
function fieldOf<Key extends keyof Wedge>(
  key: Key,
  options: { hidden?: string[]; max?: number } = {},
): Array<Wedge[Key]> {
  return wedgesOf(chartOf(options.hidden), HOURS, options.max).map((wedge) => wedge[key]);
}

describe("wedges", () => {
  it("returns the full radius at max", () => {
    expect(areaRadius(400, 400)).toBe(1);
  });

  it("returns half the radius at a quarter of max", () => {
    expect(areaRadius(100, 400)).toBe(0.5);
  });

  it("returns the full radius past max", () => {
    expect(areaRadius(900, 400)).toBe(1);
  });

  it.each([
    { label: "a value of 0", max: 400, value: 0 },
    { label: "a value below zero", max: 400, value: -10 },
    { label: "a max of 0", max: 0, value: 10 },
    { label: "a value that is not a number", max: 400, value: Number.NaN },
  ])("returns no radius for $label", ({ max, value }) => {
    expect(areaRadius(value, max)).toBe(0);
  });

  it("returns a wedge per slice in the slices' order", () => {
    expect(fieldOf("name")).toStrictEqual(["00", "06", "12", "18"]);
  });

  it("gives every wedge the same angle", () => {
    expect(fieldOf("angle")).toStrictEqual([1, 1, 1, 1]);
  });

  it("colors every wedge with the slices' series color", () => {
    expect(new Set(fieldOf("fill"))).toStrictEqual(new Set(["var(--colors-series-1)"]));
  });

  it("measures a value that is not a finite number as zero", () => {
    expect(fieldOf("measure")).toStrictEqual([100, 400, 200, 0]);
  });

  it("extends each wedge to the square root of its share of max", () => {
    expect(fieldOf("extent", { max: 1600 })).toStrictEqual([0.25, 0.5, Math.sqrt(0.125), 0]);
  });

  it("extends each wedge to the square root of its share of the largest value without max", () => {
    expect(fieldOf("extent")).toStrictEqual([0.5, 1, Math.sqrt(0.5), 0]);
  });

  it("keeps the place of a wedge the legend hides with no extent", () => {
    expect(fieldOf("extent", { hidden: ["06"] }).map((extent) => extent > 0)).toStrictEqual([
      true,
      false,
      true,
      false,
    ]);
  });

  it("measures the others against the largest value shown while the largest is hidden", () => {
    expect(fieldOf("extent", { hidden: ["06"] })[2]).toBe(1);
  });

  it("fills a wedge at the floor at zero", () => {
    expect(fieldOf("fillOpacity").at(-1)).toBe(FLOOR);
  });

  it("fills the wedge at max completely", () => {
    expect(fieldOf("fillOpacity")[1]).toBe(1);
  });

  it("fills a wedge in proportion to its share of max above the floor", () => {
    expect(fieldOf("fillOpacity")[2]).toBeCloseTo(FLOOR + (1 - FLOOR) / 2, 10);
  });

  it("fades every other wedge while the legend points at a slice", () => {
    const { result } = renderHook(() =>
      useChart({ data: [...HOURS], series: HOURS.map((slice) => ({ key: slice.key })) }),
    );

    act(() => {
      result.current.highlight("06");
    });

    expect(wedgesOf(result.current, HOURS).map((wedge) => wedge.opacity)).toStrictEqual([
      "var(--chart-faded)",
      "1",
      "var(--chart-faded)",
      "var(--chart-faded)",
    ]);
  });

  it("returns the row a tooltip entry was read from", () => {
    const wedge = wedgesOf(chartOf(), HOURS)[0];

    expect(wedgeOf({ payload: wedge })).toStrictEqual(wedge);
  });
});
