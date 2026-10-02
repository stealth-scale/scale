import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#action-bar/action-bar.specimen.tsx";
import { recipe } from "#action-bar/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["ActionBar"] })).toStrictEqual([]);
  });

  it("sets className to action-bar", () => {
    expect(recipe.className).toBe("action-bar");
  });

  it("declares four slots", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "closeTrigger",
      "content",
      "positioner",
      "root",
    ]);
  });

  it("declares the placement axis alone", () => {
    expect(axesOf(recipe)).toStrictEqual(["placement"]);
  });

  it("defaults to the middle of the bottom edge", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ placement: "bottom" });
  });

  it("orders the placements bottom-start bottom bottom-end", () => {
    expect(valuesOf(recipe, "placement")).toStrictEqual(["bottom", "bottom-end", "bottom-start"]);
    expect(Object.keys(recipe.variants?.["placement"] ?? {})).toStrictEqual([
      "bottom-start",
      "bottom",
      "bottom-end",
    ]);
  });

  it("fixes the positioner above the safe area at the bottom of the window", () => {
    expect(recipe.base?.["positioner"]).toMatchObject({
      insetBlockEnd: "calc({spacing.safe.bottom} + {spacing.inset.lg})",
      pointerEvents: "none",
      position: "fixed",
    });
  });

  it("keeps the bar at least one step above the toolbar's folding width", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      inlineSize: "fit-content",
      minInlineSize: "min(100%, {sizes.2xl})",
    });
  });

  it("edges the bar with a transparent hairline", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      borderColor: "transparent",
      borderStyle: "solid",
      borderWidth: "hairline",
    });
  });

  it("matches every ActionBar tag", () => {
    expect(recipe.jsx).toStrictEqual([/^ActionBar(\.\w+)?$/u]);
  });
});
