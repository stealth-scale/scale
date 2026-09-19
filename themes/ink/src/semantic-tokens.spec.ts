import { describe, expect, it } from "vitest";

import { semanticTokens } from "#semantic-tokens.ts";

describe("semanticTokens", () => {
  it("writes the paper in the charcoal and the night in the chalk", () => {
    expect(semanticTokens.colors.bg.DEFAULT.value).toStrictEqual({
      _dark: "oklch(13.0% 0.0060 262.0)",
      base: "oklch(97.0% 0.0060 262.0)",
    });
    expect(semanticTokens.colors.fg.DEFAULT.value).toStrictEqual({
      _dark: "oklch(97.0% 0.0075 262.0)",
      base: "oklch(18.0% 0.0076 262.0)",
    });
  });

  it("draws the grey solid from the charcoal by day and from white after dark", () => {
    expect(semanticTokens.colors.primary.solid.DEFAULT.value).toBe("{colors.gray.solid}");
    expect(semanticTokens.colors.neutral.solid.DEFAULT.value).toBe("{colors.gray.solid}");
    expect(semanticTokens.colors.gray.solid.DEFAULT.value).toStrictEqual({
      _dark: "#FFFFFF",
      base: "oklch(27.0% 0.0077 262.0)",
    });
    expect(semanticTokens.colors.gray.contrast.value).toStrictEqual({
      _dark: "oklch(13.0% 0.0060 262.0)",
      base: "oklch(97.0% 0.0060 262.0)",
    });
  });

  it("takes the grey palette's fills and lines and inks from the page's own families", () => {
    expect(semanticTokens.colors.gray.subtle.value).toStrictEqual({
      _dark: "{colors.bg.subtle}",
      base: "{colors.bg.subtle}",
    });
    expect(semanticTokens.colors.gray.border.DEFAULT.value).toStrictEqual({
      _dark: "{colors.border}",
      base: "{colors.border}",
    });
    expect(semanticTokens.colors.gray.fg.muted.value).toStrictEqual({
      _dark: "{colors.fg.muted}",
      base: "{colors.fg.muted}",
    });
  });

  it("fades the grey palette's own ink a little from the page's", () => {
    expect(semanticTokens.colors.gray.fg.DEFAULT.value).toStrictEqual({
      _dark: "oklch(87.8% 0.0073 262.0)",
      base: "oklch(33.8% 0.0073 262.0)",
    });
  });

  it("draws the blue palette the secondary and the accent point at from one blue", () => {
    expect(semanticTokens.colors.accent.solid.DEFAULT.value).toBe("{colors.blue.solid}");
    expect(semanticTokens.colors.secondary.solid.DEFAULT.value).toBe("{colors.blue.solid}");
    expect(semanticTokens.colors.blue.solid.DEFAULT.value).toStrictEqual({
      _dark: "#2563EB",
      base: "#2563EB",
    });
  });

  it("leaves the corners and the shadows to the foundation", () => {
    expect(semanticTokens.radii).toBeUndefined();
    expect(semanticTokens.shadows).toBeUndefined();
  });
});
