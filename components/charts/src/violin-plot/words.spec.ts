import { describe, expect, it } from "vitest";

import { numberFormatter } from "#chart/format.ts";
import { boxStats } from "#stats/box.ts";
import { densityPeaks, kernelDensity } from "#stats/density.ts";
import { type ViolinRow } from "#violin-plot/violin-shape.tsx";
import { factsOf } from "#violin-plot/words.ts";

/**
 * Names the tooltip's rows.
 */
const WORDS = {
  count: "Count",
  density: "Density",
  median: "Median",
  peaks: "Peaks",
  quartiles: "Middle half",
  range: "Range",
};

/**
 * Writes values in milliseconds and counts as plain numbers.
 */
const FORMATS = {
  count: numberFormatter("en-US"),
  value: numberFormatter("en-US", { style: "unit", unit: "millisecond", unitDisplay: "narrow" }),
};

/**
 * Lists ten response times of a cache: hits near 20ms and misses near 60ms.
 */
const CACHE = [18, 19, 20, 20, 21, 22, 58, 60, 61, 62];

/**
 * Returns the row of values sampled at a resolution.
 */
function rowOf(values: readonly number[], resolution = 64): ViolinRow {
  const summary = boxStats(values);
  const density = kernelDensity(values, { resolution });

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the fixture's values are finite, so a summary exists
  const summarised = summary as NonNullable<typeof summary>;

  return {
    density,
    key: "cache",
    label: "Cache",
    peaks: densityPeaks(density),
    range: [summarised.min, summarised.max],
    summary: summarised,
    widest: Math.max(...density.map((point) => point.density)),
  };
}

/**
 * Returns the tooltip's rows for a row.
 */
function rowsOf(row: ViolinRow): ReturnType<ReturnType<typeof factsOf>> {
  return factsOf(WORDS, FORMATS)([{ payload: row }]);
}

describe("words", () => {
  it("names the rows in reading order", () => {
    expect(rowsOf(rowOf(CACHE)).map((row) => row.name)).toStrictEqual([
      "Median",
      "Middle half",
      "Range",
      "Peaks",
      "Count",
    ]);
  });

  it.each([
    { key: "median", value: "21.5ms" },
    { key: "quartiles", value: "20–59.5ms" },
    { key: "range", value: "18–62ms" },
    { key: "peaks", value: "20.1ms, 59.9ms" },
    { key: "count", value: "10" },
  ])("writes $key as $value", ({ key, value }) => {
    expect(rowsOf(rowOf(CACHE)).find((row) => row.key === key)?.value).toBe(value);
  });

  it("writes a peak without decimals while the grid's step is 1 or more", () => {
    expect(rowsOf(rowOf(CACHE, 5)).find((row) => row.key === "peaks")?.value).toBe("18ms, 62ms");
  });

  it("writes the one point of equal values without decimals", () => {
    expect(rowsOf(rowOf([7, 7, 7])).find((row) => row.key === "peaks")?.value).toBe("7ms");
  });

  it("returns no rows without an entry", () => {
    expect(factsOf(WORDS, FORMATS)([])).toStrictEqual([]);
  });
});
