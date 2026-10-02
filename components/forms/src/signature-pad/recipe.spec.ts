import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#signature-pad/recipe.ts";
import page from "#signature-pad/signature-pad.specimen.tsx";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["SignaturePad.Root"] })).toStrictEqual([]);
  });

  it("uses the class name signature-pad", () => {
    expect(recipe.className).toBe("signature-pad");
  });

  it("declares the six slots", () => {
    expect(recipe.slots).toStrictEqual([
      "root",
      "label",
      "control",
      "segment",
      "guide",
      "clearTrigger",
    ]);
  });

  it("declares the palette size and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["palette", "size", "variant"]);
  });

  it("defaults to an outline pad at md in the neutral palette", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      palette: "neutral",
      size: "md",
      variant: "outline",
    });
  });

  it("offers sm to lg", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("inks the strokes in the palette's solid color", () => {
    expect(recipe.base?.["segment"]).toMatchObject({ fill: "colorPalette.solid" });
  });

  it("inks the strokes in CanvasText under forced colors", () => {
    expect(recipe.base?.["segment"]).toMatchObject({ _highContrast: { fill: "CanvasText" } });
  });

  it("dashes the guide line", () => {
    expect(recipe.base?.["guide"]).toMatchObject({ borderBlockEndStyle: "dashed" });
  });

  it("keeps a touch from scrolling the page while it draws", () => {
    expect(recipe.base?.["control"]).toMatchObject({ touchAction: "none" });
  });

  it("tracks JSX named SignaturePad parts", () => {
    expect(recipe.jsx).toStrictEqual([/^SignaturePad(\.\w+)?$/u]);
  });
});
