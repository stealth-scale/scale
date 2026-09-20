import { describe, expect, it } from "vitest";

import { HUES } from "#contract.ts";
import { colors } from "#preset/tokens/colors.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("colors", () => {
  it("draws a ramp of eleven steps for every hue", () => {
    for (const hue of HUES) {
      expect(Object.keys(tokenAt(colors, hue) ?? {})).toHaveLength(11);
    }
  });

  it("draws every ramp in OKLCH", () => {
    expect(JSON.stringify(colors)).not.toContain("#");
    expect(tokenAt(colors, "blue.500")).toMatch(/^oklch\(/u);
  });

  it("tints the grey towards the blue at a chroma below saturation", () => {
    expect(tokenAt(colors, "gray.500")).toBe("oklch(58.0% 0.0080 262.0)");
  });

  it("draws the two alpha ramps", () => {
    expect(Object.keys(tokenAt(colors, "whiteAlpha") ?? {})).toHaveLength(11);
    expect(tokenAt(colors, "blackAlpha.500")).toBe("oklch(0% 0 0 / 0.36)");
  });

  it("names the four constants", () => {
    expect(tokenAt(colors, "current")).toBe("currentColor");
    expect(tokenAt(colors, "transparent")).toBe("oklch(0% 0 0 / 0)");
    expect(tokenAt(colors, "white")).toBe("oklch(100% 0 0)");
    expect(tokenAt(colors, "black")).toBe("oklch(0% 0 0)");
  });

  it("draws no primary ramp", () => {
    expect(tokenAt(colors, "primary")).toBeUndefined();
  });
});
