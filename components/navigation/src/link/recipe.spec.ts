import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#link/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Link"] })).toStrictEqual([]);
  });

  it("names its class link", () => {
    expect(recipe.className).toBe("link");
  });

  it("offers the two axes a link takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["inherit", "variant"]);
  });

  it("takes the ink of the words around it whether or not it was visited", () => {
    expect(recipe.variants?.["inherit"]?.["true"]).toStrictEqual({
      _visited: { color: "inherit" },
      color: "inherit",
    });
  });

  it("underlines a link at rest when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ variant: "underline" });
  });

  it("offers the two looks a link is drawn in", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["plain", "underline"]);
  });

  it("reads the theme's own link ink rather than stating a colour", () => {
    expect(recipe.base).toMatchObject({ color: "fg.link" });
  });

  it("underlines under a pointer whichever look a caller picks", () => {
    expect(recipe.base?.["_hover"]).toMatchObject({ textDecoration: "underline" });
  });

  it("tracks the tag named Link and not the trail's own", () => {
    const [pattern] = recipe.jsx ?? [];

    expect(pattern).toStrictEqual(/^Link$/u);
    expect(pattern instanceof RegExp && pattern.test("BreadcrumbLink")).toBe(false);
  });
});
