import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, recipeViolations } from "@stealthscale/testing-theme";

import page from "#audio/audio.specimen.tsx";
import { recipe } from "#audio/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Audio"] })).toStrictEqual([]);
  });

  it("sets className to audio", () => {
    expect(recipe.className).toBe("audio");
  });

  it("declares no axis", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("fills the inline size of its container as a block", () => {
    expect(recipe.base).toMatchObject({ display: "block", inlineSize: "full" });
  });
});
