import { describe, expect, it } from "vitest";

import * as stackedBarChart from "#stacked-bar-chart/index.ts";

describe("index", () => {
  it("exports StackedBarChart alone", () => {
    expect(Object.keys(stackedBarChart)).toStrictEqual(["StackedBarChart"]);
  });
});
