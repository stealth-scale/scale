import { describe, expect, it } from "vitest";

import { semanticTokens } from "#semantic-tokens.ts";

describe("semanticTokens", () => {
  it("writes the chalk page in the navy and the navy page in the chalk", () => {
    expect(semanticTokens.colors.bg.DEFAULT.value).toStrictEqual({
      _dark: "#0C2B4E",
      base: "#F4F4F4",
    });
    expect(semanticTokens.colors.fg.DEFAULT.value).toStrictEqual({
      _dark: "#F4F4F4",
      base: "#0C2B4E",
    });
  });

  it("draws the panel on the blue in dark mode", () => {
    expect(semanticTokens.colors.bg.panel.value).toMatchObject({ _dark: "#1A3D64" });
  });

  it("draws the primary from the teal blue by day and from the chalk after dark", () => {
    expect(semanticTokens.colors.primary.solid.DEFAULT.value).toBe("{colors.cyan.solid}");
    expect(semanticTokens.colors.cyan.solid.DEFAULT.value).toStrictEqual({
      _dark: "#F4F4F4",
      base: "#1D546C",
    });
    expect(semanticTokens.colors.cyan.contrast.value).toStrictEqual({
      _dark: "#0C2B4E",
      base: "#F4F4F4",
    });
  });

  it("draws the secondary and the accent from the blue by day and the teal blue after dark", () => {
    expect(semanticTokens.colors.secondary.solid.DEFAULT.value).toBe("{colors.blue.solid}");
    expect(semanticTokens.colors.accent.solid.DEFAULT.value).toBe("{colors.blue.solid}");
    expect(semanticTokens.colors.blue.solid.DEFAULT.value).toStrictEqual({
      _dark: "#1D546C",
      base: "#1A3D64",
    });
  });

  it("draws the corners from half a rem", () => {
    expect(semanticTokens.radii?.["l3"]).toStrictEqual({ value: "0.5rem" });
  });

  it("casts every shadow in the navy's hue", () => {
    expect(semanticTokens.shadows?.["xs"]).toStrictEqual({
      value: {
        _dark: "0 1px 2px oklch(0% 0.02 254 / 0.150)",
        base: "0 1px 2px oklch(20% 0.02 254 / 0.050)",
      },
    });
  });
});
