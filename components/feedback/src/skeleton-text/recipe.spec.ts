import { describe, expect, it } from "vitest";

import { axesOf, recipeViolations } from "@stealthscale/testing-theme";

import { recipe } from "#skeleton-text/recipe.ts";

describe("recipe", () => {
  it("references a token on every value a theme has to be able to move", () => {
    expect(recipeViolations(recipe, { names: ["SkeletonText"] })).toStrictEqual([]);
  });

  it("prefixes its generated classes with skeleton-text", () => {
    expect(recipe.className).toBe("skeleton-text");
  });

  it("declares no variants at all", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("sizes each bar to one line box and insets the paint inside it", () => {
    expect(recipe.base?.["& > *"]).toStrictEqual({
      backgroundClip: "content-box",
      blockSize: "1lh",
      paddingBlock: "0.15lh",
    });
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
