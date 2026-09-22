import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#container/container.specimen.tsx";
import { recipe } from "#container/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Container"] })).toStrictEqual([]);
  });

  it("names its class container", () => {
    expect(recipe.className).toBe("container");
  });

  it("offers a measure axis and a gutter a caller clears", () => {
    expect(axesOf(recipe)).toStrictEqual(["flush", "size"]);
  });

  it("holds a page to the wide measure when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "3xl" });
  });

  it("offers every measure the page is read at beside the prose measure", () => {
    expect(valuesOf(recipe, "size")).toContain("prose");
    expect(valuesOf(recipe, "size")).toContain("full");
    expect(valuesOf(recipe, "size")).toHaveLength(14);
  });

  it("tracks the tag a consumer writes it under", () => {
    expect(recipe.jsx).toStrictEqual([/^Container$/u]);
  });
});
