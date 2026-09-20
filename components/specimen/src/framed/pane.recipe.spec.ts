import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#framed/pane.recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Pane"] })).toStrictEqual([]);
  });

  it("names its class pane", () => {
    expect(recipe.className).toBe("pane");
  });

  it("offers the frame axis alone with every way a scene meets its card", () => {
    expect(axesOf(recipe)).toStrictEqual(["frame"]);
    expect(valuesOf(recipe, "frame")).toStrictEqual(["bare", "bleed", "inset"]);
  });

  it("insets the scene when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ frame: "inset" });
  });

  it("keeps the card's room round an inset scene and none round a bled or bared one", () => {
    expect(recipe.variants?.["frame"]?.["inset"]).toHaveProperty("padding");
    expect(recipe.variants?.["frame"]?.["bleed"]).toStrictEqual({ padding: "0" });
    expect(recipe.variants?.["frame"]?.["bare"]).toStrictEqual({ padding: "0" });
  });
});
