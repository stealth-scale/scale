import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#rating-group/rating-group.specimen.tsx";
import { recipe } from "#rating-group/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["RatingGroup"] })).toStrictEqual([]);
  });

  it("uses the class name rating-group", () => {
    expect(recipe.className).toBe("rating-group");
  });

  it("declares the seven slots", () => {
    expect(recipe.slots).toStrictEqual([
      "root",
      "label",
      "control",
      "item",
      "itemIndicator",
      "itemEmpty",
      "itemFilled",
    ]);
  });

  it("declares the palette and size axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["palette", "size"]);
  });

  it("defaults to md in the primary palette", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ palette: "primary", size: "md" });
  });

  it("offers sm md and lg", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("keeps an item at least 24px square at every size", () => {
    expect(recipe.variants?.["size"]?.["sm"]?.["root"]).toMatchObject({
      "--rating-group-side": "max({sizes.6}, calc({sizes.tag.sm} * var(--density, 1)))",
    });
  });

  it("widens an item to a 40px square under a coarse pointer", () => {
    expect(recipe.base?.["item"]).toMatchObject({
      _touch: { blockSize: "control.md", inlineSize: "control.md" },
    });
  });

  it("paints the empty glyph in the emphasized border ink", () => {
    expect(recipe.base?.["itemEmpty"]).toMatchObject({ color: "border.emphasized" });
  });

  it("clips the filled glyph of a half item to its right half under rtl", () => {
    expect(recipe.base?.["itemFilled"]).toMatchObject({
      ".rating-group__item[data-half][dir=rtl] &": { clipPath: "inset(0 0 0 50%)" },
    });
  });

  it("fills the glyph with Highlight under forced colors", () => {
    expect(recipe.base?.["itemFilled"]).toMatchObject({
      _highContrast: { color: "Highlight", forcedColorAdjust: "none" },
    });
  });

  it("turns an invalid rating to the error palette in every palette", () => {
    expect(recipe.variants?.["palette"]?.["accent"]?.["root"]).toMatchObject({
      _invalid: { colorPalette: "error" },
    });
  });

  it("tracks JSX named RatingGroup and its parts", () => {
    expect(recipe.jsx).toStrictEqual([/^RatingGroup(\.\w+)?$/u]);
  });
});
