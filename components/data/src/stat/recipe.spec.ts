import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#stat/recipe.ts";
import page from "#stat/stat.specimen.tsx";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Stat.Root"],
        parts: ["root", "label", "valueText", "valueUnit", "helpText", "indicator"],
      }),
    ).toStrictEqual([]);
  });

  it("sets className to stat", () => {
    expect(recipe.className).toBe("stat");
  });

  it("declares palette and size axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["palette", "size"]);
  });

  it("defaults to the middle size", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("declares the eight semantic palettes on the palette axis", () => {
    expect(valuesOf(recipe, "palette")).toHaveLength(8);
  });

  it("sets the figure's heading text style for each size", () => {
    expect(recipe.variants?.["size"]).toStrictEqual({
      lg: { valueText: { textStyle: "heading.2xl" } },
      md: { valueText: { textStyle: "heading.xl" } },
      sm: { valueText: { textStyle: "heading.lg" } },
    });
  });

  it("draws the indicator in the palette's text ink", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({ color: "colorPalette.fg" });
  });

  it("sets tabular numerals on the figure", () => {
    expect(recipe.base?.["valueText"]).toMatchObject({ fontVariantNumeric: "tabular-nums" });
  });

  it("clears the default margins of the list and its details", () => {
    expect(recipe.base?.["root"]).toMatchObject({ margin: "0" });
    expect(recipe.base?.["valueText"]).toMatchObject({ margin: "0" });
    expect(recipe.base?.["helpText"]).toMatchObject({ margin: "0" });
  });
});
