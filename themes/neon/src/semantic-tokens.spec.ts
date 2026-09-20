import { describe, expect, it } from "vitest";

import { semanticTokens } from "#semantic-tokens.ts";

describe("semanticTokens", () => {
  it("writes the palest violet in the grape and the grape in a pale yellow", () => {
    expect(semanticTokens.colors.bg.DEFAULT.value).toStrictEqual({
      _dark: "#450693",
      base: "oklch(97.5% 0.0200 298.0)",
    });
    expect(semanticTokens.colors.fg.DEFAULT.value).toStrictEqual({
      _dark: "oklch(95.0% 0.0400 87.0)",
      base: "#450693",
    });
  });

  it("draws the three palettes from the violet and the pink and the yellow", () => {
    expect(semanticTokens.colors.primary.solid.DEFAULT.value).toBe("{colors.purple.solid}");
    expect(semanticTokens.colors.secondary.solid.DEFAULT.value).toBe("{colors.pink.solid}");
    expect(semanticTokens.colors.accent.solid.DEFAULT.value).toBe("{colors.yellow.solid}");
    expect(semanticTokens.colors.purple.solid.DEFAULT.value).toStrictEqual({
      _dark: "#8C00FF",
      base: "#8C00FF",
    });
    expect(semanticTokens.colors.pink.solid.DEFAULT.value).toStrictEqual({
      _dark: "#FF3F7F",
      base: "#FF3F7F",
    });
    expect(semanticTokens.colors.yellow.solid.DEFAULT.value).toStrictEqual({
      _dark: "#FFC400",
      base: "#FFC400",
    });
  });

  it("sets the text on the yellow in the grape", () => {
    expect(semanticTokens.colors.yellow.contrast.value).toStrictEqual({
      _dark: "#450693",
      base: "#450693",
    });
  });

  it("draws soft corners from three quarters of a rem", () => {
    expect(semanticTokens.radii?.["l3"]).toStrictEqual({ value: "0.75rem" });
  });

  it("casts every shadow in the grape's hue", () => {
    expect(semanticTokens.shadows?.["xs"]).toStrictEqual({
      value: "0 1px 2px light-dark(oklch(20% 0.02 292 / 0.050), oklch(0% 0.02 292 / 0.150))",
    });
  });
});
