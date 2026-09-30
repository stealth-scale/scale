import { describe, expect, it } from "vitest";

import { type Division, quadrantOf, spreadPoints } from "#scatter-plot/quadrants.ts";

/**
 * Describes a thing scored on two axes.
 */
interface Scored {
  readonly impact: number;
  readonly likelihood: number;
  readonly name: string;
}

/**
 * Divides both axes at their middle.
 */
const MIDDLE: Division = { x: 0.5, y: 0.5 };

/**
 * Lists the options that spread scores from 0 to 1 on both axes.
 */
const SCORES = {
  x: [0, 1],
  xKey: "likelihood",
  y: [0, 1],
  yKey: "impact",
} as const;

/**
 * Returns the distance between two scored things, in shares of the spans from 0 to 1.
 */
function apart(first: Scored | undefined, second: Scored | undefined): number {
  return Math.hypot(
    (first?.likelihood ?? 0) - (second?.likelihood ?? 0),
    (first?.impact ?? 0) - (second?.impact ?? 0),
  );
}

describe("quadrants", () => {
  it.each([
    { quadrant: "topStart", x: 0.2, y: 0.8 },
    { quadrant: "topEnd", x: 0.8, y: 0.8 },
    { quadrant: "bottomStart", x: 0.2, y: 0.2 },
    { quadrant: "bottomEnd", x: 0.8, y: 0.2 },
  ])("places $x and $y in $quadrant", ({ quadrant, x, y }) => {
    expect(quadrantOf(x, y, MIDDLE)).toBe(quadrant);
  });

  it("places a point on both dividing lines in topEnd", () => {
    expect(quadrantOf(0.5, 0.5, MIDDLE)).toBe("topEnd");
  });

  it("keeps a point that has room where it is", () => {
    const lone = [{ impact: 0.7, likelihood: 0.3, name: "Churn" }];

    expect(spreadPoints(lone, SCORES)).toStrictEqual(lone);
  });

  it("moves two equal points the distance apart", () => {
    const [first, second] = spreadPoints(
      [
        { impact: 0.8, likelihood: 0.8, name: "Breach" },
        { impact: 0.8, likelihood: 0.8, name: "Outage" },
      ],
      SCORES,
    );

    expect(apart(first, second)).toBeGreaterThanOrEqual(0.06);
  });

  it("keeps a larger distance when one is stated", () => {
    const [first, second] = spreadPoints(
      [
        { impact: 0.8, likelihood: 0.8, name: "Breach" },
        { impact: 0.8, likelihood: 0.8, name: "Outage" },
      ],
      { ...SCORES, distance: 0.2 },
    );

    expect(apart(first, second)).toBeGreaterThanOrEqual(0.2);
  });

  it("keeps every moved point in the quadrant it scored in", () => {
    const crowd = Array.from({ length: 6 }, (_, index) => ({
      impact: 0.52,
      likelihood: 0.52,
      name: `Risk ${String(index)}`,
    }));

    expect(
      spreadPoints(crowd, SCORES).map((each) => quadrantOf(each.likelihood, each.impact, MIDDLE)),
    ).toStrictEqual(Array.from({ length: 6 }, () => "topEnd"));
  });

  it("keeps the points inside the spans", () => {
    const corner = Array.from({ length: 4 }, (_, index) => ({
      impact: 1,
      likelihood: 1,
      name: `Risk ${String(index)}`,
    }));
    const values = spreadPoints(corner, SCORES).flatMap((each) => [each.likelihood, each.impact]);

    expect(values.every((value) => value >= 0 && value <= 1)).toBe(true);
  });

  it("divides at the stated division", () => {
    const pair = [
      { impact: 0.2, likelihood: 0.26, name: "Fraud" },
      { impact: 0.2, likelihood: 0.26, name: "Theft" },
    ];
    const spread = spreadPoints(pair, { ...SCORES, division: { x: 0.25, y: 0.5 } });

    expect(spread.every((each) => each.likelihood >= 0.25)).toBe(true);
  });

  it("places the points the same way on every call", () => {
    const pair = [
      { impact: 0.6, likelihood: 0.9, name: "Breach" },
      { impact: 0.6, likelihood: 0.9, name: "Outage" },
    ];

    expect(spreadPoints(pair, SCORES)).toStrictEqual(spreadPoints(pair, SCORES));
  });

  it("keeps every point at the value of an axis whose span has no width", () => {
    const flat = spreadPoints(
      [
        { impact: 0.5, likelihood: 0.7, name: "Breach" },
        { impact: 0.5, likelihood: 0.7, name: "Outage" },
      ],
      { ...SCORES, y: [0.5, 0.5] },
    );

    expect(flat.map((each) => each.impact)).toStrictEqual([0.5, 0.5]);
  });

  it("returns a point without a finite value as it is", () => {
    const missing = { impact: Number.NaN, likelihood: 0.4, name: "Unknown" };

    expect(spreadPoints([missing], SCORES)).toStrictEqual([missing]);
  });

  it("spreads values on the axes' own spans", () => {
    const [first, second] = spreadPoints(
      [
        { impact: 40, likelihood: 70, name: "Breach" },
        { impact: 40, likelihood: 70, name: "Outage" },
      ],
      { ...SCORES, x: [0, 100], y: [0, 100] },
    );
    const distance = Math.hypot(
      ((first?.likelihood ?? 0) - (second?.likelihood ?? 0)) / 100,
      ((first?.impact ?? 0) - (second?.impact ?? 0)) / 100,
    );

    expect(distance).toBeGreaterThanOrEqual(0.06);
  });
});
