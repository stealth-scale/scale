import { describe, expect, it } from "vitest";

import { linearRegression } from "#regression-overlay/regression.ts";

describe("regression", () => {
  it("returns the least-squares line through the points", () => {
    const fit = linearRegression(
      [
        { price: 10, units: 400 },
        { price: 20, units: 300 },
        { price: 30, units: 200 },
      ],
      "price",
      "units",
    );

    expect(fit).toStrictEqual({ intercept: 500, r2: 1, slope: -10 });
  });

  it("leaves out a point whose x or y is not a finite number", () => {
    const fit = linearRegression(
      [
        { price: 10, units: 400 },
        { price: Number.NaN, units: 900 },
        { price: 20, units: undefined },
        { price: 30, units: 200 },
      ],
      "price",
      "units",
    );

    expect(fit).toMatchObject({ intercept: 500, slope: -10 });
  });

  it("returns nothing for fewer than two points", () => {
    expect(linearRegression([{ price: 10, units: 400 }], "price", "units")).toBeUndefined();
  });
});
