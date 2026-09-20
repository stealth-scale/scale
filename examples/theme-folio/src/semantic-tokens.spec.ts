import { describe, expect, it } from "vitest";

import { semanticTokens } from "#semantic-tokens.ts";

describe("semanticTokens", () => {
  it("points the primary palette at the violet ramp", () => {
    expect(semanticTokens.colors.primary.solid.DEFAULT.value).toBe("{colors.purple.solid}");
  });

  it("places the page nearer white and nearer black than the foundation", () => {
    expect(semanticTokens.colors.bg.DEFAULT.value).toStrictEqual({
      _dark: "oklch(9.0% 0.0100 300.0)",
      base: "oklch(98.0% 0.0100 300.0)",
    });
  });

  it("leaves the corners to the foundation", () => {
    expect(semanticTokens.radii).toBeUndefined();
  });

  it("casts every shadow half again as dark as the default", () => {
    expect(semanticTokens.shadows?.["xs"]).toStrictEqual({
      value: "0 1px 2px light-dark(oklch(20% 0.02 295 / 0.075), oklch(0% 0.02 295 / 0.225))",
    });
  });
});
