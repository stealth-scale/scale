import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { carnival, CONTROL, HUMANIST, RATIO } from "#index.ts";

describe("carnival", () => {
  it("keeps the theme contract and clears every pair in both modes", () => {
    expect(
      violations(carnival, { at: import.meta.dirname, base: foundation, recipes: {} }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(carnival.name).toBe("carnival");
  });

  it("sets every heading in the humanist stack and names no font package", () => {
    expect(carnival.fonts).toStrictEqual([]);
    expect(carnival.axes.faces).toStrictEqual({ heading: HUMANIST });
  });

  it("extends no recipe", () => {
    expect(carnival.preset.theme?.extend?.recipes).toBeUndefined();
  });

  it("draws a one-rem corner over a half-rem inner one", () => {
    expect(carnival.variant.semanticTokens?.radii?.["l3"]).toStrictEqual({ value: "1rem" });
    expect(carnival.variant.semanticTokens?.radii?.["l1"]).toStrictEqual({ value: "0.5rem" });
  });

  it("casts firm shadows in the navy's hue", () => {
    expect(carnival.axes.depth).toStrictEqual({ depth: 1.25, hue: 256 });
  });

  it("draws a taller control at a looser density", () => {
    expect(CONTROL).toBe(2.75);
    expect(carnival.variant.semanticTokens?.sizes?.["control"]).toMatchObject({
      md: { value: "2.8875rem" },
    });
  });

  it("answers a press quickly", () => {
    expect(carnival.variant.semanticTokens?.durations?.["press"]).toStrictEqual({
      value: "calc({durations.fast} * 0.85)",
    });
  });

  it("climbs the scale by a minor third under extrabold headings", () => {
    expect(RATIO).toBe(1.2);
    expect(carnival.axes.type).toStrictEqual({
      heading: { weight: "extrabold" },
      label: { weight: "bold" },
      ratio: RATIO,
    });
  });

  it("carries its colors in the shape an attribute switches to", () => {
    expect(carnival.variant.semanticTokens?.colors?.["primary"]).toBeDefined();
    expect(carnival.variant.semanticTokens?.colors?.["yellow"]).toBeDefined();
  });
});
