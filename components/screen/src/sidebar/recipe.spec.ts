import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#sidebar/recipe.ts";

/**
 * The parts a sidebar draws, which the check is handed to read the slots by.
 */
const PARTS = [
  "root",
  "header",
  "content",
  "footer",
  "nav",
  "navLabel",
  "navAction",
  "search",
  "empty",
  "separator",
];

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Sidebar"], parts: PARTS })).toStrictEqual([]);
  });

  it("names its class sidebar", () => {
    expect(recipe.className).toBe("sidebar");
  });

  it("styles the ten parts a sidebar draws", () => {
    expect(recipe.slots).toStrictEqual(PARTS);
  });

  it("offers the two axes a sidebar takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["size", "variant"]);
  });

  it("draws a plain column at the middle size when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "plain" });
  });

  it("offers the four ways the column is set against the screen", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["outline", "plain", "subtle", "surface"]);
  });

  it("draws the subtle column as a ground and no line", () => {
    expect(recipe.variants?.["variant"]?.["subtle"]?.["root"]).toStrictEqual({
      background: "bg.subtle",
    });
  });

  it("scrolls the middle band rather than the column", () => {
    expect(recipe.base?.["content"]).toMatchObject({ overflowY: "auto" });
    expect(recipe.base?.["root"]).not.toHaveProperty("overflowY");
  });

  it("keeps a block's heading for a screen reader on a collapsed sidebar", () => {
    expect(recipe.base?.["navLabel"]?.["[data-iconic] &"]).toStrictEqual({ srOnly: true });
  });

  it("takes the search out of a collapsed sidebar", () => {
    expect(recipe.base?.["search"]?.["[data-iconic] &"]).toStrictEqual({ display: "none" });
  });

  it("takes a block's control out of a collapsed sidebar", () => {
    expect(recipe.base?.["navAction"]?.["[data-iconic] &"]).toStrictEqual({ display: "none" });
  });

  it("tracks every tag under the Sidebar namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^Sidebar(\.\w+)?$/u]);
  });
});
