import { describe, expect, it } from "vitest";

import { axesOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#visually-hidden/recipe.ts";

describe("recipe", () => {
  it("reports no violation across the shared recipe checks", () => {
    expect(recipeViolations(recipe, { names: ["VisuallyHidden"] })).toStrictEqual([]);
  });

  it("sets className to visually-hidden", () => {
    expect(recipe.className).toBe("visually-hidden");
  });

  it("sets srOnly as the only declaration in its base", () => {
    expect(recipe.base).toStrictEqual({ srOnly: true });
  });

  it("declares focusable as its only variant", () => {
    expect(axesOf(recipe)).toStrictEqual(["focusable"]);
  });

  it("declares true as the only value of focusable", () => {
    expect(valuesOf(recipe, "focusable")).toStrictEqual(["true"]);
  });

  it("cancels srOnly under focus-visible when focusable is true", () => {
    expect(recipe.variants?.["focusable"]).toMatchObject({
      true: { _focusVisible: { position: "fixed", srOnly: false, zIndex: "skipNav" } },
    });
  });

  it("matches the VisuallyHidden tag with its jsx pattern", () => {
    expect(recipe.jsx).toStrictEqual([/^VisuallyHidden$/u]);
  });
});
