import { describe, expect, it } from "vitest";

import { canonical, stepOf } from "@stealthscale/theme/authoring";

import { COLORS, NEUTRAL, PRODUCT } from "#colors.ts";

describe("colors", () => {
  it("places the page near white in light mode and near black in dark mode", () => {
    expect(COLORS.light.page).toBe("oklch(96.0% 0.0160 195.0)");
    expect(COLORS.dark.page).toBe("oklch(15.0% 0.0160 195.0)");
  });

  it("writes each page in a grey tinted a little bluer than the product", () => {
    expect(COLORS.light.ink).toBe(stepOf(NEUTRAL, 0.012, 950));
    expect(COLORS.dark.ink).toBe(stepOf(NEUTRAL, 0.012, 50));
    expect(NEUTRAL).toBeGreaterThan(PRODUCT);
  });

  it("draws the primary from the teal and the accent and the secondary from canonical hues", () => {
    expect(COLORS.primary).toStrictEqual({
      dark: stepOf(PRODUCT, 0.12, 400),
      light: stepOf(PRODUCT, 0.12, 600),
    });
    expect(COLORS.accent).toStrictEqual(canonical("cyan"));
    expect(COLORS.secondary).toStrictEqual(canonical("indigo"));
  });
});
