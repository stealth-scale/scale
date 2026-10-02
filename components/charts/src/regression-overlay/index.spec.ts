import { describe, expect, it } from "vitest";

import * as regressionOverlay from "#regression-overlay/index.ts";

describe("index", () => {
  it("exports RegressionOverlay with the function that fits it", () => {
    expect(Object.keys(regressionOverlay).toSorted()).toStrictEqual([
      "RegressionOverlay",
      "linearRegression",
    ]);
  });
});
