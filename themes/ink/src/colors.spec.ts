import { describe, expect, it } from "vitest";

import { PAGES } from "@stealthscale/theme/authoring";

import { BLUE, CHARCOAL, COLORS, GREY, NIGHT, PAPER } from "#colors.ts";

describe("colors", () => {
  it("sits on the foundation's own pages", () => {
    expect(PAPER).toBe(PAGES.light);
    expect(NIGHT).toBe(PAGES.dark);
  });

  it("writes the paper in the charcoal and the night in the paper", () => {
    expect(COLORS.light).toStrictEqual({ ink: CHARCOAL, page: PAPER });
    expect(COLORS.dark).toStrictEqual({ ink: PAPER, page: NIGHT });
  });

  it("draws the primary from a grey and the accent and the secondary from the blue", () => {
    expect(COLORS.primary).toBe(GREY);
    expect(COLORS.accent).toBe(BLUE);
    expect(COLORS.secondary).toBe(BLUE);
    expect(COLORS.code).toStrictEqual({ keyword: BLUE });
  });
});
