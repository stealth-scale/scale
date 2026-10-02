import { describe, expect, it } from "vitest";

import * as stats from "#stats/index.ts";

describe("index", () => {
  it("exports the box plot's and the violin's statistics with quantile", () => {
    expect(Object.keys(stats).toSorted()).toStrictEqual([
      "boxStats",
      "densityPeaks",
      "kernelDensity",
      "quantile",
      "silvermanBandwidth",
    ]);
  });
});
