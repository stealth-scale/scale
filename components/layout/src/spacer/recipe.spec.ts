import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, recipeViolations } from "@stealthscale/testing-theme";

import { recipe } from "#spacer/recipe.ts";
import page from "#spacer/spacer.specimen.tsx";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Spacer"] })).toStrictEqual([]);
  });

  it("names its class spacer", () => {
    expect(recipe.className).toBe("spacer");
  });

  it("offers no axis because there is nothing about empty room a caller picks", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("grows into whatever a stack has not given its other children", () => {
    expect(recipe.base).toMatchObject({ flexBasis: "0", flexGrow: "1" });
  });

  it("tracks the tag a consumer writes it under", () => {
    expect(recipe.jsx).toStrictEqual([/^Spacer$/u]);
  });
});
