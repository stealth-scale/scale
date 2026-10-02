import { describe, expect, it } from "vitest";

import * as barChart from "#bar-chart/index.ts";

describe("index", () => {
  it("exports BarChart alone", () => {
    expect(Object.keys(barChart)).toStrictEqual(["BarChart"]);
  });
});
