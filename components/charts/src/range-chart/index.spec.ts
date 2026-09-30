import { describe, expect, it } from "vitest";

import * as rangeChart from "#range-chart/index.ts";

describe("index", () => {
  it("exports RangeChart alone", () => {
    expect(Object.keys(rangeChart)).toStrictEqual(["RangeChart"]);
  });
});
