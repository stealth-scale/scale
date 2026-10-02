import { describe, expect, it } from "vitest";

import { ECONOMY, EXPRESS, STANDARD } from "#box-plot/examples/methods.ts";
import { boxStats } from "#stats/box.ts";

describe("methods", () => {
  it("lists 92 orders across the three methods", () => {
    expect([EXPRESS, STANDARD, ECONOMY].map((days) => days.length)).toStrictEqual([31, 31, 30]);
  });

  it("puts the methods' medians from 1.5 to 5 days", () => {
    expect([EXPRESS, STANDARD, ECONOMY].map((days) => boxStats(days)?.median)).toStrictEqual([
      1.5, 3, 5,
    ]);
  });

  it("ends the slowest delivery at 7.5 days", () => {
    expect(Math.max(...EXPRESS, ...STANDARD, ...ECONOMY)).toBe(7.5);
  });
});
