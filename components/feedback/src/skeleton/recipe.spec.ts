import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#skeleton/recipe.ts";
import page from "#skeleton/skeleton.specimen.tsx";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Skeleton"] })).toStrictEqual([]);
  });

  it("sets className to skeleton", () => {
    expect(recipe.className).toBe("skeleton");
  });

  it("declares the loading motion and radius axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["loading", "motion", "radius"]);
  });

  it("defaults to loading with the pulse motion at the l2 radius", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ loading: true, motion: "pulse", radius: "l2" });
  });

  it("declares none pulse and shimmer on the motion axis", () => {
    expect(valuesOf(recipe, "motion")).toStrictEqual(["none", "pulse", "shimmer"]);
  });

  it("declares every corner on the radius axis", () => {
    expect(valuesOf(recipe, "radius")).toStrictEqual(["full", "l1", "l2", "l3"]);
  });

  it("hides the content while loading", () => {
    expect(recipe.variants?.["loading"]?.["true"]).toMatchObject({
      "&::before, &::after, *": { visibility: "hidden" },
      color: "transparent",
    });
  });

  it("draws a GrayText outline under forced colors while loading", () => {
    expect(recipe.variants?.["loading"]?.["true"]).toMatchObject({
      _highContrast: { outlineColor: "GrayText", outlineStyle: "solid", outlineWidth: "hairline" },
    });
  });

  it("reads the muted role of the neutral palette while loading", () => {
    expect(recipe.variants?.["loading"]?.["true"]).toMatchObject({
      background: "colorPalette.muted",
      colorPalette: "neutral",
    });
  });

  it("runs the fade.in animation style in the base", () => {
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

  it("matches the Skeleton tag only", () => {
    const [pattern] = recipe.jsx ?? [];

    expect(pattern).toStrictEqual(/^Skeleton$/u);
    expect(pattern instanceof RegExp && pattern.test("SkeletonText")).toBe(false);
  });
});
