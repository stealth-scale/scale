import { describe, expect, it } from "vitest";

import * as polarAreaChart from "#polar-area-chart/index.ts";

describe("index", () => {
  it("exports PolarAreaChart with the function that sizes its wedges", () => {
    expect(Object.keys(polarAreaChart).toSorted()).toStrictEqual(["PolarAreaChart", "areaRadius"]);
  });
});
