import { describe, expect, it } from "vitest";

import { CHROMA, COLORS, DEEP, MIST, NAVY, RATIOS, STEEL } from "#colors.ts";

describe("colors", () => {
  it("writes the mist in the navy and the navy in the mist", () => {
    expect(COLORS.light).toStrictEqual({ ink: NAVY, page: MIST });
    expect(COLORS.dark).toStrictEqual({ ink: MIST, page: NAVY });
  });

  it("draws the primary from the steel blue and the secondary and the accent from the deep blue", () => {
    expect(COLORS.primary).toBe(STEEL);
    expect(COLORS.secondary).toBe(DEEP);
    expect(COLORS.accent).toBe(DEEP);
  });

  it("leaves the information status to its canonical hue", () => {
    expect(COLORS.info).toBeUndefined();
  });

  it("draws to the text ratio three distinct wells leave the navy on the mist", () => {
    expect(COLORS.ratios).toBe(RATIOS);
    expect(RATIOS).toStrictEqual({ text: 6 });
  });

  it("keeps three quarters of the page's chroma on every raised surface and well", () => {
    expect(COLORS.chroma).toBe(CHROMA);
    expect(CHROMA).toBe(0.75);
  });
});
