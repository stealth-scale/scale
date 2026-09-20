import { describe, expect, it } from "vitest";

import { COLORS, CRIMSON, DEEP, INK, NAVY, PAGE, TEAL } from "#colors.ts";

describe("colors", () => {
  it("writes the palest navy in the navy and the navy in a pale teal with the deep blue as its panel", () => {
    expect(COLORS.light).toStrictEqual({ ink: NAVY, page: PAGE });
    expect(COLORS.dark).toStrictEqual({ ink: INK, page: NAVY, panel: DEEP });
  });

  it("draws the primary from the crimson and the secondary from the deep blue and the accent from the teal", () => {
    expect(COLORS.primary).toBe(CRIMSON);
    expect(COLORS.secondary).toBe(DEEP);
    expect(COLORS.accent).toBe(TEAL);
  });

  it("leaves the error status to its canonical hue", () => {
    expect(COLORS.error).toBeUndefined();
  });
});
