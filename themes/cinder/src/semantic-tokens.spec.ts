import { describe, expect, it } from "vitest";

import { semanticTokens } from "#semantic-tokens.ts";

describe("semanticTokens", () => {
  it("writes the ash page in the slate and the slate page in the ash", () => {
    expect(semanticTokens.colors.bg.DEFAULT.value).toStrictEqual({
      _dark: "#303841",
      base: "#EEEEEE",
    });
    expect(semanticTokens.colors.fg.DEFAULT.value).toStrictEqual({
      _dark: "#EEEEEE",
      base: "#303841",
    });
  });

  it("draws the panel on the steel in dark mode", () => {
    expect(semanticTokens.colors.bg.panel.value).toStrictEqual({
      _dark: "#3A4750",
      base: "oklch(97.9% 0.0000 0.0)",
    });
  });

  it("draws the red palette the primary and the accent point at from the red", () => {
    expect(semanticTokens.colors.primary.solid.DEFAULT.value).toBe("{colors.red.solid}");
    expect(semanticTokens.colors.accent.solid.DEFAULT.value).toBe("{colors.red.solid}");
    expect(semanticTokens.colors.red.solid.DEFAULT.value).toStrictEqual({
      _dark: "#D72323",
      base: "#D72323",
    });
  });

  it("draws the grey palette from the steel by day and the ash after dark", () => {
    expect(semanticTokens.colors.secondary.solid.DEFAULT.value).toBe("{colors.gray.solid}");
    expect(semanticTokens.colors.neutral.solid.DEFAULT.value).toBe("{colors.gray.solid}");
    expect(semanticTokens.colors.gray.solid.DEFAULT.value).toStrictEqual({
      _dark: "#EEEEEE",
      base: "#3A4750",
    });
  });

  it("sets the text on the red in the ash", () => {
    expect(semanticTokens.colors.red.contrast.value).toStrictEqual({
      _dark: "#EEEEEE",
      base: "#EEEEEE",
    });
  });

  it("draws every other palette from the foundation's hue over the pages", () => {
    expect(semanticTokens.colors.blue.solid.DEFAULT.value).toStrictEqual({
      _dark: "oklch(72.0% 0.1316 262.0)",
      base: "oklch(47.0% 0.1372 262.0)",
    });
    expect(semanticTokens.colors.blue.subtle.value).toStrictEqual({
      _dark: "oklch(39.8% 0.0371 257.4)",
      base: "oklch(87.2% 0.0220 262.0)",
    });
  });

  it("draws sharp corners from a quarter rem", () => {
    expect(semanticTokens.radii?.["l3"]).toStrictEqual({ value: "0.25rem" });
  });

  it("casts every shadow hard in the slate's hue", () => {
    expect(semanticTokens.shadows?.["xs"]).toStrictEqual({
      value: {
        _dark: "0 1px 2px oklch(0% 0.02 251 / 0.225)",
        base: "0 1px 2px oklch(20% 0.02 251 / 0.075)",
      },
    });
  });
});
