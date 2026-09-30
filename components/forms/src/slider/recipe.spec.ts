import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#slider/recipe.ts";
import page from "#slider/slider.specimen.tsx";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Slider"] })).toStrictEqual([]);
  });

  it("uses the class name slider", () => {
    expect(recipe.className).toBe("slider");
  });

  it("declares the ten slots", () => {
    expect(recipe.slots).toStrictEqual([
      "root",
      "label",
      "valueText",
      "control",
      "track",
      "range",
      "thumb",
      "markerGroup",
      "marker",
      "draggingIndicator",
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

  it("turns an invalid slider to the error palette in every palette", () => {
    expect(recipe.variants?.["palette"]?.["accent"]?.["root"]).toMatchObject({
      _invalid: { colorPalette: "error" },
    });
  });

  it("sizes the thumb to the tag height at md", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["root"]).toMatchObject({
      "--slider-half": "calc(calc({sizes.tag.md} * var(--density, 1)) / 2)",
    });
  });

  it("centres a vertical thumb from the left edge in either direction", () => {
    expect(recipe.base?.["thumb"]).toMatchObject({
      _vertical: { left: "50%", translate: "-50% 0" },
    });
  });

  it("centres the dragging indicator from the left edge in either direction", () => {
    expect(recipe.base?.["draggingIndicator"]).toMatchObject({ left: "50%", translate: "-50% 0" });
  });

  it("fills the range with Highlight under forced colors", () => {
    expect(recipe.base?.["range"]).toMatchObject({
      _highContrast: { background: "Highlight", forcedColorAdjust: "none" },
    });
  });

  it("tracks JSX named Slider and its parts", () => {
    expect(recipe.jsx).toStrictEqual([/^Slider(\.\w+)?$/u]);
  });
});
