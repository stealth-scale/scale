import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#video/recipe.ts";
import page from "#video/video.specimen.tsx";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Video"] })).toStrictEqual([]);
  });

  it("sets className to video", () => {
    expect(recipe.className).toBe("video");
  });

  it("declares three axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["fit", "radius", "ratio"]);
  });

  it("defaults to a 16:9 clip that fills its shape with the l3 corners", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ fit: "cover", radius: "l3", ratio: "video" });
  });

  it("declares the theme's seven ratios", () => {
    expect(valuesOf(recipe, "ratio")).toStrictEqual([
      "golden",
      "landscape",
      "portrait",
      "square",
      "ultrawide",
      "video",
      "wide",
    ]);
  });

  it("crops or letterboxes the clip", () => {
    expect(recipe.variants?.["fit"]).toStrictEqual({
      contain: { objectFit: "contain" },
      cover: { objectFit: "cover" },
    });
  });

  it("fills the element with bg.emphasized inside a hairline edge", () => {
    expect(recipe.base).toMatchObject({
      background: "bg.emphasized",
      borderColor: "border",
      borderWidth: "hairline",
    });
  });

  it("spans its container at the height the ratio sets", () => {
    expect(recipe.base).toMatchObject({
      blockSize: "auto",
      display: "block",
      inlineSize: "full",
      maxInlineSize: "full",
    });
  });

  it("rings a focused video outside its edge", () => {
    expect(recipe.base).toMatchObject({
      focusRingColor: "colorPalette.focusRing",
      focusVisibleRing: "outside",
    });
  });

  it("matches the Video tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Video$/u]);
  });
});
