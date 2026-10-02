import { describe, expect, it } from "vitest";

import * as stackedAreaChart from "#stacked-area-chart/index.ts";

describe("index", () => {
  it("exports StackedAreaChart alone", () => {
    expect(Object.keys(stackedAreaChart)).toStrictEqual(["StackedAreaChart"]);
  });
});
