import { describe, expect, it } from "vitest";

import * as paretoChart from "#pareto-chart/index.ts";

describe("index", () => {
  it("exports ParetoChart with the functions that sort its rows", () => {
    expect(Object.keys(paretoChart).toSorted()).toStrictEqual([
      "ParetoChart",
      "paretoCutoff",
      "paretoRows",
    ]);
  });
});
