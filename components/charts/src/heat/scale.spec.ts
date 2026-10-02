import { describe, expect, it } from "vitest";

import { fillOf, heatmapDomain, intensityOf, type Paint, rampOf, ticksOf } from "#heat/scale.ts";

/**
 * Returns a sequential scale over orders from 10 to 30 in the first series color.
 */
function sequential(changes: Partial<Paint> = {}): Paint {
  return {
    color: "series.1",
    colors: { negative: "orange", positive: "blue" },
    domain: { max: 30, min: 10 },
    midpoint: 0,
    scale: "sequential",
    ...changes,
  };
}

/**
 * Returns a diverging scale over a headcount against plan from -2 to 8.
 */
function diverging(changes: Partial<Paint> = {}): Paint {
  return sequential({ domain: { max: 8, min: -2 }, scale: "diverging", ...changes });
}

/**
 * Returns the CSS value of a color mixed over the panel at a share in percent.
 */
function mixed(color: string, share: number): string {
  return `color-mix(in oklab, var(--colors-${color}) ${String(share)}%, var(--colors-bg-panel))`;
}

describe("scale", () => {
  it("returns the span of the values", () => {
    expect(heatmapDomain([{ value: 10 }, { value: 30 }, { value: 20 }])).toStrictEqual({
      max: 30,
      min: 10,
    });
  });

  it("leaves a missing value out of the span", () => {
    expect(heatmapDomain([{ value: null }, { value: 20 }, { value: 12 }])).toStrictEqual({
      max: 20,
      min: 12,
    });
  });

  it("leaves a value that is not finite out of the span", () => {
    expect(
      heatmapDomain([{ value: Number.NaN }, { value: Number.POSITIVE_INFINITY }, { value: 4 }]),
    ).toStrictEqual({ max: 4, min: 4 });
  });

  it("returns a span from 0 to 0 without a value", () => {
    expect(heatmapDomain([{ value: null }])).toStrictEqual({ max: 0, min: 0 });
  });

  it.each([
    { value: 10, want: 0 },
    { value: 20, want: 0.5 },
    { value: 30, want: 1 },
  ])("places $value at $want on a sequential scale from 10 to 30", ({ value, want }) => {
    expect(intensityOf(value, sequential())).toBe(want);
  });

  it.each([
    { value: 4, want: 0 },
    { value: 50, want: 1 },
  ])("clamps $value to $want past a sequential domain", ({ value, want }) => {
    expect(intensityOf(value, sequential())).toBe(want);
  });

  it("places every value at full strength on a domain of one value", () => {
    expect(intensityOf(5, sequential({ domain: { max: 5, min: 5 } }))).toBe(1);
  });

  it.each([
    { value: 8, want: 1 },
    { value: -2, want: -0.25 },
    { value: 0, want: 0 },
  ])("places $value at $want with one reach on both sides of the midpoint", ({ value, want }) => {
    expect(intensityOf(value, diverging())).toBe(want);
  });

  it.each([
    { value: 100, want: 1 },
    { value: 80, want: 0 },
    { value: 60, want: -1 },
  ])("places $value at $want about a midpoint of 80", ({ value, want }) => {
    expect(intensityOf(value, diverging({ domain: { max: 100, min: 60 }, midpoint: 80 }))).toBe(
      want,
    );
  });

  it("places a value against the minimum when the minimum is further from the midpoint", () => {
    expect(intensityOf(-4, diverging({ domain: { max: 2, min: -8 } }))).toBe(-0.5);
  });

  it("clamps a value past the reach of a diverging scale", () => {
    expect(intensityOf(-20, diverging())).toBe(-1);
  });

  it("places every value at the midpoint when the domain is all midpoint", () => {
    expect(intensityOf(3, diverging({ domain: { max: 0, min: 0 } }))).toBe(0);
  });

  it.each([
    { share: 12, value: 10 },
    { share: 56, value: 20 },
    { share: 100, value: 30 },
  ])("fills $value with $share% of the color on a sequential scale", ({ share, value }) => {
    expect(fillOf(value, sequential())).toBe(mixed("series-1", share));
  });

  it("fills a value under the midpoint with the negative color", () => {
    expect(fillOf(-2, diverging())).toBe(mixed("orange-chart", 25));
  });

  it("fills a value over the midpoint with the positive color", () => {
    expect(fillOf(8, diverging())).toBe(mixed("blue-chart", 100));
  });

  it("fills the midpoint with the panel", () => {
    expect(fillOf(0, diverging())).toBe(mixed("blue-chart", 0));
  });

  it("runs a sequential key from the faintest color to the strongest", () => {
    expect(rampOf(sequential())).toStrictEqual([mixed("series-1", 12), mixed("series-1", 100)]);
  });

  it("runs a diverging key from the negative color through the panel to the positive color", () => {
    expect(rampOf(diverging())).toStrictEqual([
      mixed("orange-chart", 100),
      "var(--colors-bg-panel)",
      mixed("blue-chart", 100),
    ]);
  });

  it("returns the domain's ends as a sequential key's values", () => {
    expect(ticksOf(sequential())).toStrictEqual({ high: 30, low: 10 });
  });

  it("returns the midpoint and the reach on both sides as a diverging key's values", () => {
    expect(ticksOf(diverging())).toStrictEqual({ high: 8, low: -8, midpoint: 0 });
  });

  it("returns the reach about a midpoint that is not zero", () => {
    expect(ticksOf(diverging({ domain: { max: 100, min: 60 }, midpoint: 70 }))).toStrictEqual({
      high: 100,
      low: 40,
      midpoint: 70,
    });
  });
});
