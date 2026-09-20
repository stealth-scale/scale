import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { RATIOS } from "#colors.ts";
import { HUMANIST, pine, RATIO } from "#index.ts";

describe("pine", () => {
  it("keeps the theme contract and clears every pair at the ratios it draws to", () => {
    expect(
      violations(pine, {
        at: import.meta.dirname,
        base: foundation,
        recipes: {},
        thresholds: RATIOS,
      }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(pine.name).toBe("pine");
  });

  it("sets every heading in the humanist stack and names no font package", () => {
    expect(pine.fonts).toStrictEqual([]);
    expect(pine.axes.faces).toStrictEqual({ heading: HUMANIST });
  });

  it("extends no recipe", () => {
    expect(pine.preset.theme?.extend?.recipes).toBeUndefined();
  });

  it("casts light shadows in the night's hue", () => {
    expect(pine.axes.depth).toStrictEqual({ depth: 0.75, hue: 212 });
  });

  it("draws a looser density and a longer measure", () => {
    expect(pine.variant.semanticTokens?.sizes?.["control"]).toMatchObject({
      md: { value: "2.6250rem" },
    });
    expect(pine.variant.semanticTokens?.sizes?.["prose"]).toStrictEqual({ value: "68ch" });
  });

  it("draws a slow tempo that eases both ways", () => {
    expect(pine.variant.semanticTokens?.durations?.["enter"]).toStrictEqual({
      value: "calc({durations.moderate} * 1.3)",
    });
    expect(pine.variant.semanticTokens?.easings?.["leave"]).toStrictEqual({
      value: "{easings.in-out}",
    });
  });

  it("climbs the scale by a minor third under medium headings", () => {
    expect(RATIO).toBe(1.2);
    expect(pine.axes.type).toStrictEqual({
      body: { leading: "relaxed" },
      heading: { weight: "medium" },
      ratio: RATIO,
    });
  });

  it("carries its colors in the shape an attribute switches to", () => {
    expect(pine.variant.semanticTokens?.colors?.["primary"]).toBeDefined();
    expect(pine.variant.semanticTokens?.radii?.["l3"]).toStrictEqual({ value: "0.625rem" });
  });
});
