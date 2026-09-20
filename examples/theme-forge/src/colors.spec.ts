import { describe, expect, it } from "vitest";

import { canonical, stepOf } from "@stealthscale/theme/authoring";

import { COLORS, NEUTRAL, PRODUCT, WARNING } from "#colors.ts";

describe("colors", () => {
  it("places a cream page in light mode and a warm dark one in dark mode", () => {
    expect(COLORS.light.page).toBe("oklch(96.0% 0.0200 75.0)");
    expect(COLORS.dark.page).toBe("oklch(14.0% 0.0200 75.0)");
  });

  it("writes each page in a warm grey", () => {
    expect(COLORS.light.ink).toBe(stepOf(NEUTRAL, 0.014, 950));
    expect(COLORS.dark.ink).toBe(stepOf(NEUTRAL, 0.014, 50));
  });

  it("draws the primary from the amber a step lighter by day", () => {
    expect(COLORS.primary).toStrictEqual({
      dark: stepOf(PRODUCT, 0.17, 400),
      light: stepOf(PRODUCT, 0.17, 500),
    });
  });

  it("draws warnings in a yellow leaning towards orange to stay apart from the amber", () => {
    expect(COLORS.warning).toStrictEqual({
      dark: stepOf(WARNING, 0.15, 400),
      light: stepOf(WARNING, 0.15, 500),
    });
    expect(WARNING - PRODUCT).toBeGreaterThanOrEqual(30);
    expect(COLORS.accent).toStrictEqual(canonical("teal"));
  });
});
