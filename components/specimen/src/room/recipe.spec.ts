import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#room/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Room"] })).toStrictEqual([]);
  });

  it("names its class room", () => {
    expect(recipe.className).toBe("room");
  });

  it("offers a size axis alone", () => {
    expect(axesOf(recipe)).toStrictEqual(["size"]);
  });

  it("holds the box to the small measure when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "sm" });
  });

  it("offers every measure of the page", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual([
      "2xl",
      "3xl",
      "4xl",
      "5xl",
      "6xl",
      "7xl",
      "8xl",
      "lg",
      "md",
      "sm",
      "xl",
      "xs",
    ]);
  });

  it("fills its cell up to the measure", () => {
    expect(recipe.base).toStrictEqual({ inlineSize: "full" });
    expect(recipe.variants?.size?.sm).toStrictEqual({ maxInlineSize: "sm" });
  });

  it("tracks the tag a consumer writes it under", () => {
    expect(recipe.jsx).toStrictEqual([/^Room$/u]);
  });
});
