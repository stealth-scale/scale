import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#container/container.specimen.tsx";
import { recipe } from "#container/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Container"] })).toStrictEqual([]);
  });

  it("sets className to container", () => {
    expect(recipe.className).toBe("container");
  });

  it("declares two variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["flush", "size"]);
  });

  it("defaults to the 3xl size", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "3xl" });
  });

  it("declares 14 sizes on the size axis", () => {
    expect(valuesOf(recipe, "size")).toHaveLength(14);
  });

  it.each(["full", "prose"])("declares %s on the size axis", (size) => {
    expect(valuesOf(recipe, "size")).toContain(size);
  });

  it("removes the gutter on the flush value", () => {
    expect(recipe.variants?.flush?.true).toStrictEqual({ paddingInline: "0" });
  });

  it("matches the Container JSX tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Container$/u]);
  });
});
