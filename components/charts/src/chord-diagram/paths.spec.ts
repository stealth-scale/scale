import { describe, expect, it } from "vitest";

import { type ChordSpan } from "#chord-diagram/layout.ts";
import { degreesOf, pointOf, ribbonPath, ringOf } from "#chord-diagram/paths.ts";

const ORIGIN = { x: 0, y: 0 };

function square(side: number): { height: number; width: number; x: number; y: number } {
  return { height: side, width: side, x: 0, y: 0 };
}

function span(key: string, startAngle: number, endAngle: number): ChordSpan {
  return { endAngle, key, startAngle, value: 1 };
}

/**
 * Returns a path with every number rounded to two decimals, so -0 and float remainders read as 0.
 */
function rounded(path: string): string {
  return path.replaceAll(/-?\d+(?:\.\d+)?(?:e-?\d+)?/gu, (number) =>
    String(Math.round(Number(number) * 100) / 100 + 0),
  );
}

describe("paths", () => {
  it("centres the ring in the plot's box", () => {
    expect(ringOf({ height: 310, width: 310, x: 5, y: 5 }).centre).toStrictEqual({
      x: 160,
      y: 160,
    });
  });

  it("leaves 32% of the radius outside the ring for the names", () => {
    expect(ringOf(square(500)).outer).toBe(170);
  });

  it("leaves 48px outside the ring for the names in a small plot", () => {
    expect(ringOf(square(200)).outer).toBe(52);
  });

  it("makes the ring 6% of the radius thick", () => {
    const { inner, outer } = ringOf(square(500));

    expect(outer - inner).toBe(15);
  });

  it("makes the ring 8px thick in a small plot", () => {
    const { inner, outer } = ringOf(square(200));

    expect(outer - inner).toBe(8);
  });

  it("ends the ribbons 2px inside the ring", () => {
    const { ends, inner } = ringOf(square(500));

    expect(inner - ends).toBe(2);
  });

  it("takes the radius from the shorter side of the box", () => {
    expect(ringOf({ height: 500, width: 800, x: 0, y: 0 }).outer).toBe(170);
  });

  it("keeps every radius at zero or more in a tiny plot", () => {
    const { ends, inner, outer } = ringOf(square(40));

    expect([ends, inner, outer]).toStrictEqual([0, 0, 0]);
  });

  it("returns the point at 12 o'clock for no angle", () => {
    expect(pointOf(0, 10, { x: 5, y: 5 })).toStrictEqual({ x: 5, y: -5 });
  });

  it("returns the point at 3 o'clock a quarter turn clockwise", () => {
    const { x, y } = pointOf(Math.PI / 2, 10, ORIGIN);

    expect([x, y].map((value) => Math.round(value * 100) / 100 + 0)).toStrictEqual([10, 0]);
  });

  it("turns 12 o'clock into recharts' 90 degrees", () => {
    expect(degreesOf(0)).toBe(90);
  });

  it("turns a half turn clockwise into recharts' -90 degrees", () => {
    expect(degreesOf(Math.PI)).toBe(-90);
  });

  it("follows a ribbon's two ends through the centre", () => {
    expect(
      rounded(
        ribbonPath(
          {
            source: span("a", 0, Math.PI / 2),
            target: span("b", Math.PI, (Math.PI * 3) / 2),
          },
          ORIGIN,
          10,
        ),
      ),
    ).toBe("M0,-10A10,10 0 0 1 10,0Q0,0 0,10A10,10 0 0 1 -10,0Q0,0 0,-10Z");
  });

  it("follows a node's flow to itself as a petal from its one foot", () => {
    const foot = span("a", 0, Math.PI / 2);

    expect(rounded(ribbonPath({ source: foot, target: foot }, ORIGIN, 10))).toBe(
      "M0,-10A10,10 0 0 1 10,0Q0,0 0,-10Z",
    );
  });

  it("follows an end longer than half the circle the long way", () => {
    expect(
      ribbonPath({ source: span("a", 0, 4), target: span("b", 5, 5.5) }, ORIGIN, 10),
    ).toContain("A10,10 0 1 1");
  });

  it("follows an end shorter than half the circle the short way", () => {
    expect(
      ribbonPath({ source: span("a", 0, 3), target: span("b", 5, 5.5) }, ORIGIN, 10),
    ).toContain("A10,10 0 0 1");
  });
});
