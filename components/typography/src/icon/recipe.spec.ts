import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#icon/icon.specimen.tsx";
import { recipe } from "#icon/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Icon"] })).toStrictEqual([]);
  });

  it("sets className to icon", () => {
    expect(recipe.className).toBe("icon");
  });

  it("declares four variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["mirrored", "motion", "size", "tone"]);
  });

  it("defaults to the inherit size", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "inherit" });
  });

  it("declares eight icon sizes and inherit on the size axis", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual([
      "2xl",
      "3xl",
      "4xl",
      "inherit",
      "lg",
      "md",
      "sm",
      "xl",
      "xs",
    ]);
  });

  it("declares eight inks and current on the tone axis", () => {
    expect(valuesOf(recipe, "tone")).toStrictEqual([
      "current",
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

  it("sets color to currentcolor in the base", () => {
    expect(recipe.base).toMatchObject({ color: "currentcolor" });
  });

  it("fills an svg with the current colour only when it sets no fill", () => {
    expect(recipe.base).toMatchObject({ "&:not([fill])": { fill: "currentcolor" } });
  });

  it("declares three motions on the motion axis", () => {
    expect(valuesOf(recipe, "motion")).toStrictEqual(["float", "spin", "twinkle"]);
  });

  it("mirrors through scale in a right-to-left page", () => {
    expect(recipe.variants?.mirrored.true).toStrictEqual({ _rtl: { scale: "-1 1" } });
  });

  it("matches every JSX tag that ends in Icon", () => {
    expect(recipe.jsx).toStrictEqual([/Icon$/u]);
  });
});
