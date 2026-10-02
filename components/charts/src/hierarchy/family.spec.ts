import { describe, expect, it } from "vitest";

import { mixOf, shareOf } from "#hierarchy/family.ts";

describe("family", () => {
  it("gives the largest sibling the whole color", () => {
    expect(shareOf(0, 3)).toBe(100);
  });

  it("gives the smallest sibling 45% of the color", () => {
    expect(shareOf(2, 3)).toBe(45);
  });

  it("steps the share evenly between the largest sibling and the smallest", () => {
    expect([0, 1, 2, 3].map((at) => Math.round(shareOf(at, 4)))).toStrictEqual([100, 82, 63, 45]);
  });

  it("gives an only child the whole color", () => {
    expect(shareOf(0, 1)).toBe(100);
  });

  it("mixes a color over the panel at a share", () => {
    expect(mixOf("var(--x)", 72.5)).toBe(
      "color-mix(in oklab, var(--x) 73%, var(--colors-bg-panel))",
    );
  });
});
