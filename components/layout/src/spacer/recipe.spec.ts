import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, recipeViolations } from "@stealthscale/testing-theme";

import { recipe } from "#spacer/recipe.ts";
import page from "#spacer/spacer.specimen.tsx";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Spacer"] })).toStrictEqual([]);
  });

  it("sets className to spacer", () => {
    expect(recipe.className).toBe("spacer");
  });

  it("declares no variant axis", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("grows from a zero flex basis in the base", () => {
    expect(recipe.base).toMatchObject({ flexBasis: "0", flexGrow: "1" });
  });

  it("matches the Spacer JSX tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Spacer$/u]);
  });
});
