import { describe, expect, it } from "vitest";

import { axesOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#em/recipe.ts";

describe("recipe", () => {
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
