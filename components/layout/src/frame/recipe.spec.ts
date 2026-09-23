import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import specimen from "#frame/frame.specimen.tsx";
import { recipe } from "#frame/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, specimen.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, specimen.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Frame"] })).toStrictEqual([]);
  });

  it("sets className to frame", () => {
    expect(recipe.className).toBe("frame");
  });

  it("declares four variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["blur", "fit", "radius", "ratio"]);
  });

  it("defaults to a square frame that crops its child", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ fit: "cover", ratio: "square" });
  });

  it("declares three blurs on the blur axis", () => {
    expect(valuesOf(recipe, "blur")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("applies the blur layer style to the child at blur md", () => {
    expect(recipe.variants?.["blur"]?.["md"]).toStrictEqual({
      "& > *": { layerStyle: "blur.md", scale: "1.09" },
    });
  });

  it("scales the blurred child further at each larger blur", () => {
    const blur = recipe.variants?.blur;
    const grown = [blur?.sm, blur?.md, blur?.lg].map((step) => Number(step?.["& > *"]?.scale));

    expect(grown).toStrictEqual([1.06, 1.09, 1.12]);
  });

  it("declares seven ratios on the ratio axis", () => {
    expect(valuesOf(recipe, "ratio")).toHaveLength(7);
  });

  it("declares video on the ratio axis", () => {
    expect(valuesOf(recipe, "ratio")).toContain("video");
  });

  it("declares four radii on the radius axis", () => {
    expect(valuesOf(recipe, "radius")).toStrictEqual(["full", "l1", "l2", "l3"]);
  });

  it("matches the Frame JSX tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Frame$/u]);
  });
});
