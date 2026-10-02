import { describe, expect, it } from "vitest";

import * as sunburstChart from "#sunburst-chart/index.ts";

describe("index", () => {
  it("exports SunburstChart", () => {
    expect(Object.keys(sunburstChart)).toStrictEqual(["SunburstChart"]);
  });
});
