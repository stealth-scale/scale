import { describe, expect, it } from "vitest";

import { CHROMA, COLORS, GREEN, NIGHT, PAGE, RATIOS, SAGE, TEAL } from "#colors.ts";

describe("colors", () => {
  it("writes the palest sage in the night and the night in the sage", () => {
    expect(COLORS.light).toStrictEqual({ ink: NIGHT, page: PAGE });
    expect(COLORS.dark).toStrictEqual({ ink: SAGE, page: NIGHT });
  });

  it("draws the primary from the green and the secondary from the teal and the accent from the sage", () => {
    expect(COLORS.primary).toBe(GREEN);
    expect(COLORS.secondary).toBe(TEAL);
    expect(COLORS.accent).toBe(SAGE);
  });

  it("leaves the success status to its canonical hue", () => {
    expect(COLORS.success).toBeUndefined();
  });

  it("draws its secondary ink to the ratio the sage reaches on the night", () => {
    expect(COLORS.ratios).toBe(RATIOS);
    expect(RATIOS).toStrictEqual({ text: 5.5 });
  });

  it("keeps seven tenths of the page's chroma on every raised surface and well", () => {
    expect(COLORS.chroma).toBe(CHROMA);
    expect(CHROMA).toBe(0.7);
  });
});
