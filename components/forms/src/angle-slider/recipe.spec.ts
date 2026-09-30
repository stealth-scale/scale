import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#angle-slider/angle-slider.specimen.tsx";
import { recipe } from "#angle-slider/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["AngleSlider"] })).toStrictEqual([]);
  });

  it("uses the class name angle-slider", () => {
    expect(recipe.className).toBe("angle-slider");
  });

  it("declares the nine slots", () => {
    expect(recipe.slots).toStrictEqual([
      "root",
      "label",
      "control",
      "track",
      "range",
      "thumb",
      "markerGroup",
      "marker",
      "valueText",
    ]);
  });

  it("declares the palette size and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["palette", "size", "variant"]);
  });

  it("defaults to the outline look at md in the primary palette", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      palette: "primary",
      size: "md",
      variant: "outline",
    });
  });

  it("offers sm md and lg", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("turns an invalid dial to the error palette in every palette", () => {
    expect(recipe.variants?.["palette"]?.["accent"]?.["root"]).toMatchObject({
      _invalid: { colorPalette: "error" },
    });
  });

  it("sizes the dial to 8rem at md", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["root"]).toMatchObject({
      "--angle-slider-dial": "calc({sizes.32} * var(--density, 1))",
    });
  });

  it("sets the value in the heading role of its size", () => {
    expect(recipe.variants?.["size"]?.["lg"]?.["valueText"]).toStrictEqual({
      textStyle: "heading.lg",
    });
  });

  it("turns the thumb by the root's value", () => {
    expect(recipe.base?.["thumb"]).toMatchObject({
      _rtl: { rotate: "calc(calc(var(--value) * 1deg) * -1)" },
      rotate: "calc(var(--value) * 1deg)",
    });
  });

  it("keeps a thumb placed on the ring under a coarse pointer", () => {
    expect(recipe.base?.["thumb"]).toMatchObject({ _touch: { position: "absolute" } });
  });

  it("fills the ring with Canvas under forced colors in every look", () => {
    expect([
      recipe.variants?.["variant"]?.["subtle"]?.["track"]?.["_highContrast"],
      recipe.variants?.["variant"]?.["outline"]?.["track"]?.["_highContrast"],
    ]).toStrictEqual([{ backgroundColor: "Canvas" }, { backgroundColor: "Canvas" }]);
  });

  it("edges the ring with a CanvasText hairline under forced colors", () => {
    expect(recipe.base?.["track"]).toMatchObject({
      _highContrast: {
        outlineColor: "CanvasText",
        outlineStyle: "solid",
        outlineWidth: "hairline",
      },
    });
  });

  it("turns the range the other way under rtl", () => {
    expect(recipe.base?.["range"]).toMatchObject({ _rtl: { scale: "-1 1" } });
  });

  it("fills the range with Highlight under forced colors", () => {
    expect(recipe.base?.["range"]).toMatchObject({
      _highContrast: {
        backgroundImage: "conic-gradient(Highlight calc(var(--value) * 1deg), transparent 0)",
        forcedColorAdjust: "none",
      },
    });
  });

  it("tracks JSX named AngleSlider and its parts", () => {
    expect(recipe.jsx).toStrictEqual([/^AngleSlider(\.\w+)?$/u]);
  });
});
