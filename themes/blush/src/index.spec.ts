import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { blush, INSET, ROUNDED } from "#index.ts";
import { button } from "#recipes/button.ts";

describe("blush", () => {
  it("keeps the theme contract and clears every pair in both modes", () => {
    expect(
      violations(blush, {
        at: import.meta.dirname,
        base: foundation,
        recipes: { button: { className: "button" } },
      }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(blush.name).toBe("blush");
  });

  it("reads the page in the rounded stack and names no font package", () => {
    expect(blush.fonts).toStrictEqual([]);
    expect(blush.axes.faces).toStrictEqual({ body: ROUNDED });
  });

  it("extends the button alone", () => {
    expect(blush.preset.theme?.extend?.recipes).toStrictEqual({ button });
  });

  it("draws round corners under soft shadows", () => {
    expect(blush.variant.semanticTokens?.radii?.["l3"]).toStrictEqual({ value: "1.25rem" });
    expect(blush.axes.depth).toStrictEqual({ depth: 0.8, hue: 263 });
  });

  it("draws a looser density with wider insets", () => {
    expect(INSET).toBe(1.25);
    expect(blush.variant.semanticTokens?.sizes?.["control"]).toMatchObject({
      md: { value: "2.6250rem" },
    });
    expect(blush.variant.semanticTokens?.spacing?.["inset"]).toMatchObject({
      md: { value: "1.3125rem" },
    });
  });

  it("answers a press a touch slower", () => {
    expect(blush.variant.semanticTokens?.durations?.["press"]).toStrictEqual({
      value: "calc({durations.fast} * 1.1)",
    });
  });

  it("sets bold headings beside semibold labels", () => {
    expect(blush.axes.type).toStrictEqual({
      heading: { weight: "bold" },
      label: { weight: "semibold" },
    });
  });

  it("carries its colors in the shape an attribute switches to", () => {
    expect(blush.variant.semanticTokens?.colors?.["primary"]).toBeDefined();
  });
});
