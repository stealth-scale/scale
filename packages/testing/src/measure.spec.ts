/**
 * Covers the length reader and the edge-to-edge measurement.
 *
 * @remarks
 *   No element is rendered. Each rectangle is declared as two fixed numbers, because the test
 *   runner lays out nothing.
 */

import { describe, expect, it } from "vitest";

import { type Measured, pixels, seamBetween } from "#measure.ts";

/**
 * Returns a stub element reporting the two edges it is given.
 *
 * @remarks
 *   Every call returns the same numbers, so a measurement reads the declared edges and not a
 *   computed layout.
 */
function boxed(left: number, right: number): Measured {
  return { getBoundingClientRect: () => ({ left, right }) };
}

describe("pixels", () => {
  it("returns the number in front of the unit", () => {
    expect(pixels("16px")).toBe(16);
    expect(pixels("0.5rem")).toBe(0.5);
  });

  it("returns a negative length", () => {
    expect(pixels("-4px")).toBe(-4);
  });

  it("returns 0 when the length opens with no number", () => {
    expect(pixels("auto")).toBe(0);
    expect(pixels("")).toBe(0);
  });
});

describe("seamBetween", () => {
  it("returns 0 when the two elements share an edge", () => {
    expect(seamBetween(boxed(0, 80), boxed(80, 160))).toBe(0);
  });

  it("returns the gap between the two elements", () => {
    expect(seamBetween(boxed(0, 80), boxed(92, 160))).toBe(12);
  });

  it("returns a positive distance when the two elements overlap", () => {
    expect(seamBetween(boxed(0, 80), boxed(72, 160))).toBe(8);
  });
});
