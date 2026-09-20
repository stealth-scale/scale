import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { admiral, SERIF } from "#index.ts";

describe("admiral", () => {
  it("keeps the theme contract and clears every pair in both modes", () => {
    expect(
      violations(admiral, { at: import.meta.dirname, base: foundation, recipes: {} }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(admiral.name).toBe("admiral");
  });

  it("sets every heading in the serif stack and names no font package", () => {
    expect(admiral.fonts).toStrictEqual([]);
    expect(admiral.axes.faces).toStrictEqual({ heading: SERIF });
  });

  it("extends no recipe", () => {
    expect(admiral.preset.theme?.extend?.recipes).toBeUndefined();
  });

  it("draws crisp corners beside a thick indicator and firm shadows", () => {
    const semantic = admiral.variant.semanticTokens;

    expect(semantic?.radii?.["l3"]).toStrictEqual({ value: "0.25rem" });
    expect(semantic?.borderWidths?.["indicator"]).toStrictEqual({ value: "3px" });
    expect(admiral.axes.depth).toStrictEqual({ depth: 1.2, hue: 254 });
  });

  it("sets semibold headings tracked tight", () => {
    expect(admiral.axes.type).toStrictEqual({ heading: { tracking: "tight", weight: "semibold" } });
  });

  it("carries its colors in the shape an attribute switches to", () => {
    expect(admiral.variant.semanticTokens?.colors?.["primary"]).toBeDefined();
  });
});
