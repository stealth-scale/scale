import { describe, expect, it } from "vitest";

import {
  centred,
  glyph,
  inset,
  lighter,
  reserved,
  rowed,
  trailing,
  tucked,
} from "#nav-list/metrics.ts";

describe("glyph", () => {
  it("returns the icon box one step below the row size", () => {
    expect(glyph("md")).toBe("calc({sizes.icon.sm} * var(--density, 1))");
  });
});

describe("lighter", () => {
  it.each([
    { give: "lg", want: "sm" },
    { give: "md", want: "xs" },
    { give: "sm", want: "xs" },
  ] as const)("returns $want for a $give row", ({ give, want }) => {
    expect(lighter(give)).toBe(want);
  });
});

describe("inset", () => {
  it("returns the inset two steps below the row size", () => {
    expect(inset("md")).toBe("calc({spacing.inset.xs} * var(--density, 1))");
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
      blockSize: "max({sizes.6}, calc({sizes.tag.md} * var(--density, 1)))",
    });
  });

  it("sets the label the inset and the gap two steps below the row size", () => {
    expect(rowed("md")).toMatchObject({
      gap: "calc({spacing.gap.xs} * var(--density, 1))",
      paddingInline: "calc({spacing.inset.xs} * var(--density, 1))",
      textStyle: "label.xs",
    });
  });
});

describe("trailing", () => {
  it("sets a minimum width instead of a width so a long count can extend the square", () => {
    expect(trailing("md")).toMatchObject({
      minInlineSize: "max({sizes.6}, calc({sizes.tag.sm} * var(--density, 1)))",
    });
  });

  it("keeps the square at least 24px tall at any density", () => {
    expect(trailing("sm")).toMatchObject({
      blockSize: "max({sizes.6}, calc({sizes.tag.xs} * var(--density, 1)))",
    });
  });
});

describe("tucked", () => {
  it("returns an end margin equal to the row inset", () => {
    expect(tucked("md")).toStrictEqual({
      marginInlineEnd: "calc({spacing.inset.xs} * var(--density, 1))",
    });
  });
});

describe("reserved", () => {
  it("sums the inset with the gap and the square", () => {
    expect(reserved("md")).toBe(
      "calc(calc({spacing.inset.xs} * var(--density, 1)) + calc({spacing.gap.xs} * var(--density, 1)) + max({sizes.6}, calc({sizes.tag.sm} * var(--density, 1))))",
    );
  });
});

describe("centred", () => {
  it("adds half the icon to the inset less half the hairline", () => {
    expect(centred("md")).toBe(
      "calc(calc({spacing.inset.xs} * var(--density, 1)) + calc({sizes.icon.sm} * var(--density, 1)) / 2 - {borderWidths.hairline} / 2)",
    );
  });
});
