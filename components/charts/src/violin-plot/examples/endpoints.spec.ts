import { describe, expect, it } from "vitest";

import { boxStats } from "#stats/box.ts";
import { densityPeaks, kernelDensity } from "#stats/density.ts";
import { CHECKOUT, PROFILE, SEARCH } from "#violin-plot/examples/endpoints.ts";

/**
 * Lists the three endpoints' response times in the order the examples render them.
 */
const ENDPOINTS = [SEARCH, CHECKOUT, PROFILE];

describe("endpoints", () => {
  it("lists 50 response times per endpoint", () => {
    expect(ENDPOINTS.map((times) => times.length)).toStrictEqual([50, 50, 50]);
  });

  it("gives search two peaks and each other endpoint one", () => {
    expect(ENDPOINTS.map((times) => densityPeaks(kernelDensity(times)).length)).toStrictEqual([
      2, 1, 1,
    ]);
  });

  it("spans search's middle half across the gap between its peaks", () => {
    expect(boxStats(SEARCH)).toMatchObject({ median: 25, q1: 20.25, q3: 159 });
  });

  it("merges search's peaks into one at a 60ms kernel", () => {
    expect(densityPeaks(kernelDensity(SEARCH, { bandwidth: 60 }))).toHaveLength(1);
  });

  it("runs from 12 to 229 milliseconds", () => {
    expect([Math.min(...ENDPOINTS.flat()), Math.max(...ENDPOINTS.flat())]).toStrictEqual([12, 229]);
  });
});
