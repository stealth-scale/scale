import { describe, expect, it } from "vitest";

import { semanticTokens } from "#semantic-tokens.ts";

describe("semanticTokens", () => {
  it("writes the pearl page in the navy and the navy page in the petal", () => {
    expect(semanticTokens.colors.bg.DEFAULT.value).toStrictEqual({
      _dark: "#021A54",
      base: "#F5F5F5",
    });
    expect(semanticTokens.colors.fg.DEFAULT.value).toStrictEqual({
      _dark: "#FFCEE3",
      base: "#021A54",
    });
  });

  it("draws the pink palette the primary and the accent point at from the pink", () => {
    expect(semanticTokens.colors.primary.solid.DEFAULT.value).toBe("{colors.pink.solid}");
    expect(semanticTokens.colors.accent.solid.DEFAULT.value).toBe("{colors.pink.solid}");
    expect(semanticTokens.colors.pink.solid.DEFAULT.value).toStrictEqual({
      _dark: "#FF85BB",
      base: "#FF85BB",
    });
  });

  it("sets the text on the pink in the navy", () => {
    expect(semanticTokens.colors.pink.contrast.value).toStrictEqual({
      _dark: "#021A54",
      base: "#021A54",
    });
  });

  it("fills the pink's muted fill with the petal in light mode", () => {
    const { _dark: dusk, base } = semanticTokens.colors.pink.muted.value;

    expect(base).toBe("#FFCEE3");
    expect(dusk).toMatch(/^oklch\(/u);
  });

  it("points the secondary at the grey", () => {
    expect(semanticTokens.colors.secondary.solid.DEFAULT.value).toBe("{colors.gray.solid}");
  });

  it("draws round corners from one rem", () => {
    expect(semanticTokens.radii?.["l3"]).toStrictEqual({ value: "1rem" });
  });

  it("casts every shadow in the navy's hue", () => {
    expect(semanticTokens.shadows?.["xs"]).toStrictEqual({
      value: {
        _dark: "0 1px 2px oklch(0% 0.02 263 / 0.150)",
        base: "0 1px 2px oklch(20% 0.02 263 / 0.050)",
      },
    });
  });
});
