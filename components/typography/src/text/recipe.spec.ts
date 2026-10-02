import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#text/recipe.ts";
import page from "#text/text.specimen.tsx";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Text"] })).toStrictEqual([]);
  });

  it("sets className to text", () => {
    expect(recipe.className).toBe("text");
  });

  it("sets text-wrap to pretty in the base", () => {
    expect(recipe.base).toMatchObject({ textWrap: "pretty" });
  });

  it("breaks a word wider than the container", () => {
    expect(recipe.base).toMatchObject({ overflowWrap: "anywhere" });
  });

  it("declares seven variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "align",
      "mask",
      "motion",
      "size",
      "tone",
      "truncate",
      "weight",
    ]);
  });

  it("defaults to the md body size", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("declares the five body sizes on the size axis", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm", "xl", "xs"]);
  });

  it("declares eight inks on the tone axis", () => {
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

  it("declares four weights on the weight axis", () => {
    expect(valuesOf(recipe, "weight")).toStrictEqual(["bold", "medium", "normal", "semibold"]);
  });

  it("declares four alignments on the align axis", () => {
    expect(valuesOf(recipe, "align")).toStrictEqual(["center", "end", "justify", "start"]);
  });

  it("declares three entrance motions on the motion axis", () => {
    expect(valuesOf(recipe, "motion")).toStrictEqual(["fade", "reveal", "rise"]);
  });

  it("declares three fade masks on the mask axis", () => {
    expect(valuesOf(recipe, "mask")).toStrictEqual(["bottom", "edges", "radial"]);
  });

  it("reads each mask from the layer style of the same name", () => {
    expect(recipe.variants?.["mask"]?.["edges"]).toStrictEqual({ layerStyle: "mask.edges" });
    expect(recipe.variants?.["mask"]?.["radial"]).toStrictEqual({ layerStyle: "mask.radial" });
  });

  it("matches every JSX tag that ends in Text", () => {
    expect(recipe.jsx).toStrictEqual([/Text$/u]);
  });
});
