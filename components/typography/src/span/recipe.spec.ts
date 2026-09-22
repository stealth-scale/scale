import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#span/recipe.ts";
import page from "#span/span.specimen.tsx";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Span"] })).toStrictEqual([]);
  });

  it("names its class span", () => {
    expect(recipe.className).toBe("span");
  });

  it("offers the four axes a neutral run takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["motion", "tone", "truncate", "weight"]);
  });

  it("offers no size axis so a run keeps the size of the line it sits in", () => {
    expect(axesOf(recipe)).not.toContain("size");
  });

  it("picks nothing when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({});
  });

  it("offers the four weights", () => {
    expect(valuesOf(recipe, "weight")).toStrictEqual(["bold", "medium", "normal", "semibold"]);
  });

  it("turns the run into an inline block so the overflow it hides applies", () => {
    expect(recipe.variants?.["truncate"]?.["true"]).toMatchObject({
      display: "inline-block",
      overflow: "hidden",
    });
  });

  it("tracks every tag whose name ends in Span", () => {
    expect(recipe.jsx).toStrictEqual([/Span$/u]);
  });
});
