import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#em/em.specimen.tsx";
import { recipe } from "#em/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Em"] })).toStrictEqual([]);
  });

  it("names its class em", () => {
    expect(recipe.className).toBe("em");
  });

  it("offers an ink axis and an entrance axis", () => {
    expect(axesOf(recipe)).toStrictEqual(["motion", "tone"]);
  });

  it("offers the eight inks", () => {
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

  it("offers the three entrances", () => {
    expect(valuesOf(recipe, "motion")).toStrictEqual(["fade", "reveal", "rise"]);
  });

  it("declares fontStyle italic", () => {
    expect(recipe.base).toStrictEqual({ fontStyle: "italic" });
  });

  it("tracks every tag whose name ends in Em", () => {
    expect(recipe.jsx).toStrictEqual([/Em$/u]);
  });
});
