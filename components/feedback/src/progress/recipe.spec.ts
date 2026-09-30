import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import meterPage, { SKIPPED } from "#meter/meter.specimen.tsx";
import page from "#progress/progress.specimen.tsx";
import { recipe } from "#progress/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("covers every axis the meter offers in the scenes of the meter's page", () => {
    expect(uncovered(recipe, meterPage.scenes, { skip: SKIPPED })).toStrictEqual([]);
  });

  it("leaves no scene of the meter's page referring to a value the recipe has dropped", () => {
    expect(stale(recipe, meterPage.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Progress.Root", "Meter.Root"],
        parts: ["root", "label", "valueText", "track", "range", "segment", "marker"],
      }),
    ).toStrictEqual([]);
  });

  it("sets className to progress", () => {
    expect(recipe.className).toBe("progress");
  });

  it("declares animated effect layout palette shape size striped and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "animated",
      "effect",
      "layout",
      "palette",
      "shape",
      "size",
      "striped",
      "variant",
    ]);
  });

  it("defaults to a stacked primary outline bar at the middle size with round ends", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      layout: "stacked",
      palette: "primary",
      shape: "full",
      size: "md",
      variant: "outline",
    });
  });

  it("declares xs to xl on the size axis", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm", "xl", "xs"]);
  });

  it("sizes the track's thickness from the gap scale", () => {
    expect(recipe.variants?.["size"]?.["md"]).toStrictEqual({
      track: { blockSize: "calc({spacing.gap.md} * var(--density, 1))" },
    });
  });

  it("spans the track across the row below the words when stacked", () => {
    expect(recipe.variants?.["layout"]?.["stacked"]).toStrictEqual({
      root: { gridTemplateColumns: "minmax(0, 1fr) auto" },
      track: { gridColumn: "1 / -1" },
    });
  });

  it("places the track between the words when inline", () => {
    expect(recipe.variants?.["layout"]?.["inline"]).toStrictEqual({
      root: { gridTemplateColumns: "auto minmax(0, 1fr) auto" },
      track: { gridColumn: "2" },
    });
  });

  it("moves a segment across the whole track at the ambient pace while the value is unknown", () => {
    expect(recipe.base?.["range"]).toMatchObject({
      "&[data-state=indeterminate]": {
        _motionSafe: { animationDuration: "ambient", animationTimingFunction: "in-out" },
        animationStyle: "shimmer",
        backgroundSize: "50% 100%",
        inlineSize: "full",
      },
    });
  });

  it("spreads the segment over the track under reduced motion", () => {
    expect(recipe.base?.["range"]).toMatchObject({
      "&[data-state=indeterminate]": { _motionReduce: { backgroundSize: "100% 100%" } },
    });
  });

  it("moves the stripes three tiles per loop at the ambient pace", () => {
    expect(recipe.variants?.["animated"]?.["true"]).toMatchObject({
      range: {
        _motionSafe: { animationDuration: "ambient" },
        "--animate-from": "calc({sizes.4} * 3)",
        "--animate-to": "0",
        animationStyle: "shimmer",
      },
    });
  });

  it("gives the range the track's corners", () => {
    expect(recipe.base?.["range"]).toMatchObject({ borderRadius: "inherit" });
  });

  it("fills the range with Highlight in forced colors mode", () => {
    expect(recipe.base?.["range"]).toMatchObject({
      _highContrast: { backgroundColor: "Highlight", forcedColorAdjust: "none" },
    });
  });

  it("outlines the track in CanvasText in forced colors mode", () => {
    expect(recipe.base?.["track"]).toMatchObject({
      _highContrast: { outlineColor: "CanvasText", outlineStyle: "solid" },
    });
  });

  it("stops the width transition under reduced motion", () => {
    expect(recipe.base?.["range"]).toMatchObject({ _motionReduce: { transitionDuration: "0s" } });
  });
});
