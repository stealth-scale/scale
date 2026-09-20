import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import {
  FIELDS,
  fieldVariants,
  FLATS,
  flatVariants,
  HIGHLIGHTS,
  highlightVariants,
  LOOKS,
  lookVariants,
  wrappedFieldVariants,
} from "#authoring/recipes/looks.ts";

describe("lookVariants", () => {
  it("lists six looks", () => {
    expect(LOOKS).toHaveLength(6);
  });

  it("reads a layer style for each look it was handed", () => {
    expect(lookVariants(["solid", "outline"])).toStrictEqual({
      outline: { layerStyle: "outline.solid" },
      solid: { layerStyle: "fill.solid" },
    });
  });

  it("reads a fill for every look but the outline", () => {
    expect(lookVariants(LOOKS)).toStrictEqual({
      ghost: { layerStyle: "fill.ghost" },
      outline: { layerStyle: "outline.solid" },
      plain: { layerStyle: "fill.plain" },
      solid: { layerStyle: "fill.solid" },
      subtle: { layerStyle: "fill.subtle" },
      surface: { layerStyle: "fill.surface" },
    });
  });

  it("reads a layer style the foundation defines for every look", () => {
    const recipe = defineRecipe({ className: "x", variants: { variant: lookVariants(LOOKS) } });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });
});

describe("flatVariants", () => {
  it("lists five looks", () => {
    expect(FLATS).toHaveLength(5);
  });

  it("leaves ghost out because a look that never repaints leaves it identical to plain", () => {
    expect(FLATS).not.toContain("ghost");
  });

  it("reads the flat layer style of each look's own name", () => {
    expect(flatVariants(FLATS)).toStrictEqual({
      outline: { layerStyle: "flat.outline" },
      plain: { layerStyle: "flat.plain" },
      solid: { layerStyle: "flat.solid" },
      subtle: { layerStyle: "flat.subtle" },
      surface: { layerStyle: "flat.surface" },
    });
  });

  it("offers every look where a recipe names none", () => {
    expect(Object.keys(flatVariants()).toSorted()).toStrictEqual([...FLATS].toSorted());
  });

  it("reads a layer style the foundation defines for every flat look", () => {
    const recipe = defineRecipe({ className: "x", variants: { variant: flatVariants(FLATS) } });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });
});

describe("fieldVariants", () => {
  it("lists three looks", () => {
    expect(FIELDS).toHaveLength(3);
  });

  it("reads the field layer style of each look's own name", () => {
    expect(fieldVariants(FIELDS)).toStrictEqual({
      flushed: { layerStyle: "field.flushed" },
      outline: { layerStyle: "field.outline" },
      subtle: { layerStyle: "field.subtle" },
    });
  });

  it("reads a layer style for each look it was handed", () => {
    expect(fieldVariants(["outline"])).toStrictEqual({ outline: { layerStyle: "field.outline" } });
  });

  it("offers every look where a recipe names none", () => {
    expect(Object.keys(fieldVariants()).toSorted()).toStrictEqual([...FIELDS].toSorted());
  });

  it("reads a layer style the foundation defines for every field look", () => {
    const recipe = defineRecipe({ className: "x", variants: { variant: fieldVariants(FIELDS) } });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });
});

const FOUND = {
  _highContrast: {
    outlineColor: "Highlight",
    outlineOffset: "calc({borderWidths.indicator} * -1)",
    outlineStyle: "solid",
    outlineWidth: "indicator",
  },
};

describe("wrappedFieldVariants", () => {
  it("reads the wrapped layer style of each look", () => {
    expect(wrappedFieldVariants(["outline"])).toStrictEqual({
      outline: { layerStyle: "field.wrapped.outline" },
    });
  });

  it("offers the same three looks a field offers", () => {
    expect(Object.keys(wrappedFieldVariants()).toSorted()).toStrictEqual([...FIELDS].toSorted());
  });

  it("reads a layer style the foundation defines for every wrapped look", () => {
    const recipe = defineRecipe({
      className: "x",
      variants: { variant: wrappedFieldVariants(FIELDS) },
    });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });
});

describe("highlightVariants", () => {
  it("lists three marks", () => {
    expect(HIGHLIGHTS).toHaveLength(3);
  });

  it("puts every mark under the highlighted condition", () => {
    expect(highlightVariants(["tint", "fill"])).toStrictEqual({
      fill: { _highlighted: { ...FOUND, layerStyle: "fill.solid" } },
      tint: { _highlighted: { ...FOUND, layerStyle: "fill.muted" } },
    });
  });

  it("tints the row behind the bar so the mark is carried twice over", () => {
    expect(highlightVariants(["bar"])).toStrictEqual({
      bar: {
        _highlighted: {
          ...FOUND,
          background: "colorPalette.muted",
          layerStyle: "indicator.start",
        },
      },
    });
  });

  it("finds the marked row with a line where the display replaces every fill", () => {
    expect(highlightVariants(["tint"])["tint"]).toMatchObject({
      _highlighted: {
        _highContrast: {
          outlineColor: "Highlight",
          outlineOffset: "calc({borderWidths.indicator} * -1)",
          outlineStyle: "solid",
          outlineWidth: "indicator",
        },
      },
    });
  });

  it("offers every mark where a recipe names none", () => {
    expect(Object.keys(highlightVariants()).toSorted()).toStrictEqual([...HIGHLIGHTS].toSorted());
  });

  it("puts every mark under the current page where a recipe asks for it", () => {
    expect(highlightVariants(["tint", "bar"], "_currentPage")).toStrictEqual({
      bar: {
        _currentPage: {
          ...FOUND,
          background: "colorPalette.muted",
          layerStyle: "indicator.start",
        },
      },
      tint: { _currentPage: { ...FOUND, layerStyle: "fill.muted" } },
    });
  });

  it("draws the fill mark the same way under the current page", () => {
    expect(highlightVariants(["fill"], "_currentPage")).toStrictEqual({
      fill: { _currentPage: { ...FOUND, layerStyle: "fill.solid" } },
    });
  });

  it("reads a layer style the foundation defines for every mark", () => {
    const recipe = defineRecipe({
      className: "x",
      variants: { highlight: highlightVariants(HIGHLIGHTS) },
    });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });
});
