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

  it("references a token on every value a theme has to be able to move", () => {
    expect(recipeViolations(recipe, { names: ["SkeletonText"] })).toStrictEqual([]);
  });

  it("prefixes its generated classes with skeleton-text", () => {
    expect(recipe.className).toBe("skeleton-text");
  });

  it("declares no variants at all", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("sizes each bar to a line and a half and insets the paint inside it", () => {
    expect(recipe.base?.["& > *"]).toStrictEqual({
      backgroundClip: "content-box",
      blockSize: "1.5lh",
      paddingBlock: "0.25lh",
    });
  });

  it("cuts a quarter of a line off either end rather than a seventh", () => {
    expect(recipe.base?.["& > *"]).toMatchObject({ paddingBlock: "0.25lh" });
  });

  it("declares no gap on the column", () => {
    expect(recipe.base).not.toHaveProperty("gap");
  });

  it("caps the last of several bars at 80% width", () => {
    expect(recipe.base?.["& > *:last-child:not(:only-child)"]).toStrictEqual({ maxWidth: "80%" });
  });

  it("matches only the SkeletonText tag for jsx tracking", () => {
    expect(recipe.jsx).toStrictEqual([/^SkeletonText$/u]);
  });
});
