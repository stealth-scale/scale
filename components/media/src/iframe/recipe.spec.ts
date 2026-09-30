import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations } from "@stealthscale/testing-theme";

import page from "#iframe/iframe.specimen.tsx";
import { recipe } from "#iframe/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Iframe"] })).toStrictEqual([]);
  });

  it("sets className to iframe", () => {
    expect(recipe.className).toBe("iframe");
  });

  it("declares the radius and ratio axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["radius", "ratio"]);
  });

  it("defaults to a 16:9 frame with the l3 corners", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ radius: "l3", ratio: "video" });
  });

  it("edges the frame with a hairline on the panel's ground", () => {
    expect(recipe.base).toMatchObject({ background: "bg.panel", borderWidth: "hairline" });
  });
});
