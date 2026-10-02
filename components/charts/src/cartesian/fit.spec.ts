import { describe, expect, it } from "vitest";

import { linearFit } from "#cartesian/fit.ts";

describe("linearFit", () => {
  it("returns the slope and intercept of points on a line", () => {
    expect(
      linearFit([
        { x: 0, y: 10 },
        { x: 1, y: 8 },
        { x: 2, y: 6 },
      ]),
    ).toStrictEqual({ intercept: 10, r2: 1, slope: -2 });
  });

  it("returns the share of the variance the line explains", () => {
    expect(
      linearFit([
        { x: 0, y: 0 },
        { x: 1, y: 2 },
        { x: 2, y: 1 },
        { x: 3, y: 3 },
      ])?.r2,
    ).toBeCloseTo(0.64, 2);
  });

  it("fits points on a horizontal line with an r2 of 1", () => {
    expect(
      linearFit([
        { x: 0, y: 4 },
        { x: 2, y: 4 },
      ]),
    ).toStrictEqual({ intercept: 4, r2: 1, slope: 0 });
  });

  it("returns nothing for fewer than two points", () => {
    expect(linearFit([{ x: 0, y: 4 }])).toBeUndefined();
  });

  it("returns nothing for points on a vertical line", () => {
    expect(
      linearFit([
        { x: 3, y: 1 },
        { x: 3, y: 5 },
      ]),
    ).toBeUndefined();
  });
});
