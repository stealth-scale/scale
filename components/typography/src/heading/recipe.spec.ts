import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#heading/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Heading"] })).toStrictEqual([]);
  });

  it("names its class heading", () => {
    expect(recipe.className).toBe("heading");
  });

  it("offers the six axes a heading takes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "display",
      "effect",
      "motion",
      "size",
      "tone",
      "truncate",
    ]);
  });

  it("sets a display heading in the middle step of the display role", () => {
    expect(recipe.variants?.["display"]?.["true"]).toStrictEqual({ textStyle: "display.md" });
  });

  it("moves a display heading to the quieter and louder steps at the two loudest sizes", () => {
    expect(recipe.compoundVariants).toStrictEqual([
      {
        className: "heading--display-quiet",
        css: { textStyle: "display.sm" },
        display: true,
        size: "2xl",
      },
      {
        className: "heading--display-loud",
        css: { textStyle: "display.lg" },
        display: true,
        size: "4xl",
      },
    ]);
  });

  it("draws the large heading role when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "lg" });
  });

  it("offers the eight heading roles as sizes", () => {
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

  it("offers the two text effects", () => {
    expect(valuesOf(recipe, "effect")).toStrictEqual(["gradient", "shine"]);
  });

  it("moves the shine with the shimmer", () => {
    expect(recipe.variants?.effect.shine).toStrictEqual({
      animationStyle: "shimmer",
      layerStyle: "text.shine",
    });
  });

  it("offers the three motions a heading enters with", () => {
    expect(valuesOf(recipe, "motion")).toStrictEqual(["fade", "reveal", "rise"]);
  });

  it("offers the foreground roles and the four statuses as tones", () => {
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

  it("tracks every tag whose name ends in Heading", () => {
    expect(recipe.jsx).toStrictEqual([/Heading$/u]);
  });
});
