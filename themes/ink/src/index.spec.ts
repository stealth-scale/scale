import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { ink } from "#index.ts";

describe("ink", () => {
  it("keeps the theme contract and clears every pair in both modes", () => {
    expect(
      violations(ink, { at: import.meta.dirname, base: foundation, recipes: {} }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(ink.name).toBe("ink");
  });

  it("names no font package", () => {
    expect(ink.fonts).toStrictEqual([]);
  });

  it("extends no recipe", () => {
    expect(ink.preset.theme?.extend?.recipes).toBeUndefined();
  });

  it("keeps the foundation's corners and shadows", () => {
    expect(ink.variant.semanticTokens?.radii).toBeUndefined();
    expect(ink.variant.semanticTokens?.shadows).toBeUndefined();
  });

  it("states no axis beside its colors", () => {
    expect(Object.keys(ink.axes)).toStrictEqual(["colors"]);
  });

  it("draws the accent from the blue rather than from the grey primary", () => {
    expect(ink.variant.semanticTokens?.colors?.["accent"]).toMatchObject({
      solid: { DEFAULT: { value: { base: "#2563EB" } } },
    });
  });
});
