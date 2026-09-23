import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#strong/recipe.ts";
import page from "#strong/strong.specimen.tsx";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Strong"] })).toStrictEqual([]);
  });

  it("sets className to strong", () => {
    expect(recipe.className).toBe("strong");
  });

  it("declares three variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["motion", "tone", "weight"]);
  });

  it("defaults to the semibold weight", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ weight: "semibold" });
  });

  it("declares three weights on the weight axis", () => {
    expect(valuesOf(recipe, "weight")).toStrictEqual(["bold", "medium", "semibold"]);
  });

  it("declares no normal weight", () => {
    expect(valuesOf(recipe, "weight")).not.toContain("normal");
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

  it("matches every JSX tag that ends in Strong", () => {
    expect(recipe.jsx).toStrictEqual([/Strong$/u]);
  });
});
