import { describe, expect, it } from "vitest";

import * as donutChart from "#donut-chart/index.ts";

describe("index", () => {
  it("exports DonutChart alone", () => {
    expect(Object.keys(donutChart)).toStrictEqual(["DonutChart"]);
  });
});
