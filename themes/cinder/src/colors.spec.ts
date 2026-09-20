import { describe, expect, it } from "vitest";

import { ASH, COLORS, RED, SLATE, STEEL } from "#colors.ts";

describe("colors", () => {
  it("writes the ash page in the slate and the slate page in the ash with the steel as its panel", () => {
    expect(COLORS.light).toStrictEqual({ ink: SLATE, page: ASH });
    expect(COLORS.dark).toStrictEqual({ ink: ASH, page: SLATE, panel: STEEL });
  });

  it("draws the primary and the keyword from the red and the secondary from the steel", () => {
    expect(COLORS.primary).toBe(RED);
    expect(COLORS.secondary).toBe(STEEL);
    expect(COLORS.code).toStrictEqual({ keyword: RED });
  });

  it("draws the red palette for an application that names it", () => {
    expect(COLORS.hues).toStrictEqual({ red: RED });
  });

  it("leaves the error status to its canonical hue", () => {
    expect(COLORS.error).toBeUndefined();
  });
});
