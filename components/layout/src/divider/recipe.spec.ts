import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#divider/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Divider"] })).toStrictEqual([]);
  });

  it("names its class divider", () => {
    expect(recipe.className).toBe("divider");
  });

  it("offers the direction the line runs in", () => {
    expect(axesOf(recipe)).toStrictEqual(["orientation"]);
    expect(valuesOf(recipe, "orientation")).toStrictEqual(["horizontal", "vertical"]);
  });

  it("draws the line across the page when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ orientation: "horizontal" });
  });

  it("reads the foundation's hairline for each direction", () => {
    expect(recipe.variants?.["orientation"]).toMatchObject({
      horizontal: { borderBlockEndWidth: "hairline", borderColor: "border" },
      vertical: { borderColor: "border", borderInlineEndWidth: "hairline" },
    });
  });

  it("tracks the tag a consumer writes it under", () => {
    expect(recipe.jsx).toStrictEqual([/^Divider$/u]);
  });
});
