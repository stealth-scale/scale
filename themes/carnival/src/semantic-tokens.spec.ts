import { describe, expect, it } from "vitest";

import { semanticTokens } from "#semantic-tokens.ts";

describe("semanticTokens", () => {
  it("writes the cream in the navy and the navy in a pale yellow", () => {
    expect(semanticTokens.colors.bg.DEFAULT.value).toStrictEqual({
      _dark: "#2D4059",
      base: "oklch(97.5% 0.0200 89.0)",
    });
    expect(semanticTokens.colors.fg.DEFAULT.value).toStrictEqual({
      _dark: "oklch(95.0% 0.0400 89.0)",
      base: "#2D4059",
    });
  });

  it("draws the three palettes from the red and the orange and the yellow", () => {
    expect(semanticTokens.colors.primary.solid.DEFAULT.value).toBe("{colors.red.solid}");
    expect(semanticTokens.colors.secondary.solid.DEFAULT.value).toBe("{colors.orange.solid}");
    expect(semanticTokens.colors.accent.solid.DEFAULT.value).toBe("{colors.yellow.solid}");
    expect(semanticTokens.colors.red.solid.DEFAULT.value).toStrictEqual({
      _dark: "#EA5455",
      base: "#EA5455",
    });
    expect(semanticTokens.colors.orange.solid.DEFAULT.value).toStrictEqual({
      _dark: "#F07B3F",
      base: "#F07B3F",
    });
    expect(semanticTokens.colors.yellow.solid.DEFAULT.value).toStrictEqual({
      _dark: "#FFD460",
      base: "#FFD460",
    });
  });

  it("sets the text on the yellow in the navy", () => {
    expect(semanticTokens.colors.yellow.contrast.value).toStrictEqual({
      _dark: "#2D4059",
      base: "#2D4059",
    });
  });

  it("points the errors at the red and the warnings at the orange", () => {
    expect(semanticTokens.colors.error.solid.DEFAULT.value).toBe("{colors.red.solid}");
    expect(semanticTokens.colors.warning.solid.DEFAULT.value).toBe("{colors.orange.solid}");
  });

  it("draws the corners from half a rem", () => {
    expect(semanticTokens.radii?.["l3"]).toStrictEqual({ value: "0.5rem" });
  });

  it("casts every shadow in the navy's hue", () => {
    expect(semanticTokens.shadows?.["xs"]).toStrictEqual({
      value: "0 1px 2px light-dark(oklch(20% 0.02 256 / 0.050), oklch(0% 0.02 256 / 0.150))",
    });
  });
});
