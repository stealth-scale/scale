import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import {
  axesOf,
  defaultsOf,
  recipeViolations,
  scaleOf,
  valuesOf,
} from "@stealthscale/testing-theme";

import page from "#radio-card/radio-card.specimen.tsx";
import { recipe } from "#radio-card/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, {
        names: ["RadioCard"],
        parts: [
          "root",
          "label",
          "item",
          "itemContent",
          "itemText",
          "itemDescription",
          "itemIndicator",
          "itemAddon",
        ],
      }),
    ).toStrictEqual([]);
  });

  it("uses the class name radio-card", () => {
    expect(recipe.className).toBe("radio-card");
  });

  it("declares five axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["align", "layout", "palette", "size", "variant"]);
  });

  it("defaults to outline cards at size md with the circle beside the words", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      align: "start",
      layout: "inline",
      palette: "primary",
      size: "md",
      variant: "outline",
    });
  });

  it("offers four looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["outline", "solid", "subtle", "surface"]);
  });

  it("offers the eight palettes", () => {
    expect(valuesOf(recipe, "palette")).toHaveLength(8);
  });

  it("keeps the circle's height under a coarse pointer", () => {
    expect(recipe.base?.["itemIndicator"]).not.toHaveProperty("_touch");
  });

  it("renders the focus ring on the card and none on the circle", () => {
    expect([
      recipe.base?.["item"]?.["focusVisibleRing"],
      recipe.base?.["itemIndicator"]?.["focusVisibleRing"],
    ]).toStrictEqual(["outside", "none"]);
  });

  it("lays a horizontal set out in columns of at least 12rem", () => {
    expect(recipe.base?.["root"]?.["_horizontal"]).toStrictEqual({
      gridTemplateColumns: "repeat(auto-fit, minmax(min({sizes.48}, 100%), 1fr))",
    });
  });

  it("puts the circle above the words on a stacked card", () => {
    expect(scaleOf(recipe, "layout", "itemIndicator", ["stacked"])[0]).toStrictEqual({
      gridColumn: "1",
      gridRow: "1",
    });
  });

  it("renders the circle of a checked solid card on the panel color", () => {
    expect(scaleOf(recipe, "variant", "itemIndicator", ["solid"])[0]).toMatchObject({
      _checked: { background: "bg.panel", color: "colorPalette.solid" },
    });
  });

  it("sets a checked card's edge to Highlight under forced colors on every look", () => {
    expect(recipe.compoundVariants?.[0]).toMatchObject({
      css: { item: { _highContrast: { _checked: { borderColor: "Highlight" } } } },
      variant: ["solid", "subtle", "surface", "outline"],
    });
  });

  it("restates the invalid edge on the subtle look", () => {
    expect(scaleOf(recipe, "variant", "item", ["subtle"])[0]).toMatchObject({
      _invalid: { borderColor: "border.error" },
    });
  });

  it("tracks JSX named RadioCard and its parts", () => {
    expect(recipe.jsx).toStrictEqual([/^RadioCard(\.\w+)?$/u]);
  });
});
