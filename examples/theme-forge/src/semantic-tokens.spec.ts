import { describe, expect, it } from "vitest";

import { semanticTokens } from "#semantic-tokens.ts";

describe("semanticTokens", () => {
  it("points the primary palette at the amber ramp", () => {
    expect(semanticTokens.colors.primary.solid.DEFAULT.value).toBe("{colors.orange.solid}");
  });

  it("points warnings at the yellow ramp to stay apart from the brand", () => {
    expect(semanticTokens.colors.warning.solid.DEFAULT.value).toBe("{colors.yellow.solid}");
  });

  it("places the page on cream in light mode", () => {
    expect(semanticTokens.colors.bg.DEFAULT.value).toStrictEqual({
      _dark: "oklch(14.0% 0.0200 75.0)",
      base: "oklch(96.0% 0.0200 75.0)",
    });
  });

  it("casts every shadow at half the default ink", () => {
    expect(semanticTokens.shadows?.["xs"]).toStrictEqual({
      value: "0 1px 2px light-dark(oklch(20% 0.02 70 / 0.025), oklch(0% 0.02 70 / 0.075))",
    });
  });
});
