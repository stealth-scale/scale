import { describe, expect, it } from "vitest";

import { canonical, stepOf } from "@stealthscale/theme/authoring";

import { COLORS, PRODUCT } from "#colors.ts";

describe("colors", () => {
  it("places the page nearer white and nearer black than the foundation's", () => {
    expect(COLORS.light.page).toBe("oklch(97.5% 0.0100 300.0)");
    expect(COLORS.dark.page).toBe("oklch(13.0% 0.0100 300.0)");
  });

  it("writes each page in a grey that keeps a trace of the violet", () => {
    expect(COLORS.light.ink).toBe(stepOf(PRODUCT, 0.01, 950));
    expect(COLORS.dark.ink).toBe(stepOf(PRODUCT, 0.01, 50));
  });

  it("draws the primary from the violet and the accent and the secondary from canonical hues", () => {
    expect(COLORS.primary).toStrictEqual({
      dark: stepOf(PRODUCT, 0.17, 400),
      light: stepOf(PRODUCT, 0.17, 600),
    });
    expect(COLORS.accent).toStrictEqual(canonical("indigo"));
    expect(COLORS.secondary).toStrictEqual(canonical("pink"));
  });
});
