import { describe, expect, it } from "vitest";

import {
  ACID,
  AMBER,
  CHROMA,
  COLORS,
  CYAN,
  GRAPE,
  INK,
  PAGE,
  PINK,
  ROSE,
  VIOLET,
  YELLOW,
} from "#colors.ts";

describe("colors", () => {
  it("writes the palest violet in the grape and the grape in a pale yellow", () => {
    expect(COLORS.light).toStrictEqual({ ink: GRAPE, page: PAGE });
    expect(COLORS.dark).toStrictEqual({ ink: INK, page: GRAPE });
  });

  it("draws the primary from the violet and the secondary from the pink and the accent from the yellow", () => {
    expect(COLORS.primary).toBe(VIOLET);
    expect(COLORS.secondary).toBe(PINK);
    expect(COLORS.accent).toBe(YELLOW);
  });

  it("keeps half the grape's chroma on every raised surface and well", () => {
    expect(COLORS.chroma).toBe(CHROMA);
    expect(CHROMA).toBe(0.5);
  });

  it("draws every status in the theme's own fluorescent colors", () => {
    expect(COLORS.error).toBe(ROSE);
    expect(COLORS.info).toBe(CYAN);
    expect(COLORS.success).toBe(ACID);
    expect(COLORS.warning).toBe(AMBER);
  });
});
