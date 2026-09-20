import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#icon/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Icon"] })).toStrictEqual([]);
  });

  it("names its class icon", () => {
    expect(recipe.className).toBe("icon");
  });

  it("offers a mirrored axis and a motion axis and a size axis and a tone axis", () => {
    expect(axesOf(recipe)).toStrictEqual(["mirrored", "motion", "size", "tone"]);
  });

  it("follows the size of the text around it when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "inherit" });
  });

  it("offers the eight icon sizes and the inherited one", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual([
      "2xl",
      "3xl",
      "4xl",
      "inherit",
      "lg",
      "md",
      "sm",
      "xl",
      "xs",
    ]);
  });

  it("offers every ink the library draws words in beside the current colour", () => {
    expect(valuesOf(recipe, "tone")).toStrictEqual([
      "current",
      "default",
      "error",
      "info",
      "inverted",
      "muted",
      "subtle",
      "success",
      "warning",
    ]);
  });

  it("reads the ink of the words round it until a caller picks one", () => {
    expect(recipe.base).toMatchObject({ color: "currentcolor" });
    expect(recipe.variants?.["tone"]?.["current"]).toStrictEqual({ color: "currentcolor" });
  });

  it("offers the three motions a mark takes", () => {
    expect(valuesOf(recipe, "motion")).toStrictEqual(["float", "spin", "twinkle"]);
  });

  it("flips a mirrored mark through a property the spin motion does not animate", () => {
    expect(recipe.variants?.mirrored.true).toStrictEqual({ _rtl: { scale: "-1 1" } });
  });

  it("tracks every tag whose name ends in Icon", () => {
    expect(recipe.jsx).toStrictEqual([/Icon$/u]);
  });
});
