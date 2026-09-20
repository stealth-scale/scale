import { describe, expect, it } from "vitest";

import { semanticTokens } from "#semantic-tokens.ts";

describe("semanticTokens", () => {
  it("writes the palest coral in the navy and the navy in a pale coral", () => {
    expect(semanticTokens.colors.bg.DEFAULT.value).toStrictEqual({
      _dark: "#355C7D",
      base: "oklch(97.5% 0.0120 16.0)",
    });
    expect(semanticTokens.colors.fg.DEFAULT.value).toStrictEqual({
      _dark: "oklch(96.0% 0.0200 16.0)",
      base: "#355C7D",
    });
  });

  it("draws the panel on the plum in dark mode", () => {
    expect(semanticTokens.colors.bg.panel.value).toMatchObject({ _dark: "#6C5B7B" });
  });

  it("draws the three palettes from the coral and the mauve and the plum", () => {
    expect(semanticTokens.colors.primary.solid.DEFAULT.value).toBe("{colors.red.solid}");
    expect(semanticTokens.colors.secondary.solid.DEFAULT.value).toBe("{colors.pink.solid}");
    expect(semanticTokens.colors.accent.solid.DEFAULT.value).toBe("{colors.purple.solid}");
    expect(semanticTokens.colors.red.solid.DEFAULT.value).toStrictEqual({
      _dark: "#F67280",
      base: "#F67280",
    });
    expect(semanticTokens.colors.pink.solid.DEFAULT.value).toStrictEqual({
      _dark: "#C06C84",
      base: "#C06C84",
    });
    expect(semanticTokens.colors.purple.solid.DEFAULT.value).toStrictEqual({
      _dark: "oklch(96.0% 0.0200 16.0)",
      base: "#6C5B7B",
    });
  });

  it("draws soft corners from three quarters of a rem", () => {
    expect(semanticTokens.radii?.["l3"]).toStrictEqual({ value: "0.75rem" });
  });

  it("casts every shadow in the navy's hue", () => {
    expect(semanticTokens.shadows?.["xs"]).toStrictEqual({
      value: "0 1px 2px light-dark(oklch(20% 0.02 246 / 0.050), oklch(0% 0.02 246 / 0.150))",
    });
  });
});
