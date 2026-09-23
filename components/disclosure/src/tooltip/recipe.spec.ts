import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#tooltip/recipe.ts";
import page from "#tooltip/tooltip.specimen.tsx";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Tooltip"] })).toStrictEqual([]);
  });

  it("names its class tooltip", () => {
    expect(recipe.className).toBe("tooltip");
  });

  it("draws the six parts a tooltip is composed of", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "arrow",
      "arrowTip",
      "content",
      "positioner",
      "root",
      "trigger",
    ]);
  });

  it("takes part in no layout at the root the machine does not name", () => {
    expect(recipe.base?.["root"]).toStrictEqual({ display: "contents" });
  });

  it("offers the two axes a tooltip takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["size", "variant"]);
  });

  it("draws an inverted tooltip at the middle size by default", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "inverted" });
  });

  it("offers the eight sizes every component shares", () => {
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

  it("offers the two ways the box is set off from the page", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["inverted", "surface"]);
  });

  it("fills the point from the same custom property the box states its surface as", () => {
    expect(recipe.base?.["arrow"]).toMatchObject({
      "--arrow-background": "var(--tooltip-surface)",
    });
    expect(recipe.variants?.["variant"]?.["inverted"]?.["content"]).toMatchObject({
      "--tooltip-surface": "colors.bg.inverted",
    });
  });

  it("grows from the corner the machine placed the box against", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      transformOrigin: "var(--transform-origin)",
    });
  });

  it("states nothing about where the box goes", () => {
    expect(recipe.base?.["positioner"]).toStrictEqual({ position: "relative" });
  });

  it("stands the box on the tooltip rung", () => {
    expect(recipe.base?.["content"]).toMatchObject({ zIndex: "tooltip" });
  });

  it("writes the rung where the machine reads it rather than on the positioner", () => {
    expect(recipe.base?.["positioner"]).not.toHaveProperty("zIndex");
  });

  it("caps the box narrow so a long hint wraps", () => {
    expect(recipe.base?.["content"]).toMatchObject({ maxWidth: "xs", textWrap: "pretty" });
  });

  it("tracks the tag named Tooltip and every part under it", () => {
    expect(recipe.jsx).toStrictEqual([/^Tooltip(\.\w+)?$/u]);
  });
});
