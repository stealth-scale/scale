import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#skeleton/recipe.ts";

describe("recipe", () => {
  it("references a token on every value a theme has to be able to move", () => {
    expect(recipeViolations(recipe, { names: ["Skeleton"] })).toStrictEqual([]);
  });

  it("prefixes its generated classes with skeleton", () => {
    expect(recipe.className).toBe("skeleton");
  });

  it("declares loading and motion beside radius and nothing else", () => {
    expect(axesOf(recipe)).toStrictEqual(["loading", "motion", "radius"]);
  });

  it("defaults to a loading placeholder that pulses at the l2 radius", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ loading: true, motion: "pulse", radius: "l2" });
  });

  it("accepts none beside the two animated motions", () => {
    expect(valuesOf(recipe, "motion")).toStrictEqual(["none", "pulse", "shimmer"]);
  });

  it("accepts every corner step the theme defines", () => {
    expect(valuesOf(recipe, "radius")).toStrictEqual(["full", "l1", "l2", "l3"]);
  });

  it("hides its children and its pseudo-elements while loading", () => {
    expect(recipe.variants?.["loading"]?.["true"]).toMatchObject({
      "&::before, &::after, *": { visibility: "hidden" },
      color: "transparent",
    });
  });

  it("paints the neutral palette's muted fill while loading", () => {
    expect(recipe.variants?.["loading"]?.["true"]).toMatchObject({
      background: "colorPalette.muted",
      colorPalette: "neutral",
    });
  });

  it("carries the fade-in animation in its base", () => {
    expect(recipe.base).toStrictEqual({ animationStyle: "fade.in" });
  });

  it("declares no styles under the false value of loading", () => {
    expect(recipe.variants?.["loading"]).not.toHaveProperty("false");
  });

  it("nests every motion under the loading class", () => {
    expect(recipe.variants?.["motion"]).toStrictEqual({
      none: { "&.skeleton--loading_true": { animation: "none" } },
      pulse: { "&.skeleton--loading_true": { animationStyle: "pulse" } },
      shimmer: {
        "&.skeleton--loading_true": {
          animationStyle: "shimmer",
          backgroundImage:
            "linear-gradient(270deg, var(--colors-color-palette-muted), var(--colors-color-palette-emphasized))",
          backgroundSize: "400% 100%",
        },
      },
    });
  });

  it("anchors its jsx pattern so that SkeletonText does not match", () => {
    const [pattern] = recipe.jsx ?? [];

    expect(pattern).toStrictEqual(/^Skeleton$/u);
    expect(pattern instanceof RegExp && pattern.test("SkeletonText")).toBe(false);
  });
});
