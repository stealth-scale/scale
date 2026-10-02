import { describe, expect, it } from "vitest";

import { axesOf, recipeViolations } from "@stealthscale/testing-theme";

import { recipe } from "#contained/recipe.ts";

describe("recipe", () => {
  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Contained"] })).toStrictEqual([]);
  });

  it("sets className to contained", () => {
    expect(recipe.className).toBe("contained");
  });

  it("declares no variant axis", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("contains the layout of its descendants in the base", () => {
    expect(recipe.base).toMatchObject({ contain: "layout", display: "block" });
  });

  it("takes the full inline size of its container", () => {
    expect(recipe.base).toMatchObject({ inlineSize: "full" });
  });

  it("matches the Contained JSX tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Contained$/u]);
  });
});
