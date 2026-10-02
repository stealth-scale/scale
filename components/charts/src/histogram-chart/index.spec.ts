import { describe, expect, it } from "vitest";

import * as histogramChart from "#histogram-chart/index.ts";

describe("index", () => {
  it("exports HistogramChart with the functions that bin its values", () => {
    expect(Object.keys(histogramChart).toSorted()).toStrictEqual([
      "HistogramChart",
      "binCount",
      "binValues",
    ]);
  });
});
