import { describe, expect, it } from "vitest";

import { axesOf, recipeViolations } from "@stealthscale/testing-theme";

import { recipe } from "#skeleton-text/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["SkeletonText"] })).toStrictEqual([]);
  });

  it("names its class skeleton-text", () => {
    expect(recipe.className).toBe("skeleton-text");
  });

  it("offers no axis because every length is read off the line it stands in for", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("gives each bar one line box and draws the bar inside it", () => {
    expect(recipe.base?.["& > *"]).toStrictEqual({
      backgroundClip: "content-box",
      blockSize: "1lh",
      paddingBlock: "0.15lh",
    });
  });

  it("reserves exactly the height the text it stands in for will take", () => {
    expect(recipe.base).not.toHaveProperty("gap");
  });

  it("shortens the last bar of several because a paragraph rarely fills its final line", () => {
    expect(recipe.base?.["& > *:last-child:not(:only-child)"]).toStrictEqual({ maxWidth: "80%" });
  });

  it("tracks the tag named SkeletonText", () => {
    expect(recipe.jsx).toStrictEqual([/^SkeletonText$/u]);
  });
});
