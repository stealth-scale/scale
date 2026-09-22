import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#search-input/recipe.ts";
import page from "#search-input/search-input.specimen.tsx";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["SearchInput"] })).toStrictEqual([]);
  });

  it("names its class search-input", () => {
    expect(recipe.className).toBe("search-input");
  });

  it("draws the control as something a person presses", () => {
    expect(recipe.base).toMatchObject({ cursor: "button", focusVisibleRing: "outside" });
  });

  it("offers the one axis a search field takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["size"]);
  });

  it("draws the middle size when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("offers the eight sizes every component shares", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual([
      "2xl",
      "3xl",
      "4xl",
      "lg",
      "md",
      "sm",
      "xl",
      "xs",
    ]);
  });

  it("fills the mark the group sizes off the control scale", () => {
    expect(recipe.base).toMatchObject({ blockSize: "full", inlineSize: "full" });
  });

  it("tracks the tag named SearchInput", () => {
    expect(recipe.jsx).toStrictEqual([/^SearchInput$/u]);
  });
});
