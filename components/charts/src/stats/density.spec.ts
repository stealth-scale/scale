import { describe, expect, it } from "vitest";

import { densityPeaks, kernelDensity, silvermanBandwidth } from "#stats/density.ts";

/**
 * Returns the standard normal density at a value.
 */
function normal(value: number): number {
  return Math.exp(-0.5 * value * value) / Math.sqrt(2 * Math.PI);
}

describe("density", () => {
  it("returns Silverman's bandwidth from the interquartile range when it is the smaller", () => {
    expect(silvermanBandwidth([1, 2, 3, 4, 5])).toBeCloseTo(0.9735846, 6);
  });

  it("returns Silverman's bandwidth from the standard deviation while the middle half ties", () => {
    expect(silvermanBandwidth([5, 5, 5, 5, 9])).toBeCloseTo(1.1668727, 6);
  });

  it("returns a bandwidth of 0 for equal values", () => {
    expect(silvermanBandwidth([4, 4, 4])).toBe(0);
  });

  it("returns a bandwidth of 0 for one value", () => {
    expect(silvermanBandwidth([4])).toBe(0);
  });

  it("leaves a value that is not a finite number out of the bandwidth", () => {
    expect(silvermanBandwidth([1, 2, "n/a", 3, Number.NaN, 4, 5])).toBeCloseTo(0.9735846, 6);
  });

  it("samples the density from the smallest value to the largest", () => {
    expect(
      kernelDensity([0, 10], { bandwidth: 1, resolution: 3 }).map((point) => point.value),
    ).toStrictEqual([0, 5, 10]);
  });

  it("averages a Gaussian kernel of the bandwidth over the values", () => {
    const [start, middle] = kernelDensity([0, 10], { bandwidth: 1, resolution: 3 });

    expect(start?.density).toBeCloseTo((normal(0) + normal(10)) / 2, 12);
    expect(middle?.density).toBeCloseTo(normal(5), 12);
  });

  it("samples 64 points unless stated", () => {
    expect(kernelDensity([1, 2, 3, 4, 5])).toHaveLength(64);
  });

  it("samples at least two points", () => {
    expect(kernelDensity([1, 5], { bandwidth: 1, resolution: 1 })).toHaveLength(2);
  });

  it("uses Silverman's bandwidth unless stated", () => {
    const bandwidth = silvermanBandwidth([1, 2, 3, 4, 5]);

    expect(kernelDensity([1, 2, 3, 4, 5], { resolution: 2 })).toStrictEqual(
      kernelDensity([1, 2, 3, 4, 5], { bandwidth, resolution: 2 }),
    );
  });

  it("returns one point with all the mass for equal values", () => {
    expect(kernelDensity([4, 4, 4])).toStrictEqual([{ density: 1, value: 4 }]);
  });

  it("returns one point with all the mass for a bandwidth that is not a number", () => {
    expect(kernelDensity([1, 4], { bandwidth: Number.NaN })).toStrictEqual([
      { density: 1, value: 1 },
    ]);
  });

  it("returns no points without a finite value", () => {
    expect(kernelDensity(["n/a"])).toStrictEqual([]);
  });

  it("returns the value of each local maximum", () => {
    const density = kernelDensity([10, 11, 12, 30, 31, 32], { bandwidth: 1, resolution: 23 });

    expect(densityPeaks(density)).toStrictEqual([11, 31]);
  });

  it("reads a run of equal densities as one peak at its middle", () => {
    expect(
      densityPeaks([
        { density: 1, value: 0 },
        { density: 3, value: 1 },
        { density: 3, value: 2 },
        { density: 3, value: 3 },
        { density: 1, value: 4 },
      ]),
    ).toStrictEqual([2]);
  });

  it("leaves out a maximum under the floor's share of the tallest peak", () => {
    const density = [
      { density: 10, value: 0 },
      { density: 0, value: 1 },
      { density: 0.4, value: 2 },
      { density: 0, value: 3 },
    ];

    expect([densityPeaks(density), densityPeaks(density, 0.01)]).toStrictEqual([[0], [0, 2]]);
  });

  it("returns the one point of a density of equal values as its peak", () => {
    expect(densityPeaks([{ density: 1, value: 4 }])).toStrictEqual([4]);
  });

  it("returns no peaks for no points", () => {
    expect(densityPeaks([])).toStrictEqual([]);
  });
});
