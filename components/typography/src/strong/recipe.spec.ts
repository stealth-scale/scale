import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#strong/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Strong"] })).toStrictEqual([]);
  });

  it("names its class strong", () => {
    expect(recipe.className).toBe("strong");
  });

  it("offers an entrance axis and an ink axis and a weight axis", () => {
    expect(axesOf(recipe)).toStrictEqual(["motion", "tone", "weight"]);
  });

  it("draws the semibold step when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ weight: "semibold" });
  });

  it("offers the three steps heavier than the running text", () => {
    expect(valuesOf(recipe, "weight")).toStrictEqual(["bold", "medium", "semibold"]);
  });

  it("leaves out the normal step because a run drawn at the text's weight states nothing", () => {
    expect(valuesOf(recipe, "weight")).not.toContain("normal");
  });

  it("offers the eight inks", () => {
    expect(valuesOf(recipe, "tone")).toStrictEqual([
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

  it("tracks every tag whose name ends in Strong", () => {
    expect(recipe.jsx).toStrictEqual([/Strong$/u]);
  });
});
