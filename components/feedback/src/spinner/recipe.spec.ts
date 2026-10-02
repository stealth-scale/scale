import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#spinner/recipe.ts";
import page from "#spinner/spinner.specimen.tsx";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to move", () => {
    expect(recipeViolations(recipe, { names: ["Spinner"] })).toStrictEqual([]);
  });

  it("sets className to spinner", () => {
    expect(recipe.className).toBe("spinner");
  });

  it("declares the effect palette size stroke and track axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["effect", "palette", "size", "stroke", "track"]);
  });

  it("defaults palette to current and size to md and stroke to indicator", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      palette: "current",
      size: "md",
      stroke: "indicator",
    });
  });

  it("declares every icon size and inherit on the size axis", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual([
      "2xl",
      "3xl",
      "4xl",
      "inherit",
      "lg",
      "md",
      "sm",
      "xl",
      "xs",
    ]);
  });

  it("sizes inherit to the font size of the surrounding text", () => {
    expect(recipe.variants?.["size"]?.["inherit"]).toStrictEqual({ boxSize: "1em" });
  });

  it("reads the three semantic strokes and the lg border width on the stroke axis", () => {
    expect(recipe.variants?.["stroke"]).toStrictEqual({
      control: { borderWidth: "control" },
      hairline: { borderWidth: "hairline" },
      heavy: { borderWidth: "lg" },
      indicator: { borderWidth: "indicator" },
    });
  });

  it("declares current beside the eight semantic palettes on the palette axis", () => {
    expect(valuesOf(recipe, "palette")).toStrictEqual([
      "accent",
      "current",
      "error",
      "info",
      "neutral",
      "primary",
      "secondary",
      "success",
      "warning",
    ]);
  });

  it("sets colorPalette to the palette of the same name", () => {
    expect(recipe.variants?.["palette"]?.["accent"]).toStrictEqual({ colorPalette: "accent" });
  });

  it("draws the arc in the palette's solid role", () => {
    expect(recipe.base).toMatchObject({ color: "colorPalette.solid" });
  });

  it("draws the arc in the surrounding ink when palette is current", () => {
    expect(recipe.variants?.["palette"]?.["current"]).toStrictEqual({ color: "currentcolor" });
  });

  it("turns through the spin animation style", () => {
    expect(recipe.base).toMatchObject({ animationStyle: "spin" });
  });

  it("draws the arc on the block start and inline end sides in the element's color", () => {
    expect(recipe.base).toMatchObject({
      borderBlockStartColor: "currentcolor",
      borderInlineEndColor: "currentcolor",
    });
  });

  it("leaves the track sides transparent when track is unset", () => {
    expect(recipe.base).toMatchObject({
      borderBlockEndColor: "transparent",
      borderInlineStartColor: "transparent",
    });
  });

  it("writes no border color shorthand in its base", () => {
    expect(recipe.base).not.toHaveProperty("borderColor");
  });

  it("draws the track sides in the palette's muted role when track is true", () => {
    expect(recipe.variants?.["track"]?.["true"]).toMatchObject({
      borderBlockEndColor: "colorPalette.muted",
      borderInlineStartColor: "colorPalette.muted",
    });
  });

  it("draws the track sides in GrayText in forced colors mode when track is true", () => {
    expect(recipe.variants?.["track"]?.["true"]?.["_highContrast"]).toStrictEqual({
      borderBlockEndColor: "GrayText",
      borderInlineStartColor: "GrayText",
    });
  });

  it("draws the arc in CanvasText and keeps the track sides transparent in forced colors mode", () => {
    expect(recipe.base?.["_highContrast"]).toStrictEqual({
      borderBlockEndColor: "transparent",
      borderBlockStartColor: "CanvasText",
      borderInlineEndColor: "CanvasText",
      borderInlineStartColor: "transparent",
      forcedColorAdjust: "none",
    });
  });

  it("declares glow and pulse on the effect axis", () => {
    expect(valuesOf(recipe, "effect")).toStrictEqual(["glow", "pulse"]);
  });

  it("applies the glow.md layer style for glow", () => {
    expect(recipe.variants?.["effect"]?.["glow"]).toStrictEqual({ layerStyle: "glow.md" });
  });

  it("runs the pulse-glow animation on the after pseudo-element for pulse", () => {
    expect(recipe.variants?.["effect"]?.["pulse"]).toMatchObject({
      _after: { animationStyle: "pulse-glow", boxShadowColor: "colorPalette.solid/50" },
    });
  });

  it("positions the element so the after pseudo-element covers it", () => {
    expect(recipe.base).toMatchObject({ position: "relative" });
  });

  it("matches JSX tag names ending in Spinner", () => {
    expect(recipe.jsx).toStrictEqual([/Spinner$/u]);
  });
});
