import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { cinder, GROTESQUE } from "#index.ts";
import { badge } from "#recipes/badge.ts";

describe("cinder", () => {
  it("keeps the theme contract and clears every pair in both modes", () => {
    expect(
      violations(cinder, {
        at: import.meta.dirname,
        base: foundation,
        recipes: { badge: { className: "badge" } },
      }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(cinder.name).toBe("cinder");
  });

  it("sets every heading in the grotesque stack and names no font package", () => {
    expect(cinder.fonts).toStrictEqual([]);
    expect(cinder.axes.faces).toStrictEqual({ heading: GROTESQUE });
  });

  it("extends the badge alone", () => {
    expect(cinder.preset.theme?.extend?.recipes).toStrictEqual({ badge });
  });

  it("draws sharp corners", () => {
    expect(cinder.variant.semanticTokens?.radii?.["l3"]).toStrictEqual({ value: "0.125rem" });
  });

  it("draws a heavy control edge and a thick indicator", () => {
    expect(cinder.axes.shape).toStrictEqual({
      control: "2px",
      corner: "0.125rem",
      indicator: "3px",
      ring: { offset: "1px", width: "2px" },
    });
  });

  it("draws a tighter density", () => {
    expect(cinder.variant.semanticTokens?.sizes?.["control"]).toMatchObject({
      md: { value: "2.3750rem" },
    });
  });

  it("answers a press faster on a straight curve", () => {
    expect(cinder.variant.semanticTokens?.durations?.["press"]).toStrictEqual({
      value: "calc({durations.fast} * 0.75)",
    });
    expect(cinder.variant.semanticTokens?.easings?.["press"]).toStrictEqual({
      value: "{easings.linear}",
    });
  });

  it("sets bold headings tracked tight beside semibold labels", () => {
    expect(cinder.axes.type).toStrictEqual({
      heading: { tracking: "tight", weight: "bold" },
      label: { weight: "semibold" },
    });
  });

  it("carries its colors in the shape an attribute switches to", () => {
    expect(cinder.variant.semanticTokens?.colors?.["primary"]).toBeDefined();
    expect(cinder.variant.semanticTokens?.colors?.["red"]).toBeDefined();
  });
});
