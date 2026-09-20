import { describe, expect, it } from "vitest";

import { foundationTheme, paletteTheme } from "#theme.fixtures.ts";

describe("fixtures", () => {
  it("wraps the foundation with its tokens and semantic tokens as the variant", () => {
    const theme = foundationTheme();

    expect(theme.name).toBe("foundation");
    expect(theme.variant.tokens).toBeDefined();
    expect(theme.variant.semanticTokens).toBeDefined();
  });

  it("draws the palette from the foundation's blue over the foundation's pages", () => {
    const theme = paletteTheme();

    expect(theme.variant.semanticTokens?.colors?.["primary"]).toMatchObject({
      solid: { DEFAULT: { value: { base: "oklch(47.0% 0.1372 262.0)" } } },
    });
    expect(theme.variant.tokens?.colors?.["primary"]).toHaveProperty("500");
  });

  it("builds a palette theme with the roles it was handed put over the drawn ones", () => {
    const theme = paletteTheme({ solid: { value: "x" } });

    expect(theme.variant.semanticTokens?.colors?.["primary"]).toMatchObject({
      solid: { value: "x" },
    });
  });
});
