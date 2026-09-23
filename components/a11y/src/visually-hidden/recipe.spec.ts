import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#visually-hidden/recipe.ts";
import page from "#visually-hidden/visually-hidden.specimen.tsx";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["VisuallyHidden"] })).toStrictEqual([]);
  });

  it("sets className to visually-hidden", () => {
    expect(recipe.className).toBe("visually-hidden");
  });

  it("sets srOnly as the only declaration in its base", () => {
    expect(recipe.base).toStrictEqual({ srOnly: true });
  });

  it("declares one variant axis", () => {
    expect(axesOf(recipe)).toStrictEqual(["focusable"]);
  });

  it("declares true as the only value of focusable", () => {
    expect(valuesOf(recipe, "focusable")).toStrictEqual(["true"]);
  });

  it("fixes the element under focus-visible when focusable is true", () => {
    expect(recipe.variants?.["focusable"]).toMatchObject({
      true: { _focusVisible: { clip: "auto", position: "fixed", zIndex: "skipNav" } },
    });
  });

  it("sets no srOnly under focus-visible when focusable is true", () => {
    expect(recipe.variants?.["focusable"]?.["true"]?.["_focusVisible"]).not.toHaveProperty(
      "srOnly",
    );
  });

  it("matches the VisuallyHidden JSX tag", () => {
    expect(recipe.jsx).toStrictEqual([/^VisuallyHidden$/u]);
  });
});
