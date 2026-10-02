import { describe, expect, it } from "vitest";

import * as areaChart from "#area-chart/index.ts";

describe("index", () => {
  it("exports AreaChart alone", () => {
    expect(Object.keys(areaChart)).toStrictEqual(["AreaChart"]);
  });
});
