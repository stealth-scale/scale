import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#color-swatch/color-swatch.specimen.tsx";
import { recipe } from "#color-swatch/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["ColorSwatch", "ColorSwatchMix"] })).toStrictEqual(
      [],
    );
  });

  it("sets className to color-swatch", () => {
    expect(recipe.className).toBe("color-swatch");
  });

  it("declares mix shape and size axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["mix", "shape", "size"]);
  });

  it("defaults to the middle size with rounded corners", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ shape: "rounded", size: "md" });
  });

  it("declares halves quarters and thirds on the mix axis", () => {
    expect(valuesOf(recipe, "mix")).toStrictEqual(["halves", "quarters", "thirds"]);
  });

  it("layers the colour custom property over the checkerboard", () => {
    expect(recipe.base?.["backgroundImage"]).toContain("var(--color-swatch-value, transparent)");
    expect(recipe.base?.["backgroundImage"]).toContain("repeating-conic-gradient(");
  });

  it("clips the background to the padding box inside a hairline border", () => {
    expect(recipe.base).toMatchObject({ backgroundClip: "padding-box", borderWidth: "hairline" });
  });

  it("keeps the colour in forced colors mode", () => {
    expect(recipe.base).toMatchObject({ forcedColorAdjust: "none" });
  });

  it("divides a quartered mix clockwise from the top right", () => {
    expect(recipe.variants?.["mix"]?.["quarters"]?.["backgroundImage"]).toContain(
      "conic-gradient(var(--color-swatch-2) 0% 25%, var(--color-swatch-4) 0% 50%, var(--color-swatch-3) 0% 75%, var(--color-swatch-1) 0%)",
    );
  });

  it("sizes the box to the surrounding text when size is inherit", () => {
    expect(recipe.variants?.["size"]?.["inherit"]).toStrictEqual({ boxSize: "1em" });
  });
});
