import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#heading/heading.specimen.tsx";
import { recipe } from "#heading/recipe.ts";

function compound(className: string): unknown {
  return recipe.compoundVariants?.find((one) => one.className === className);
}

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Heading"] })).toStrictEqual([]);
  });

  it("sets className to heading", () => {
    expect(recipe.className).toBe("heading");
  });

  it("sets text-wrap to balance in the base", () => {
    expect(recipe.base).toMatchObject({ textWrap: "balance" });
  });

  it("breaks a word wider than the container", () => {
    expect(recipe.base).toMatchObject({ overflowWrap: "anywhere" });
  });

  it("declares six variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "display",
      "effect",
      "motion",
      "size",
      "tone",
      "truncate",
    ]);
  });

  it("reads display.md when display is true", () => {
    expect(recipe.variants?.["display"]?.["true"]).toStrictEqual({ textStyle: "display.md" });
  });

  it("reads display.sm when display is true at 2xl", () => {
    expect(compound("heading--display-quiet")).toStrictEqual({
      className: "heading--display-quiet",
      css: { textStyle: "display.sm" },
      display: true,
      size: "2xl",
    });
  });

  it("reads display.lg when display is true at 4xl", () => {
    expect(compound("heading--display-loud")).toStrictEqual({
      className: "heading--display-loud",
      css: { textStyle: "display.lg" },
      display: true,
      size: "4xl",
    });
  });

  it("defaults to the lg heading size", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "lg" });
  });

  it("declares eight heading sizes on the size axis", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual([
      "2xl",
      "3xl",
      "4xl",
      "lg",
      "md",
      "sm",
      "xl",
      "xs",
    ]);
  });

  it("declares two text effects on the effect axis", () => {
    expect(valuesOf(recipe, "effect")).toStrictEqual(["gradient", "shine"]);
  });

  it("animates shine with the shimmer animation style", () => {
    expect(recipe.variants?.effect.shine).toStrictEqual({
      animationStyle: "shimmer",
      layerStyle: "text.shine",
    });
  });

  it("declares three entrance motions on the motion axis", () => {
    expect(valuesOf(recipe, "motion")).toStrictEqual(["fade", "reveal", "rise"]);
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

  it("matches every JSX tag that ends in Heading", () => {
    expect(recipe.jsx).toStrictEqual([/Heading$/u]);
  });
});
