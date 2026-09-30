import { describe, expect, it } from "vitest";

import * as horizontalBarChart from "#horizontal-bar-chart/index.ts";

describe("index", () => {
  it("exports HorizontalBarChart alone", () => {
    expect(Object.keys(horizontalBarChart)).toStrictEqual(["HorizontalBarChart"]);
  });
});
