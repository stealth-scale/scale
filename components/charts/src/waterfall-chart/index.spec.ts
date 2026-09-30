import { describe, expect, it } from "vitest";

import * as waterfallChart from "#waterfall-chart/index.ts";

describe("index", () => {
  it("exports WaterfallChart with the function that floats its steps", () => {
    expect(Object.keys(waterfallChart).toSorted()).toStrictEqual([
      "WaterfallChart",
      "waterfallBars",
    ]);
  });
});
