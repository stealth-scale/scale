import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { COLORS } from "#colors.ts";
import { fathom, COLORS as published } from "#index.ts";

describe("fathom", () => {
  it("keeps the theme contract and clears every pair in both modes", () => {
    expect(
      violations(fathom, { at: import.meta.dirname, base: foundation, recipes: {} }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(fathom.name).toBe("fathom");
  });

  it("names no font package", () => {
    expect(fathom.fonts).toStrictEqual([]);
  });

  it("extends no recipe", () => {
    expect(fathom.preset.theme?.extend?.recipes).toBeUndefined();
  });

  it("rounds the largest corner to one rem and casts every shadow in the neutral hue", () => {
    expect(fathom.variant.semanticTokens?.radii?.["l3"]).toStrictEqual({ value: "1rem" });
    expect(JSON.stringify(fathom.variant.semanticTokens?.shadows)).not.toMatch(/0\.02 (?!200 )/u);
  });

  it("publishes its colors for a theme built on it", () => {
    expect(published).toBe(COLORS);
  });
});
