import { describe, expect, it } from "vitest";

import { COLORS, INK, NAVY, ORANGE, PAGE, RED, YELLOW } from "#colors.ts";

describe("colors", () => {
  it("writes the cream in the navy and the navy in a pale yellow", () => {
    expect(COLORS.light).toStrictEqual({ ink: NAVY, page: PAGE });
    expect(COLORS.dark).toStrictEqual({ ink: INK, page: NAVY });
  });

  it("draws the primary from the red and the secondary from the orange and the accent from the yellow", () => {
    expect(COLORS.primary).toBe(RED);
    expect(COLORS.secondary).toBe(ORANGE);
    expect(COLORS.accent).toBe(YELLOW);
  });

  it("leaves every status to its canonical hue", () => {
    expect(COLORS.error).toBeUndefined();
    expect(COLORS.warning).toBeUndefined();
  });
});
