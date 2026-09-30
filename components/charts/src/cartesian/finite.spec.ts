import { describe, expect, it } from "vitest";

import { finiteAt, finiteOf, FROM_ZERO } from "#cartesian/finite.ts";

describe("finite", () => {
  it("returns a finite number", () => {
    expect(finiteOf(42)).toBe(42);
  });

  it.each([
    { label: "NaN", value: Number.NaN },
    { label: "Infinity", value: Number.POSITIVE_INFINITY },
    { label: "a numeric string", value: "42" },
    { label: "null", value: null },
  ])("returns nothing for $label", ({ value }) => {
    expect(finiteOf(value)).toBeUndefined();
  });

  it("reads a row's field as a finite number", () => {
    expect(finiteAt({ paid: 120 }, "paid")).toBe(120);
  });

  it("returns nothing for a row that is not an object", () => {
    expect(finiteAt(120, "paid")).toBeUndefined();
  });

  it("widens a positive range down to zero", () => {
    expect(FROM_ZERO.map((edge, index) => edge(index === 0 ? 20 : 90))).toStrictEqual([0, 90]);
  });

  it("widens a negative range up to zero", () => {
    expect(FROM_ZERO.map((edge, index) => edge(index === 0 ? -90 : -20))).toStrictEqual([-90, 0]);
  });
});
