import { describe, expect, it } from "vitest";

import { CHROMA, COLORS, NAVY, PEARL, PETAL, PINK } from "#colors.ts";

describe("colors", () => {
  it("writes the pearl in the navy and the navy in the petal", () => {
    expect(COLORS.light).toStrictEqual({ ink: NAVY, page: PEARL });
    expect(COLORS.dark).toStrictEqual({ ink: PETAL, page: NAVY });
  });

  it("draws the primary from the pink and the secondary from the ink of each mode", () => {
    expect(COLORS.primary).toBe(PINK);
    expect(COLORS.secondary).toStrictEqual({ dark: PETAL, light: NAVY });
    expect(COLORS.code).toStrictEqual({ keyword: PINK, tag: PETAL });
  });

  it("keeps seven tenths of the navy's chroma on every raised surface and well", () => {
    expect(COLORS.chroma).toBe(CHROMA);
    expect(CHROMA).toBe(0.7);
  });
});
