import { describe, expect, it } from "vitest";

import { semanticTokens } from "#semantic-tokens.ts";

describe("semanticTokens", () => {
  it("writes the mist page in the navy and the navy page in the mist", () => {
    expect(semanticTokens.colors.bg.DEFAULT.value).toStrictEqual({
      _dark: "#1B3C53",
      base: "#E3E3E3",
    });
    expect(semanticTokens.colors.fg.DEFAULT.value).toStrictEqual({
      _dark: "#E3E3E3",
      base: "#1B3C53",
    });
  });

  it("draws the panel on the deep blue in dark mode", () => {
    expect(semanticTokens.colors.bg.panel.value).toMatchObject({ _dark: "#234C6A" });
  });

  it("draws the primary from the steel blue by day and from the mist after dark", () => {
    expect(semanticTokens.colors.primary.solid.DEFAULT.value).toBe("{colors.blue.solid}");
    expect(semanticTokens.colors.blue.solid.DEFAULT.value).toStrictEqual({
      _dark: "#E3E3E3",
      base: "#456882",
    });
    expect(semanticTokens.colors.blue.contrast.value).toStrictEqual({
      _dark: "#1B3C53",
      base: "#E3E3E3",
    });
  });

  it("draws the secondary and the accent from the deep blue by day and the steel blue after dark", () => {
    expect(semanticTokens.colors.secondary.solid.DEFAULT.value).toBe("{colors.indigo.solid}");
    expect(semanticTokens.colors.accent.solid.DEFAULT.value).toBe("{colors.indigo.solid}");
    expect(semanticTokens.colors.indigo.solid.DEFAULT.value).toStrictEqual({
      _dark: "#456882",
      base: "#234C6A",
    });
  });

  it("draws the corners from three eighths of a rem", () => {
    expect(semanticTokens.radii?.["l3"]).toStrictEqual({ value: "0.375rem" });
  });

  it("casts every shadow in the navy's hue", () => {
    expect(semanticTokens.shadows?.["xs"]).toStrictEqual({
      value: "0 1px 2px light-dark(oklch(20% 0.02 241 / 0.050), oklch(0% 0.02 241 / 0.150))",
    });
  });
});
