import { describe, expect, it } from "vitest";

import { ceilingOf } from "#polar/ceiling.ts";

describe("ceilingOf", () => {
  it("returns max when it is above zero", () => {
    expect(ceilingOf([0.82], 1)).toBe(1);
  });

  it.each([
    { label: "without max", max: undefined },
    { label: "at a max of 0", max: 0 },
    { label: "at a negative max", max: -1 },
    { label: "at a max that is not a number", max: Number.NaN },
  ])("returns the largest value $label", ({ max }) => {
    expect(ceilingOf([0.34, 0.82], max)).toBe(0.82);
  });

  it("returns 1 when no value is above zero", () => {
    expect(ceilingOf([0, -0.2])).toBe(1);
  });

  it("returns 1 without values", () => {
    expect(ceilingOf([])).toBe(1);
  });
});
