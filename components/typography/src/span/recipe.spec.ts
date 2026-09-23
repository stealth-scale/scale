import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#span/recipe.ts";
import page from "#span/span.specimen.tsx";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Span"] })).toStrictEqual([]);
  });

  it("sets className to span", () => {
    expect(recipe.className).toBe("span");
  });

  it("declares four variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["motion", "tone", "truncate", "weight"]);
  });

  it("declares no size axis", () => {
    expect(axesOf(recipe)).not.toContain("size");
  });

  it("declares no default variant", () => {
    expect(defaultsOf(recipe)).toStrictEqual({});
  });

  it("declares four weights on the weight axis", () => {
    expect(valuesOf(recipe, "weight")).toStrictEqual(["bold", "medium", "normal", "semibold"]);
  });

  it("renders a truncated span as an inline block", () => {
    expect(recipe.variants?.["truncate"]?.["true"]).toMatchObject({
      display: "inline-block",
      overflow: "hidden",
    });
  });

  it("matches every JSX tag that ends in Span", () => {
    expect(recipe.jsx).toStrictEqual([/Span$/u]);
  });
});
