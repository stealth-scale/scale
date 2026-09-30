import { describe, expect, it } from "vitest";

import * as pieChart from "#pie-chart/index.ts";

describe("index", () => {
  it("exports PieChart alone", () => {
    expect(Object.keys(pieChart)).toStrictEqual(["PieChart"]);
  });
});
