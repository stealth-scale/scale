import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#em/em.specimen.tsx";
import { recipe } from "#em/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Em"] })).toStrictEqual([]);
  });

  it("sets className to em", () => {
    expect(recipe.className).toBe("em");
  });

  it("declares two variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["motion", "tone"]);
  });

  it("declares eight inks on the tone axis", () => {
    expect(valuesOf(recipe, "tone")).toStrictEqual([
      "default",
      "error",
      "info",
      "inverted",
      "muted",
      "subtle",
      "success",
      "warning",
    ]);
  });

  it("declares three entrance motions on the motion axis", () => {
    expect(valuesOf(recipe, "motion")).toStrictEqual(["fade", "reveal", "rise"]);
  });

  it("sets font-style to italic in the base", () => {
    expect(recipe.base).toStrictEqual({ fontStyle: "italic" });
  });

  it("matches every JSX tag that ends in Em", () => {
    expect(recipe.jsx).toStrictEqual([/Em$/u]);
  });
});
