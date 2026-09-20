import { describe, expect, it } from "vitest";

import {
  CHROMA,
  COLORS,
  CORAL,
  INK,
  MAUVE,
  NAVY,
  NIGHT,
  OCHRE,
  PAGE,
  PLUM,
  SAGE,
  SLATE,
} from "#colors.ts";

describe("colors", () => {
  it("writes the palest coral in the night and the night in a pale coral", () => {
    expect(COLORS.light).toStrictEqual({ ink: NIGHT, page: PAGE });
    expect(COLORS.dark).toStrictEqual({ ink: INK, page: NIGHT });
  });

  it("takes the night down from the navy and keeps its hue", () => {
    expect(NIGHT).toBe("oklch(22.0% 0.0500 246.0)");
    expect(COLORS.hues).toMatchObject({ blue: NAVY });
  });

  it("draws the primary from the coral and the secondary from the mauve and the accent from the plum", () => {
    expect(COLORS.primary).toBe(CORAL);
    expect(COLORS.secondary).toBe(MAUVE);
    expect(COLORS.accent).toBe(PLUM);
  });

  it("draws to the foundation's own ratios and states none of its own", () => {
    expect(COLORS.ratios).toBeUndefined();
  });

  it("keeps four fifths of the page's chroma on every raised surface and well", () => {
    expect(COLORS.chroma).toBe(CHROMA);
    expect(CHROMA).toBe(0.8);
  });

  it("dusts three statuses to its own register and leaves the error to the engine", () => {
    expect(COLORS.warning).toBe(OCHRE);
    expect(COLORS.success).toBe(SAGE);
    expect(COLORS.info).toBe(SLATE);
    expect(COLORS.error).toBeUndefined();
  });
});
