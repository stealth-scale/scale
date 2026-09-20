import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { GEOMETRIC, neon } from "#index.ts";

describe("neon", () => {
  it("keeps the theme contract and clears every pair in both modes", () => {
    expect(
      violations(neon, { at: import.meta.dirname, base: foundation, recipes: {} }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(neon.name).toBe("neon");
  });

  it("sets every heading in the geometric stack and names no font package", () => {
    expect(neon.fonts).toStrictEqual([]);
    expect(neon.axes.faces).toStrictEqual({ heading: GEOMETRIC });
  });

  it("extends no recipe and redraws the glass look deeper", () => {
    expect(neon.preset.theme?.extend?.recipes).toBeUndefined();
    expect(neon.preset.theme?.extend?.layerStyles).toStrictEqual({
      glass: {
        value: { backdropFilter: "blur({blurs.lg}) saturate(1.5)", background: "bg.panel/60" },
      },
    });
  });

  it("draws a thick indicator beside a wide ring", () => {
    expect(neon.variant.semanticTokens?.radii?.["l3"]).toStrictEqual({ value: "0.75rem" });
    expect(neon.axes.shape).toStrictEqual({
      corner: "0.75rem",
      indicator: "3px",
      ring: { offset: "2px", width: "3px" },
    });
  });

  it("casts heavy shadows in the grape's hue", () => {
    expect(neon.axes.depth).toStrictEqual({ depth: 2, hue: 292 });
  });

  it("draws a snappy tempo", () => {
    expect(neon.variant.semanticTokens?.durations?.["press"]).toStrictEqual({
      value: "calc({durations.fast} * 0.6)",
    });
  });

  it("sets black headings tracked tight beside semibold labels", () => {
    expect(neon.axes.type).toStrictEqual({
      heading: { tracking: "tight", weight: "black" },
      label: { weight: "semibold" },
    });
  });

  it("carries its colors in the shape an attribute switches to", () => {
    expect(neon.variant.semanticTokens?.colors?.["primary"]).toBeDefined();
  });
});
