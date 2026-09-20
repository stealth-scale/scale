import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { CONDENSED, regatta } from "#index.ts";
import { button } from "#recipes/button.ts";

describe("regatta", () => {
  it("keeps the theme contract and clears every pair in both modes", () => {
    expect(
      violations(regatta, {
        at: import.meta.dirname,
        base: foundation,
        recipes: { button: { className: "button" } },
      }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(regatta.name).toBe("regatta");
  });

  it("sets every heading in the condensed stack and names no font package", () => {
    expect(regatta.fonts).toStrictEqual([]);
    expect(regatta.axes.faces).toStrictEqual({ heading: CONDENSED });
  });

  it("extends the button alone", () => {
    expect(regatta.preset.theme?.extend?.recipes).toStrictEqual({ button });
  });

  it("draws an eighth-rem corner under a wide ring flush with the control", () => {
    expect(regatta.variant.semanticTokens?.radii?.["l3"]).toStrictEqual({ value: "0.125rem" });
    expect(regatta.axes.shape).toStrictEqual({
      corner: "0.125rem",
      ring: { offset: "0px", width: "3px" },
    });
  });

  it("draws a tighter density and gap", () => {
    expect(regatta.variant.semanticTokens?.sizes?.["control"]).toMatchObject({
      md: { value: "2.3750rem" },
    });
    expect(regatta.axes.metrics).toStrictEqual({ gap: 0.375, scale: 0.95 });
  });

  it("answers a press quickly on a symmetric curve", () => {
    expect(regatta.variant.semanticTokens?.durations?.["press"]).toStrictEqual({
      value: "calc({durations.fast} * 0.8)",
    });
    expect(regatta.variant.semanticTokens?.easings?.["press"]).toStrictEqual({
      value: "{easings.in-out}",
    });
  });

  it("sets extrabold headings tracked tighter beside semibold labels", () => {
    expect(regatta.axes.type).toStrictEqual({
      heading: { tracking: "tighter", weight: "extrabold" },
      label: { tracking: "wider", weight: "semibold" },
    });
  });

  it("carries its colors in the shape an attribute switches to", () => {
    expect(regatta.variant.semanticTokens?.colors?.["primary"]).toBeDefined();
  });
});
