import { describe, expect, it } from "vitest";

import { foundationTheme, paletteTheme } from "#theme.fixtures.ts";

describe("fixtures", () => {
  it("returns a theme named foundation with tokens and semanticTokens on the variant", () => {
    const theme = foundationTheme();

    expect(theme.name).toBe("foundation");
    expect(theme.variant.tokens).toBeDefined();
    expect(theme.variant.semanticTokens).toBeDefined();
  });

  it("derives the palette's solid and its ramp from the foundation's blue", () => {
    const theme = paletteTheme();

    expect(theme.variant.semanticTokens?.colors?.["primary"]).toMatchObject({
      solid: { DEFAULT: { value: { base: "oklch(47.0% 0.1372 262.0)" } } },
    });
    expect(theme.variant.tokens?.colors?.["primary"]).toHaveProperty("500");
  });

  it("replaces a derived role with the value passed in over", () => {
    const theme = paletteTheme({ solid: { value: "x" } });

    expect(theme.variant.semanticTokens?.colors?.["primary"]).toMatchObject({
      solid: { value: "x" },
    });
  });
});
