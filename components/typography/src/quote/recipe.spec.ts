import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#quote/quote.specimen.tsx";
import { recipe } from "#quote/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Quote"] })).toStrictEqual([]);
  });

  it("names its class quote", () => {
    expect(recipe.className).toBe("quote");
  });

  it("offers a marks axis and an entrance axis and an ink axis", () => {
    expect(axesOf(recipe)).toStrictEqual(["marks", "motion", "tone"]);
  });

  it("offers the browser's marks and none", () => {
    expect(valuesOf(recipe, "marks")).toStrictEqual(["auto", "none"]);
  });

  it("states the browser's marks when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ marks: "auto" });
  });

  it("leaves the base empty so the class is the only hook a theme extends", () => {
    expect(recipe.base).toBeUndefined();
  });

  it("tracks every tag whose name ends in Quote", () => {
    expect(recipe.jsx).toStrictEqual([/Quote$/u]);
  });
});
