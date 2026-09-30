import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, recipeViolations } from "@stealthscale/testing-theme";

import { CLASS, recipe } from "#truncate/recipe.ts";
import page from "#truncate/truncate.specimen.tsx";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Truncate"] })).toStrictEqual([]);
  });

  it("sets className to truncate", () => {
    expect(recipe.className).toBe(CLASS);
  });

  it("declares no variant axis", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("clamps the text at the line count the component writes", () => {
    expect(recipe.base).toMatchObject({ lineClamp: "var(--truncate-lines, 1)" });
  });

  it("lets a flex row shrink the text below its content", () => {
    expect(recipe.base).toMatchObject({ minInlineSize: "0" });
  });

  it("breaks a word longer than the line", () => {
    expect(recipe.base).toMatchObject({ overflowWrap: "anywhere" });
  });
});
