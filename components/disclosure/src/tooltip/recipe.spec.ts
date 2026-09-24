import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#tooltip/recipe.ts";
import page from "#tooltip/tooltip.specimen.tsx";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Tooltip"] })).toStrictEqual([]);
  });

  it("sets className to tooltip", () => {
    expect(recipe.className).toBe("tooltip");
  });

  it("declares six slots", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "arrow",
      "arrowTip",
      "content",
      "positioner",
      "root",
      "trigger",
    ]);
  });

  it("sets display contents on the root", () => {
    expect(recipe.base?.["root"]).toStrictEqual({ display: "contents" });
  });

  it("declares the size and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["size", "variant"]);
  });

  it("defaults to the inverted look at md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "inverted" });
  });

  it("declares the eight shared sizes", () => {
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

  it("declares two looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["inverted", "surface"]);
  });

  it("fills the arrow from --tooltip-surface", () => {
    expect(recipe.base?.["arrow"]).toMatchObject({
      "--arrow-background": "var(--tooltip-surface)",
    });
    expect(recipe.variants?.["variant"]?.["inverted"]?.["content"]).toMatchObject({
      "--tooltip-surface": "colors.bg.inverted",
    });
  });

  it("scales the content from --transform-origin", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      transformOrigin: "var(--transform-origin)",
    });
  });

  it("sets no offset on the positioner", () => {
    expect(recipe.base?.["positioner"]).toStrictEqual({ position: "relative" });
  });

  it("sets the tooltip z-index on the content", () => {
    expect(recipe.base?.["content"]).toMatchObject({ zIndex: "tooltip" });
  });

  it("sets no z-index on the positioner", () => {
    expect(recipe.base?.["positioner"]).not.toHaveProperty("zIndex");
  });

  it("wraps the content at maxWidth xs", () => {
    expect(recipe.base?.["content"]).toMatchObject({ maxWidth: "xs", textWrap: "pretty" });
  });

  it("matches every Tooltip tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Tooltip(\.\w+)?$/u]);
  });
});
