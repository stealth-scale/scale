import { describe, expect, it } from "vitest";

import { FORECASTS } from "#data-table/examples/forecast.ts";

describe("forecast", () => {
  it("lists each of the eight departments once", () => {
    expect(new Set(FORECASTS.map((forecast) => forecast.department)).size).toBe(8);
  });

  it("lists the departments from the largest yearly budget to the smallest", () => {
    const yearly = FORECASTS.map((each) => each.q1 + each.q2 + each.q3 + each.q4);

    expect(yearly).toStrictEqual(yearly.toSorted((a, b) => b - a));
  });
});
