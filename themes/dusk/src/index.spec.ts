import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { BODY, dusk, SERIF } from "#index.ts";

describe("dusk", () => {
  it("keeps the theme contract and clears every pair in both modes", () => {
    expect(
      violations(dusk, { at: import.meta.dirname, base: foundation, recipes: {} }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(dusk.name).toBe("dusk");
  });

  it("sets every heading in the old-style serif stack and names no font package", () => {
    expect(dusk.fonts).toStrictEqual([]);
    expect(dusk.axes.faces).toStrictEqual({ heading: SERIF });
  });

  it("extends no recipe", () => {
    expect(dusk.preset.theme?.extend?.recipes).toBeUndefined();
  });

  it("draws a one-rem corner under a roomy ring", () => {
    expect(dusk.variant.semanticTokens?.radii?.["l3"]).toStrictEqual({ value: "1rem" });
    expect(dusk.axes.shape).toStrictEqual({
      corner: "1rem",
      ring: { offset: "3px", width: "2px" },
    });
  });

  it("casts faint shadows in the navy's hue", () => {
    expect(dusk.axes.depth).toStrictEqual({ depth: 0.5, hue: 246 });
  });

  it("draws a slow tempo that eases in and out", () => {
    expect(dusk.variant.semanticTokens?.durations?.["enter"]).toStrictEqual({
      value: "calc({durations.moderate} * 1.5)",
    });
    expect(dusk.variant.semanticTokens?.easings?.["enter"]).toStrictEqual({
      value: "{easings.in-out}",
    });
    expect(dusk.variant.semanticTokens?.easings?.["move"]).toStrictEqual({
      value: "{easings.in-out}",
    });
  });

  it("sets body text a step larger under headings at the normal weight", () => {
    expect(BODY).toBe(1.0625);
    expect(dusk.axes.type).toStrictEqual({
      base: BODY,
      body: { leading: "relaxed" },
      heading: { leading: "snug", tracking: "normal", weight: "normal" },
    });
  });

  it("carries its colors in the shape an attribute switches to", () => {
    expect(dusk.variant.semanticTokens?.colors?.["primary"]).toBeDefined();
  });
});
