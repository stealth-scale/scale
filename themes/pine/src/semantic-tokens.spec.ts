import { describe, expect, it } from "vitest";

import { semanticTokens } from "#semantic-tokens.ts";

describe("semanticTokens", () => {
  it("writes the palest sage in the night and the night in the sage", () => {
    expect(semanticTokens.colors.bg.DEFAULT.value).toStrictEqual({
      _dark: "#092328",
      base: "oklch(97.0% 0.0150 149.0)",
    });
    expect(semanticTokens.colors.fg.DEFAULT.value).toStrictEqual({
      _dark: "#8BBB92",
      base: "#092328",
    });
  });

  it("draws the three palettes from the green and the teal and the sage", () => {
    expect(semanticTokens.colors.primary.solid.DEFAULT.value).toBe("{colors.teal.solid}");
    expect(semanticTokens.colors.secondary.solid.DEFAULT.value).toBe("{colors.cyan.solid}");
    expect(semanticTokens.colors.accent.solid.DEFAULT.value).toBe("{colors.green.solid}");
    expect(semanticTokens.colors.teal.solid.DEFAULT.value).toStrictEqual({
      _dark: "#2A835F",
      base: "#2A835F",
    });
    expect(semanticTokens.colors.cyan.solid.DEFAULT.value).toStrictEqual({
      _dark: "#12544F",
      base: "#12544F",
    });
    expect(semanticTokens.colors.green.solid.DEFAULT.value).toStrictEqual({
      _dark: "#8BBB92",
      base: "#8BBB92",
    });
  });

  it("sets the text on the sage in the night", () => {
    expect(semanticTokens.colors.green.contrast.value).toStrictEqual({
      _dark: "#092328",
      base: "#092328",
    });
  });

  it("points the successes at the sage", () => {
    expect(semanticTokens.colors.success.solid.DEFAULT.value).toBe("{colors.green.solid}");
  });

  it("draws the corners from half a rem", () => {
    expect(semanticTokens.radii?.["l3"]).toStrictEqual({ value: "0.5rem" });
  });

  it("casts every shadow in the night's hue", () => {
    expect(semanticTokens.shadows?.["xs"]).toStrictEqual({
      value: {
        _dark: "0 1px 2px oklch(0% 0.02 212 / 0.150)",
        base: "0 1px 2px oklch(20% 0.02 212 / 0.050)",
      },
    });
  });
});
