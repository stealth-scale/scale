import { describe, expect, it } from "vitest";

import {
  axesOf,
  defaultsOf,
  recipeViolations,
  scaleOf,
  valuesOf,
} from "@stealthscale/testing-theme";

import { recipe } from "#button/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Button", "IconButton"] })).toStrictEqual([]);
  });

  it("names its class button", () => {
    expect(recipe.className).toBe("button");
  });

  it("offers the six axes a button takes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "effect",
      "elevation",
      "shape",
      "size",
      "status",
      "variant",
    ]);
  });

  it("draws the middle size in the solid look when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "solid" });
  });

  it("offers the eight control sizes", () => {
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

  it("offers the six looks and the glass", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual([
      "ghost",
      "glass",
      "outline",
      "plain",
      "solid",
      "subtle",
      "surface",
    ]);
  });

  it("offers the four statuses", () => {
    expect(valuesOf(recipe, "status")).toStrictEqual(["error", "info", "success", "warning"]);
  });

  it("offers the square shape", () => {
    expect(valuesOf(recipe, "shape")).toStrictEqual(["square"]);
  });

  it("offers the glow as an effect", () => {
    expect(valuesOf(recipe, "effect")).toStrictEqual(["glow"]);
  });

  it("ripples under every press and holds its box still", () => {
    expect(recipe.base).toMatchObject({ layerStyle: "ripple" });
    expect(recipe.base).not.toHaveProperty("_active");
  });

  it("offers a raised and a floating elevation", () => {
    expect(valuesOf(recipe, "elevation")).toStrictEqual(["floating", "raised"]);
  });

  it("drops the shadow of an elevated button as it is pressed", () => {
    expect(scaleOf(recipe, "elevation", "_active", ["raised", "floating"])).toStrictEqual([
      { boxShadow: "none" },
      { boxShadow: "sm" },
    ]);
  });

  it("clears the inset a leading mark takes off a square button", () => {
    expect(recipe.compoundVariants).toStrictEqual([
      {
        className: "button--squared",
        css: { "&:has(> svg:first-child)": { paddingInline: "0" } },
        shape: "square",
      },
    ]);
  });

  it("fills a button that stays pressed against the attribute that says so", () => {
    expect(recipe.base?.["_pressed"]).toStrictEqual({
      background: "colorPalette.subtle",
      borderColor: "colorPalette.border",
      color: "colorPalette.fg",
    });
  });

  it("tracks every tag whose name ends in Button", () => {
    expect(recipe.jsx).toStrictEqual([/Button$/u]);
  });
});
