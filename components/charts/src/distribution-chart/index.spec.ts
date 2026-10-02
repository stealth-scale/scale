import { describe, expect, it } from "vitest";

import * as distributionChart from "#distribution-chart/index.ts";

describe("index", () => {
  it("exports DistributionChart alone", () => {
    expect(Object.keys(distributionChart)).toStrictEqual(["DistributionChart"]);
  });
});
