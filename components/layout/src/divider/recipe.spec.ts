import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#divider/divider.specimen.tsx";
import { recipe } from "#divider/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Divider"] })).toStrictEqual([]);
  });

  it("sets className to divider", () => {
    expect(recipe.className).toBe("divider");
  });

  it("declares one variant axis", () => {
    expect(axesOf(recipe)).toStrictEqual(["orientation"]);
  });

  it("declares two orientations on the orientation axis", () => {
    expect(valuesOf(recipe, "orientation")).toStrictEqual(["horizontal", "vertical"]);
  });

  it("defaults to a horizontal divider", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ orientation: "horizontal" });
  });

  it("reads the hairline border width at each orientation", () => {
    expect(recipe.variants?.["orientation"]).toMatchObject({
      horizontal: { borderBlockEndWidth: "hairline", borderColor: "border" },
      vertical: { borderColor: "border", borderInlineEndWidth: "hairline" },
    });
  });

  it("matches the Divider JSX tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Divider$/u]);
  });
});
