import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#search-input/recipe.ts";
import page from "#search-input/search-input.specimen.tsx";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["SearchInput"] })).toStrictEqual([]);
  });

  it("uses the class name search-input", () => {
    expect(recipe.className).toBe("search-input");
  });

  it("styles the control as an interactive button with an outside focus ring", () => {
    expect(recipe.base).toMatchObject({ cursor: "button", focusVisibleRing: "outside" });
  });

  it("declares the size axis only", () => {
    expect(axesOf(recipe)).toStrictEqual(["size"]);
  });

  it("defaults to size md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("offers the eight control sizes", () => {
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

  it("sizes the md square to the tag height with a 24px floor", () => {
    expect(recipe.variants?.["size"]?.["md"]).toMatchObject({
      boxSize: "max({sizes.6}, calc({sizes.tag.md} * var(--density, 1)))",
    });
  });

  it("leaves the control's place in the row to the input group", () => {
    expect(recipe.variants?.["size"]?.["md"]).not.toHaveProperty("marginInline");
  });

  it("tracks JSX named SearchInput", () => {
    expect(recipe.jsx).toStrictEqual([/^SearchInput$/u]);
  });
});
