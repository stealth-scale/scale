import { describe, expect, it } from "vitest";

import { semanticTokens } from "#semantic-tokens.ts";

describe("semanticTokens", () => {
  it("writes the palest navy in the navy and the navy in a pale teal", () => {
    expect(semanticTokens.colors.bg.DEFAULT.value).toStrictEqual({
      _dark: "#132440",
      base: "oklch(97.5% 0.0080 260.0)",
    });
    expect(semanticTokens.colors.fg.DEFAULT.value).toStrictEqual({
      _dark: "oklch(94.0% 0.0300 195.0)",
      base: "#132440",
    });
  });

  it("draws the panel on the deep blue in dark mode", () => {
    expect(semanticTokens.colors.bg.panel.value).toMatchObject({ _dark: "#16476A" });
  });

  it("draws the three palettes from the crimson and the deep blue and the teal", () => {
    expect(semanticTokens.colors.primary.solid.DEFAULT.value).toBe("{colors.red.solid}");
    expect(semanticTokens.colors.secondary.solid.DEFAULT.value).toBe("{colors.blue.solid}");
    expect(semanticTokens.colors.accent.solid.DEFAULT.value).toBe("{colors.teal.solid}");
    expect(semanticTokens.colors.red.solid.DEFAULT.value).toStrictEqual({
      _dark: "#BF092F",
      base: "#BF092F",
    });
    expect(semanticTokens.colors.blue.solid.DEFAULT.value).toStrictEqual({
      _dark: "oklch(94.0% 0.0300 195.0)",
      base: "#16476A",
    });
    expect(semanticTokens.colors.teal.solid.DEFAULT.value).toStrictEqual({
      _dark: "#3B9797",
      base: "#3B9797",
    });
  });

  it("points the errors at the crimson", () => {
    expect(semanticTokens.colors.error.solid.DEFAULT.value).toBe("{colors.red.solid}");
  });

  it("draws sharp corners from a quarter rem", () => {
    expect(semanticTokens.radii?.["l3"]).toStrictEqual({ value: "0.25rem" });
  });

  it("casts every shadow in the navy's hue", () => {
    expect(semanticTokens.shadows?.["xs"]).toStrictEqual({
      value: {
        _dark: "0 1px 2px oklch(0% 0.02 260 / 0.150)",
        base: "0 1px 2px oklch(20% 0.02 260 / 0.050)",
      },
    });
  });
});
