import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, recipeViolations } from "@stealthscale/testing-theme";

import page from "#format/format.specimen.tsx";
import { CLASS, recipe } from "#format/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Format.Number"] })).toStrictEqual([]);
  });

  it("sets className to format", () => {
    expect(recipe.className).toBe(CLASS);
  });

  it("declares no variant axis", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("writes tabular numerals on one line", () => {
    expect(recipe.base).toStrictEqual({ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" });
  });
});
