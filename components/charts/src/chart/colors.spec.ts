import { describe, expect, it } from "vitest";

import { SERIES } from "@stealthscale/theme/authoring";

import { colorAt, colorOf, inkedOf, SERIES_COLORS } from "#chart/colors.ts";

describe("colors", () => {
  it("counts as many series colors as the theme's series family", () => {
    expect(SERIES_COLORS).toBe(SERIES.length);
  });

  it("returns the chart role of the palette a series states", () => {
    expect(colorAt("error", 0)).toBe("var(--colors-error-chart)");
  });

  it.each([
    { index: 0, want: "var(--colors-series-1)" },
    { index: 1, want: "var(--colors-series-2)" },
    { index: 7, want: "var(--colors-series-8)" },
    { index: 8, want: "var(--colors-series-1)" },
  ])("returns $want for the series at $index without a color", ({ index, want }) => {
    expect(colorAt(undefined, index)).toBe(want);
  });

  it("returns the chart role's custom property of a palette", () => {
    expect(colorOf("teal")).toBe("var(--colors-teal-chart)");
  });

  it("returns the custom property of the series color a name states", () => {
    expect(colorOf("series.3")).toBe("var(--colors-series-3)");
  });

  it("returns the series color a series names at any position", () => {
    expect(colorAt("series.1", 4)).toBe("var(--colors-series-1)");
  });

  it("mixes a color towards the ink by a share", () => {
    expect(inkedOf("var(--colors-series-1)", 40)).toBe(
      "color-mix(in oklab, var(--colors-fg) 40%, var(--colors-series-1))",
    );
  });

  it.each([
    { label: "without a share", share: undefined },
    { label: "at a share of 0", share: 0 },
    { label: "at a share under 0", share: -5 },
  ])("returns the color itself $label", ({ share }) => {
    expect(inkedOf("var(--colors-series-1)", share)).toBe("var(--colors-series-1)");
  });

  it("mixes in the whole ink at a share over 100", () => {
    expect(inkedOf("var(--colors-series-1)", 140)).toBe(
      "color-mix(in oklab, var(--colors-fg) 100%, var(--colors-series-1))",
    );
  });
});
