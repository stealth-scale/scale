import { describe, expect, it } from "vitest";

import * as gaugeChart from "#gauge-chart/index.ts";

describe("index", () => {
  it("exports GaugeChart with the functions that resolve its zones", () => {
    expect(Object.keys(gaugeChart).toSorted()).toStrictEqual([
      "GaugeChart",
      "gaugeBandAt",
      "gaugeBands",
    ]);
  });
});
