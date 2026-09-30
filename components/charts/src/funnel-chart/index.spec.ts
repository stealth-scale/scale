import { describe, expect, it } from "vitest";

import * as funnelChart from "#funnel-chart/index.ts";

describe("index", () => {
  it("exports FunnelChart with the functions that resolve its steps", () => {
    expect(Object.keys(funnelChart).toSorted()).toStrictEqual([
      "FunnelChart",
      "biggestDrop",
      "funnelSteps",
      "funnelWidenings",
    ]);
  });
});
