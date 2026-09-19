import { describe, expect, it } from "vitest";

import { axesOf, recipeViolations } from "@stealthscale/testing-theme";

import { recipe } from "#tile/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Tile"] })).toStrictEqual([]);
  });

  it("names its class tile", () => {
    expect(recipe.className).toBe("tile");
  });

  it("offers no axis because a tile only stands in for content", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("draws the neutral palette's quiet surface with its edge", () => {
    expect(recipe.base).toMatchObject({ colorPalette: "neutral", layerStyle: "flat.surface" });
  });

  it("tracks the tag a consumer writes it under", () => {
    expect(recipe.jsx).toStrictEqual([/^Tile$/u]);
  });
});
