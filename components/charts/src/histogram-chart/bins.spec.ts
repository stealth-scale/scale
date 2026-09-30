import { describe, expect, it } from "vitest";

import { binCount, binValues, type ChartBin, inBin } from "#histogram-chart/bins.ts";

/**
 * Lists twenty response times in milliseconds with a long tail.
 */
const LATENCIES = [
  12, 18, 21, 25, 30, 33, 35, 38, 41, 44, 47, 52, 55, 61, 68, 74, 88, 120, 180, 410,
];

/**
 * Returns the width of the first bin.
 */
function widthOf(bins: readonly ChartBin[]): number | undefined {
  const [first] = bins;

  return first === undefined ? undefined : first.to - first.from;
}

/**
 * Returns the count of every bin, in order.
 */
function countsOf(bins: readonly ChartBin[]): number[] {
  return bins.map((bin) => bin.count);
}

describe("bins", () => {
  it("returns Freedman–Diaconis' count", () => {
    expect(binCount(LATENCIES)).toBe(15);
  });

  it("returns Sturges' count where the middle half of the values ties", () => {
    expect(binCount([5, 5, 5, 5, 6])).toBe(4);
  });

  it("returns one bin for fewer than two values", () => {
    expect(binCount([5])).toBe(1);
  });

  it("aims for Freedman–Diaconis' count without bins", () => {
    const bins = binValues(LATENCIES);

    expect([bins.length, widthOf(bins)]).toStrictEqual([21, 20]);
  });

  it("counts a value on an edge between two bins into the upper bin", () => {
    expect(countsOf(binValues([0, 5, 10], { bins: 2 }))).toStrictEqual([1, 2]);
  });

  it("counts a value on the top edge into the last bin", () => {
    expect(binValues([0, 10, 20], { bins: 2 })).toStrictEqual([
      { count: 1, from: 0, to: 10 },
      { count: 2, from: 10, to: 20 },
    ]);
  });

  it.each([
    { span: 12, width: 1 },
    { span: 25, width: 2 },
    { span: 40, width: 5 },
    { span: 80, width: 10 },
  ])("snaps a span of $span in 10 bins to a width of $width", ({ span, width }) => {
    expect(widthOf(binValues([0, span], { bins: 10 }))).toBe(width);
  });

  it("steps one width coarser where the bins would pass 30", () => {
    const bins = binValues([0, 42], { bins: 30 });

    expect([bins.length, widthOf(bins)]).toStrictEqual([21, 2]);
  });

  it("starts the first bin at a multiple of the width", () => {
    expect(binValues([13, 47], { bins: 4 }).map((bin) => bin.from)).toStrictEqual([10, 20, 30, 40]);
  });

  it("starts the bins at the lower edge of a domain", () => {
    expect(binValues([30, 60], { bins: 4, domain: [3, 103] }).map((bin) => bin.from)).toStrictEqual(
      [3, 23, 43, 63, 83],
    );
  });

  it("steps one width coarser in a domain where the bins would pass 30", () => {
    expect(binValues([1, 2], { bins: 30, domain: [0, 42] })).toHaveLength(21);
  });

  it("leaves out a value outside the domain", () => {
    expect(
      countsOf(binValues([-5, 0, 30, 60, 100, 150], { bins: 4, domain: [0, 100] })),
    ).toStrictEqual([1, 1, 0, 1, 1]);
  });

  it("bins nothing for a domain whose upper edge is not above its lower edge", () => {
    expect(binValues([1, 2], { domain: [10, 0] })).toStrictEqual([]);
  });

  it("returns one bin a tenth of the value wide for values that are all equal", () => {
    expect(binValues([7, 7, 7])).toStrictEqual([{ count: 3, from: 7, to: 7.5 }]);
  });

  it("returns one bin 1 wide for zeros", () => {
    expect(binValues([0, 0])).toStrictEqual([{ count: 2, from: 0, to: 1 }]);
  });

  it("leaves out a value that is not a finite number", () => {
    const bins = binValues([0.1, "x", null, Number.NaN, Number.POSITIVE_INFINITY, 0.3, 0.7], {
      bins: 3,
    });

    expect(countsOf(bins)).toStrictEqual([1, 1, 0, 1]);
  });

  it("returns no bins without a finite value", () => {
    expect(binValues(["x", null])).toStrictEqual([]);
  });

  it("rounds each edge to twelve significant digits", () => {
    expect(binValues([0.1, 0.8], { bins: 4 }).map((bin) => bin.to)).toStrictEqual([
      0.2, 0.4, 0.6, 0.8,
    ]);
  });

  it("aims for one bin when bins is below 1", () => {
    expect(binValues(LATENCIES, { bins: 0 })).toStrictEqual([{ count: 20, from: 0, to: 500 }]);
  });

  it("aims for 30 bins when bins is above 30", () => {
    expect(binValues(LATENCIES, { bins: 1000 })).toHaveLength(21);
  });

  it("aims for Freedman–Diaconis' count when bins is not a finite number", () => {
    expect(binValues(LATENCIES, { bins: Number.NaN })).toHaveLength(21);
  });

  it.each([
    { last: false, value: 0, want: true },
    { last: false, value: 10, want: false },
    { last: true, value: 10, want: true },
    { last: true, value: -1, want: false },
    { last: true, value: 11, want: false },
  ])(
    "returns $want for $value in a bin from 0 to 10 when last is $last",
    ({ last, value, want }) => {
      expect(inBin(value, { count: 0, from: 0, to: 10 }, last)).toBe(want);
    },
  );
});
