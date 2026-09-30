import { describe, expect, it } from "vitest";

import { placementOf } from "#cartesian/placement.ts";

/**
 * Bar 40px wide at 100px, from 40px to 240px.
 */
const BAR = { height: 200, width: 40, x: 100, y: 40 };

describe("placementOf", () => {
  it("places the range's largest value at the bar's top", () => {
    expect(placementOf([0, 100], BAR).at(100)).toBe(40);
  });

  it("places the range's smallest value at the bar's bottom", () => {
    expect(placementOf([0, 100], BAR).at(0)).toBe(240);
  });

  it("places a value between them in proportion", () => {
    expect(placementOf([0, 100], BAR).at(25)).toBe(190);
  });

  it("places every value at the bar's top for a range whose ends are equal", () => {
    expect(placementOf([5, 5], { ...BAR, height: 0 }).at(5)).toBe(40);
  });

  it("returns the bar's start and width with its centre", () => {
    const { middle, width, x } = placementOf([0, 100], BAR);

    expect([x, width, middle]).toStrictEqual([100, 40, 120]);
  });

  it("reads each side recharts does not pass as 0", () => {
    const { at, middle } = placementOf([0, 100], {});

    expect([at(50), middle]).toStrictEqual([0, 0]);
  });
});
