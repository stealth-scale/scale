import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";
import { PALETTES } from "@stealthscale/theme/authoring";

import page from "#badge/badge.specimen.tsx";
import { recipe } from "#badge/recipe.ts";
import { chipSize } from "#chip.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Badge"] })).toStrictEqual([]);
  });

  it("sets className to badge", () => {
    expect(recipe.className).toBe("badge");
  });

  it("declares the effect palette radius size and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["effect", "palette", "radius", "size", "variant"]);
  });

  it("defaults to the subtle look at the md size with the l2 corner", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ radius: "l2", size: "md", variant: "subtle" });
  });

  it("reads the primary palette in the base", () => {
    expect(recipe.base).toMatchObject({ colorPalette: "primary" });
  });

  it("declares every semantic palette on the palette axis", () => {
    expect(valuesOf(recipe, "palette")).toStrictEqual([...PALETTES].toSorted());
  });

  it("lists every palette in staticCss", () => {
    expect(recipe.staticCss).toStrictEqual([{ palette: [...PALETTES] }]);
  });

  it("declares sm md lg and xl on the size axis", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm", "xl"]);
  });

  it("reads the chip metrics at md", () => {
    expect(recipe.variants?.["size"]?.["md"]).toStrictEqual(chipSize("md"));
  });

  it("declares the five flat looks on the variant axis", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual([
      "outline",
      "plain",
      "solid",
      "subtle",
      "surface",
    ]);
  });

  it("declares glow and pulse on the effect axis", () => {
    expect(valuesOf(recipe, "effect")).toStrictEqual(["glow", "pulse"]);
  });

  it("declares every corner on the radius axis", () => {
    expect(valuesOf(recipe, "radius")).toStrictEqual(["full", "l1", "l2", "l3"]);
  });

  it("outlines the badge in CanvasText under forced colors", () => {
    expect(recipe.base).toMatchObject({
      _highContrast: {
        outlineColor: "CanvasText",
        outlineStyle: "solid",
        outlineWidth: "hairline",
      },
    });
  });

  it("matches JSX tag names ending in Badge", () => {
    expect(recipe.jsx).toStrictEqual([/Badge$/u]);
  });
});
