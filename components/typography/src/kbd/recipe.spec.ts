import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";
import { PALETTES } from "@stealthscale/theme/authoring";

import page from "#kbd/kbd.specimen.tsx";
import { recipe } from "#kbd/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Kbd.Root", "Kbd.Group"] })).toStrictEqual([]);
  });

  it("sets className to kbd", () => {
    expect(recipe.className).toBe("kbd");
  });

  it("declares three variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["palette", "size", "variant"]);
  });

  it("defaults to the raised look at md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "raised" });
  });

  it("defaults to the neutral palette", () => {
    expect(recipe.base).toMatchObject({ colorPalette: "neutral" });
  });

  it("declares three sizes on the size axis", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("declares four looks on the variant axis", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["outline", "plain", "raised", "subtle"]);
  });

  it("declares the eight semantic palettes on the palette axis", () => {
    expect(valuesOf(recipe, "palette")).toStrictEqual([...PALETTES].toSorted());
  });

  it("lists every palette under staticCss", () => {
    expect(recipe.staticCss).toStrictEqual([{ palette: [...PALETTES] }]);
  });

  it("sets the height from the tag scale one size smaller", () => {
    expect(recipe.variants?.["size"]?.["md"]).toMatchObject({
      height: "calc({sizes.tag.sm} * var(--density, 1))",
    });
  });

  it("sets the minimum width to the height", () => {
    const md = recipe.variants?.["size"]?.["md"];

    expect(md?.["minInlineSize"]).toBe(md?.["height"]);
  });

  it("centres the text in the body face", () => {
    expect(recipe.base).toMatchObject({ fontFamily: "body", justifyContent: "center" });
  });

  it("draws a 2px bottom edge in colorPalette.border in the raised look", () => {
    expect(recipe.variants?.["variant"]?.["raised"]).toMatchObject({
      borderBlockEndColor: "colorPalette.border",
      borderBlockEndWidth: "indicator",
    });
  });

  it("draws a CanvasText outline in forced colours in the subtle look", () => {
    expect(recipe.variants?.["variant"]?.["subtle"]).toMatchObject({
      _highContrast: { outlineColor: "CanvasText" },
    });
  });

  it("matches the Kbd.Root and Kbd.Group JSX tags", () => {
    expect(recipe.jsx).toStrictEqual([/^Kbd\.(?:Root|Group)$/u]);
  });
});
