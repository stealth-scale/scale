import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, recipeViolations } from "@stealthscale/testing-theme";

import { recipe } from "#skeleton-text/recipe.ts";
import page from "#skeleton-text/skeleton-text.specimen.tsx";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["SkeletonText"] })).toStrictEqual([]);
  });

  it("sets className to skeleton-text", () => {
    expect(recipe.className).toBe("skeleton-text");
  });

  it("declares no variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("sizes each bar to one line height", () => {
    expect(recipe.base?.["& > *"]).toStrictEqual({ blockSize: "1lh" });
  });

  it("spaces the bars by half a line height on the column", () => {
    expect(recipe.base).toMatchObject({ gap: "0.5lh" });
  });

  it("caps the last of several bars at 80% width", () => {
    expect(recipe.base?.["& > *:last-child:not(:only-child)"]).toStrictEqual({ maxWidth: "80%" });
  });

  it("matches the SkeletonText tag only", () => {
    expect(recipe.jsx).toStrictEqual([/^SkeletonText$/u]);
  });
});
