import { describe, expect, it } from "vitest";

import { quantile } from "#stats/quantile.ts";

/**
 * Lists five sorted values whose quartiles fall between two of them.
 */
const VALUES = [1, 2, 4, 7, 11];

describe("quantile", () => {
  it.each([
    { share: 0, want: 1 },
    { share: 0.25, want: 2 },
    { share: 0.5, want: 4 },
    { share: 0.6, want: 5.2 },
    { share: 1, want: 11 },
  ])("returns $want at the share $share", ({ share, want }) => {
    expect(quantile(VALUES, share)).toBeCloseTo(want, 10);
  });

  it("interpolates between the two nearest values", () => {
    expect(quantile([10, 20], 0.25)).toBe(12.5);
  });

  it("returns the one value of a single value at any share", () => {
    expect(quantile([7], 0.9)).toBe(7);
  });

  it("reads the nearest end for a share outside 0 to 1", () => {
    expect([quantile(VALUES, -1), quantile(VALUES, 2)]).toStrictEqual([1, 11]);
  });

  it("returns NaN without values", () => {
    expect(quantile([], 0.5)).toBeNaN();
  });
});
