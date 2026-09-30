import { describe, expect, it } from "vitest";

import { pairOf, SCORES, spanOf } from "#scatter-plot/span.ts";

describe("span", () => {
  it("returns the two numbers a domain states", () => {
    expect(pairOf([2, 8])).toStrictEqual([2, 8]);
  });

  it.each([
    { domain: undefined, kind: "no domain" },
    { domain: ["dataMin", "dataMax"], kind: "a domain of words" },
    { domain: [0, "auto"], kind: "a domain with one number" },
  ] as const)("returns no pair for $kind", ({ domain }) => {
    expect(pairOf(domain)).toBeUndefined();
  });

  it("spans an axis over its stated domain", () => {
    expect(spanOf({ domain: [2, 8], ends: ["Low", "High"], key: "x" }, [])).toStrictEqual([2, 8]);
  });

  it("spans an axis with named ends from 0 to 1 without a stated domain", () => {
    expect(spanOf({ domain: undefined, ends: ["Low", "High"], key: "x" }, [{ x: 5 }])).toBe(SCORES);
  });

  it("spans an axis over the points' values without a stated domain", () => {
    expect(spanOf({ domain: undefined, key: "x" }, [{ x: 3 }, { x: 9 }, { x: 5 }])).toStrictEqual([
      3, 9,
    ]);
  });

  it("leaves out a point without a finite value", () => {
    expect(
      spanOf({ domain: undefined, key: "x" }, [{ x: 3 }, { x: Number.NaN }, {}, { x: 9 }]),
    ).toStrictEqual([3, 9]);
  });

  it("spans scores from 0 to 1", () => {
    expect(SCORES).toStrictEqual([0, 1]);
  });
});
