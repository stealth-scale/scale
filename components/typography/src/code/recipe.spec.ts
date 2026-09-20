import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#code/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Code"] })).toStrictEqual([]);
  });

  it("names its class code", () => {
    expect(recipe.className).toBe("code");
  });

  it("offers a size axis and a status axis and a look axis", () => {
    expect(axesOf(recipe)).toStrictEqual(["size", "status", "variant"]);
  });

  it("draws a middle subtle snippet when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "subtle" });
  });

  it("offers the two code roles as sizes", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["md", "sm"]);
  });

  it("offers five looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual([
      "outline",
      "plain",
      "solid",
      "subtle",
      "surface",
    ]);
  });

  it("gives a plain snippet no room on either side of it", () => {
    expect(recipe.variants?.["variant"]?.["plain"]).toStrictEqual({
      layerStyle: "flat.plain",
      paddingInline: "0",
    });
  });

  it("offers the four statuses", () => {
    expect(valuesOf(recipe, "status")).toStrictEqual(["error", "info", "success", "warning"]);
  });

  it("tracks every tag whose name ends in Code", () => {
    expect(recipe.jsx).toStrictEqual([/Code$/u]);
  });
});
