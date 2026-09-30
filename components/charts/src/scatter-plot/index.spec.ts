import { describe, expect, it } from "vitest";

import * as scatterPlot from "#scatter-plot/index.ts";

describe("index", () => {
  it("exports the scatter plot with its quadrant functions", () => {
    expect(Object.keys(scatterPlot).toSorted()).toStrictEqual([
      "ScatterPlot",
      "quadrantOf",
      "spreadPoints",
    ]);
  });
});
