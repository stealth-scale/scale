import { describe, expect, it } from "vitest";

import * as sankeyChart from "#sankey-chart/index.ts";

describe("index", () => {
  it("exports SankeyChart and the checks of its flow graph", () => {
    expect(Object.keys(sankeyChart).toSorted()).toStrictEqual([
      "SankeyChart",
      "flowBalance",
      "sankeyCycles",
    ]);
  });
});
