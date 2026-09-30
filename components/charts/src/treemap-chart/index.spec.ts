import { describe, expect, it } from "vitest";

import * as treemapChart from "#treemap-chart/index.ts";

describe("index", () => {
  it("exports TreemapChart", () => {
    expect(Object.keys(treemapChart)).toStrictEqual(["TreemapChart"]);
  });
});
