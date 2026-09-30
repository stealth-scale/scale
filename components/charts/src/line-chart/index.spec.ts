import { describe, expect, it } from "vitest";

import * as lineChart from "#line-chart/index.ts";

describe("index", () => {
  it("exports LineChart alone", () => {
    expect(Object.keys(lineChart)).toStrictEqual(["LineChart"]);
  });
});
