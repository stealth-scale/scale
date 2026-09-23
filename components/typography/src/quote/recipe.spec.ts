import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#quote/quote.specimen.tsx";
import { recipe } from "#quote/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Quote"] })).toStrictEqual([]);
  });

  it("sets className to quote", () => {
    expect(recipe.className).toBe("quote");
  });

  it("declares three variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["marks", "motion", "tone"]);
  });

  it("declares auto and none on the marks axis", () => {
    expect(valuesOf(recipe, "marks")).toStrictEqual(["auto", "none"]);
  });

  it("defaults to the browser's quotation marks", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ marks: "auto" });
  });

  it("declares no base", () => {
    expect(recipe.base).toBeUndefined();
  });

  it("matches every JSX tag that ends in Quote", () => {
    expect(recipe.jsx).toStrictEqual([/Quote$/u]);
  });
});
