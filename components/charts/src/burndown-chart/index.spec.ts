import { describe, expect, it } from "vitest";

import * as burndownChart from "#burndown-chart/index.ts";

describe("index", () => {
  it("exports BurndownChart with the functions that build its rows", () => {
    expect(Object.keys(burndownChart).toSorted()).toStrictEqual([
      "BurndownChart",
      "burndownFinish",
      "burndownRows",
    ]);
  });
});
