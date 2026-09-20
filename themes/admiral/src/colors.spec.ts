import { describe, expect, it } from "vitest";

import { BLUE, CHALK, COLORS, NAVY, TEAL } from "#colors.ts";

describe("colors", () => {
  it("writes the chalk in the navy and the navy in the chalk with the blue as its panel", () => {
    expect(COLORS.light).toStrictEqual({ ink: NAVY, page: CHALK });
    expect(COLORS.dark).toStrictEqual({ ink: CHALK, page: NAVY, panel: BLUE });
  });

  it("draws the primary from the teal blue and the secondary and the accent from the blue", () => {
    expect(COLORS.primary).toBe(TEAL);
    expect(COLORS.secondary).toBe(BLUE);
    expect(COLORS.accent).toBe(BLUE);
  });

  it("leaves the information status to its canonical hue", () => {
    expect(COLORS.info).toBeUndefined();
  });
});
