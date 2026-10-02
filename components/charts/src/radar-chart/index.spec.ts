import { describe, expect, it } from "vitest";

import * as radarChart from "#radar-chart/index.ts";

describe("index", () => {
  it("exports RadarChart alone", () => {
    expect(Object.keys(radarChart)).toStrictEqual(["RadarChart"]);
  });
});
