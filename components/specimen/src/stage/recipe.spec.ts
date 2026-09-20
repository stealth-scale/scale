import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#stage/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Stage"] })).toStrictEqual([]);
  });

  it("names its class stage", () => {
    expect(recipe.className).toBe("stage");
  });

  it("offers a width axis alone", () => {
    expect(axesOf(recipe)).toStrictEqual(["width"]);
  });

  it("holds the scene to nothing until a width is picked", () => {
    expect(defaultsOf(recipe)).toStrictEqual({});
    expect(recipe.base).toStrictEqual({ inlineSize: "full" });
  });

  it("offers a phone and every breakpoint of the theme", () => {
    expect(valuesOf(recipe, "width")).toStrictEqual(["2xl", "lg", "md", "phone", "sm", "xl"]);
  });

  it("reads each breakpoint's width from its token and the phone's from the smallest measure", () => {
    expect(recipe.variants?.width.md).toStrictEqual({ maxInlineSize: "{breakpoints.md}" });
    expect(recipe.variants?.width.phone).toStrictEqual({ maxInlineSize: "xs" });
  });

  it("tracks the tag a consumer writes it under", () => {
    expect(recipe.jsx).toStrictEqual([/^Stage$/u]);
  });
});
