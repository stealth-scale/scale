import { describe, expect, it } from "vitest";

import { HUES } from "#contract.ts";
import { alphaScale, colorScale, RAMPS, scaleOf, stepOf } from "#draw/ramps.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("ramps", () => {
  it("places every hue on the wheel with its chroma", () => {
    expect(Object.keys(RAMPS).toSorted()).toStrictEqual([...HUES].toSorted());
    expect(RAMPS.blue).toStrictEqual([262, 0.14]);
  });

  it("writes a step of a ramp at the lightness of the step", () => {
    expect(stepOf(262, 0.14, 500)).toBe("oklch(58.0% 0.1400 262.0)");
    expect(stepOf(262, 0.14, 600)).toBe("oklch(47.0% 0.1372 262.0)");
  });

  it("refuses a step no ramp has", () => {
    expect(() => stepOf(262, 0.14, 550)).toThrow("550 is not a step of a ramp");
  });

  it("holds a grey at its chroma at both ends", () => {
    expect(stepOf(...RAMPS.gray, 50)).toBe("oklch(97.0% 0.0075 262.0)");
    expect(stepOf(...RAMPS.gray, 950)).toBe("oklch(15.0% 0.0076 262.0)");
  });

  it("lets a saturated ramp fall away at the ends", () => {
    expect(stepOf(262, 0.14, 50)).toBe("oklch(97.0% 0.0252 262.0)");
    expect(stepOf(262, 0.14, 950)).toBe("oklch(15.0% 0.0588 262.0)");
  });

  it("draws eleven steps keyed 50 to 950", () => {
    expect(Object.keys(colorScale(262, 0.14))).toStrictEqual([
      "50",
      "100",
      "200",
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "900",
      "950",
    ]);
  });

  it("draws the ramp of the hue and the chroma a color is drawn in", () => {
    expect(tokenAt(scaleOf("oklch(47% 0.1372 262)"), "500")).toBe("oklch(58.0% 0.1372 262.0)");
    expect(Object.keys(scaleOf("#d72323"))).toHaveLength(11);
  });

  it("draws the two overlays", () => {
    expect(tokenAt(alphaScale("black"), "500")).toBe("oklch(0% 0 0 / 0.36)");
    expect(tokenAt(alphaScale("white"), "50")).toBe("oklch(100% 0 0 / 0.04)");
  });
});
