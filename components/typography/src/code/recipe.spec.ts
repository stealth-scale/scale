import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";
import { PALETTES } from "@stealthscale/theme/authoring";

import page from "#code/code.specimen.tsx";
import { recipe } from "#code/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Code"] })).toStrictEqual([]);
  });

  it("sets className to code", () => {
    expect(recipe.className).toBe("code");
  });

  it("declares three variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["palette", "size", "variant"]);
  });

  it("defaults to the subtle look at md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "subtle" });
  });

  it("defaults to the neutral palette", () => {
    expect(recipe.base).toMatchObject({ colorPalette: "neutral" });
  });

  it("declares two code sizes on the size axis", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["md", "sm"]);
  });

  it("declares five looks on the variant axis", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual([
      "outline",
      "plain",
      "solid",
      "subtle",
      "surface",
    ]);
  });

  it("sets no inline padding in the plain look", () => {
    expect(recipe.variants?.["variant"]?.["plain"]).toStrictEqual({
      layerStyle: "flat.plain",
      paddingInline: "0",
    });
  });

  it.each(["solid", "subtle"] as const)(
    "draws a CanvasText outline in forced colours in the %s look",
    (look) => {
      expect(recipe.variants?.["variant"]?.[look]).toMatchObject({
        _highContrast: { outlineColor: "CanvasText" },
      });
    },
  );

  it("declares the eight semantic palettes on the palette axis", () => {
    expect(valuesOf(recipe, "palette")).toStrictEqual([...PALETTES].toSorted());
  });

  it("lists every palette under staticCss", () => {
    expect(recipe.staticCss).toStrictEqual([{ palette: [...PALETTES] }]);
  });

  it("matches every JSX tag that ends in Code", () => {
    expect(recipe.jsx).toStrictEqual([/Code$/u]);
  });
});
