import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { RATIOS } from "#colors.ts";
import { harbour } from "#index.ts";

describe("harbour", () => {
  it("keeps the theme contract and clears every pair at the ratios it draws to", () => {
    expect(
      violations(harbour, {
        at: import.meta.dirname,
        base: foundation,
        recipes: {},
        thresholds: RATIOS,
      }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(harbour.name).toBe("harbour");
  });

  it("keeps the foundation's faces and names no font package", () => {
    expect(harbour.fonts).toStrictEqual([]);
    expect(harbour.axes.faces).toBeUndefined();
  });

  it("extends no recipe", () => {
    expect(harbour.preset.theme?.extend?.recipes).toBeUndefined();
  });

  it("casts light shadows in the navy's hue", () => {
    expect(harbour.axes.depth).toStrictEqual({ depth: 0.6, hue: 241 });
  });

  it("draws a looser density and a longer measure", () => {
    expect(harbour.variant.semanticTokens?.sizes?.["control"]).toMatchObject({
      md: { value: "2.6250rem" },
    });
    expect(harbour.variant.semanticTokens?.sizes?.["prose"]).toStrictEqual({ value: "70ch" });
  });

  it("draws a slow tempo that eases both ways", () => {
    expect(harbour.variant.semanticTokens?.durations?.["press"]).toStrictEqual({
      value: "calc({durations.fast} * 1.25)",
    });
    expect(harbour.variant.semanticTokens?.easings?.["enter"]).toStrictEqual({
      value: "{easings.in-out}",
    });
    expect(harbour.variant.semanticTokens?.easings?.["move"]).toStrictEqual({
      value: "{easings.in-out}",
    });
  });

  it("sets body text with more air beside headings at a medium weight", () => {
    expect(harbour.axes.type).toStrictEqual({
      body: { leading: "relaxed" },
      heading: { weight: "medium" },
    });
  });

  it("carries its colors in the shape an attribute switches to", () => {
    expect(harbour.variant.semanticTokens?.colors?.["primary"]).toBeDefined();
    expect(harbour.variant.semanticTokens?.radii?.["l3"]).toStrictEqual({ value: "0.375rem" });
  });
});
