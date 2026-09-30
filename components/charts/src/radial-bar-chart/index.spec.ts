import { describe, expect, it } from "vitest";

import * as radialBarChart from "#radial-bar-chart/index.ts";

describe("index", () => {
  it("exports RadialBarChart alone", () => {
    expect(Object.keys(radialBarChart)).toStrictEqual(["RadialBarChart"]);
  });
});
