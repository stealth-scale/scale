import { describe, expect, it } from "vitest";

import { centred, glyph, reserved, rowed, trailing, tucked } from "#nav-list/metrics.ts";

describe("glyph", () => {
  it("returns the icon box one step below the row size", () => {
    expect(glyph("md")).toBe("calc({sizes.icon.sm} * var(--density, 1))");
  });
});

describe("rowed", () => {
  it("sizes a leading svg to the icon box", () => {
    expect(rowed("lg")).toMatchObject({
      "& > svg": { boxSize: "calc({sizes.icon.md} * var(--density, 1))", flexShrink: "0" },
    });
  });

  it("keeps the row at least 24px tall at any density", () => {
    expect(rowed("sm")).toMatchObject({
      blockSize: "max({sizes.6}, calc({sizes.tag.xl} * var(--density, 1)))",
    });
  });
});

describe("trailing", () => {
  it("sets a minimum width instead of a width so a long count can extend the square", () => {
    expect(trailing("md")).toMatchObject({
      blockSize: "calc({sizes.tag.sm} * var(--density, 1))",
      minInlineSize: "calc({sizes.tag.sm} * var(--density, 1))",
    });
  });
});

describe("tucked", () => {
  it("returns an end margin equal to the row inset", () => {
    expect(tucked("md")).toStrictEqual({
      marginInlineEnd: "calc({spacing.inset.sm} * var(--density, 1))",
    });
  });
});

describe("reserved", () => {
  it("sums the inset with the gap and the square", () => {
    expect(reserved("md")).toBe(
      "calc(calc({spacing.inset.sm} * var(--density, 1)) + calc({spacing.gap.sm} * var(--density, 1)) + calc({sizes.tag.sm} * var(--density, 1)))",
    );
  });
});

describe("centred", () => {
  it("adds half the icon to the inset less half the hairline", () => {
    expect(centred("md")).toBe(
      "calc(calc({spacing.inset.sm} * var(--density, 1)) + calc({sizes.icon.sm} * var(--density, 1)) / 2 - {borderWidths.hairline} / 2)",
    );
  });
});
