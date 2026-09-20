import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#mark/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Mark"] })).toStrictEqual([]);
  });

  it("names its class mark", () => {
    expect(recipe.className).toBe("mark");
  });

  it("offers the six axes a highlight takes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "effect",
      "inset",
      "motion",
      "radius",
      "status",
      "variant",
    ]);
  });

  it("draws a finished highlight when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ inset: "xs", radius: "l1", variant: "subtle" });
  });

  it("offers the five flat looks and the weight", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual([
      "outline",
      "plain",
      "solid",
      "subtle",
      "surface",
      "text",
    ]);
  });

  it("offers the four statuses", () => {
    expect(valuesOf(recipe, "status")).toStrictEqual(["error", "info", "success", "warning"]);
  });

  it("offers the four corners", () => {
    expect(valuesOf(recipe, "radius")).toStrictEqual(["full", "l1", "l2", "l3"]);
  });

  it("offers the three tightest insets", () => {
    expect(valuesOf(recipe, "inset")).toStrictEqual(["md", "sm", "xs"]);
  });

  it("writes paddingInline alone so the inset never overflows the line above", () => {
    expect(recipe.variants?.["inset"]?.["md"]).toStrictEqual({
      paddingInline: "calc({spacing.inset.md} * var(--density, 1))",
    });
  });

  it("clones the box decoration so a fill runs onto a second line whole", () => {
    expect(recipe.base).toMatchObject({ boxDecorationBreak: "clone" });
  });

  it("tints the ink where a status meets a look that writes no fill", () => {
    expect(recipe.compoundVariants).toStrictEqual([
      {
        className: "mark--tinted",
        css: { color: "colorPalette.fg" },
        status: ["error", "info", "success", "warning"],
        variant: ["plain", "text"],
      },
    ]);
  });

  it("tracks every tag whose name ends in Mark", () => {
    expect(recipe.jsx).toStrictEqual([/Mark$/u]);
  });
});
