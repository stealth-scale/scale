import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useChart } from "#chart/use-chart.ts";
import {
  domainOf,
  type RadialBarDatum,
  type Ring,
  ringOf,
  ringsOf,
} from "#radial-bar-chart/rings.ts";

/**
 * Lists three bars, the last one without a finite value.
 */
const BARS: readonly RadialBarDatum[] = [
  { key: "storage", label: "Storage", value: 0.82 },
  { color: "teal", key: "seats", label: "Seats", value: 0.61 },
  { key: "api", label: "API calls", value: Number.NaN },
];

/**
 * Lists three bars: one past a full turn of 1, one within it and one below zero.
 */
const SPREAD: readonly RadialBarDatum[] = [
  { key: "storage", value: 1.2 },
  { key: "seats", value: 0.61 },
  { key: "api", value: -0.2 },
];

/**
 * Returns the chart over the given bars, with a first set of hidden keys.
 */
function chartOf(
  hidden: string[] = [],
  bars: readonly RadialBarDatum[] = BARS,
): ReturnType<typeof useChart> {
  return renderHook(() => useChart({ data: [...bars], defaultHiddenKeys: hidden, series: bars }))
    .result.current;
}

/**
 * Returns a ring of a value, for the tooltip entry's case.
 */
function ring(value: number): Ring {
  return { fill: "", measure: value, name: "ring", opacity: "1", turn: value };
}

describe("rings", () => {
  it("returns a ring per bar in the bars' order", () => {
    expect(ringsOf(chartOf(), BARS).map((each) => each.name)).toStrictEqual([
      "storage",
      "seats",
      "api",
    ]);
  });

  it("colors each ring with its bar's series color", () => {
    expect(ringsOf(chartOf(), BARS).map((each) => each.fill)).toStrictEqual([
      "var(--colors-series-1)",
      "var(--colors-teal-chart)",
      "var(--colors-series-3)",
    ]);
  });

  it("measures a value that is not a finite number as zero", () => {
    expect(ringsOf(chartOf(), BARS).at(-1)?.measure).toBe(0);
  });

  it("leaves out the ring of a bar the legend hides", () => {
    expect(ringsOf(chartOf(["seats"]), BARS).map((each) => each.name)).toStrictEqual([
      "storage",
      "api",
    ]);
  });

  it("fades every other ring while the legend points at a bar", () => {
    const { result } = renderHook(() => useChart({ data: [...BARS], series: BARS }));

    act(() => {
      result.current.highlight("storage");
    });

    expect(ringsOf(result.current, BARS).map((each) => each.opacity)).toStrictEqual([
      "1",
      "var(--chart-faded)",
      "var(--chart-faded)",
    ]);
  });

  it("turns each ring through its value within zero and max", () => {
    expect(ringsOf(chartOf([], SPREAD), SPREAD, 1).map((each) => each.turn)).toStrictEqual([
      1, 0.61, 0,
    ]);
  });

  it("measures each ring by its bar's value past max and below zero", () => {
    expect(ringsOf(chartOf([], SPREAD), SPREAD, 1).map((each) => each.measure)).toStrictEqual([
      1.2, 0.61, -0.2,
    ]);
  });

  it("turns each ring through its value from zero without max", () => {
    expect(ringsOf(chartOf([], SPREAD), SPREAD).map((each) => each.turn)).toStrictEqual([
      1.2, 0.61, 0,
    ]);
  });

  it("returns the angle axis' domain from zero to max", () => {
    expect(domainOf([ring(1.2), ring(0.61)], 1)).toStrictEqual([0, 1]);
  });

  it("returns the angle axis' domain from zero to the largest measure without max", () => {
    expect(domainOf([ring(0.34), ring(0.82)])).toStrictEqual([0, 0.82]);
  });

  it("returns the row a tooltip entry was read from", () => {
    expect(ringOf({ payload: ring(0.5) })).toStrictEqual(ring(0.5));
  });
});
