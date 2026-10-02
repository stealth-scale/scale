import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#progress-circle/progress-circle.specimen.tsx";
import { recipe } from "#progress-circle/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["ProgressCircle.Root"] })).toStrictEqual([]);
  });

  it("uses the class name progress-circle", () => {
    expect(recipe.className).toBe("progress-circle");
  });

  it("declares the six slots", () => {
    expect(recipe.slots).toStrictEqual(["root", "label", "circle", "track", "range", "valueText"]);
  });

  it("declares the layout palette shape size and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["layout", "palette", "shape", "size", "variant"]);
  });

  it("defaults to a round outline ring at the middle size in the primary palette", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      layout: "stacked",
      palette: "primary",
      shape: "full",
      size: "md",
      variant: "outline",
    });
  });

  it("offers xs to xl", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm", "xl", "xs"]);
  });

  it("sets the ring's width and thickness the machine reads at md", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["root"]).toStrictEqual({
      "--size": "calc({sizes.10} * var(--density, 1))",
      "--thickness": "calc({spacing.gap.xs} * var(--density, 1))",
    });
  });

  it("hides the value text at xs and sm", () => {
    expect([
      recipe.variants?.["size"]?.["xs"]?.["valueText"],
      recipe.variants?.["size"]?.["sm"]?.["valueText"],
    ]).toStrictEqual([{ display: "none" }, { display: "none" }]);
  });

  it("keeps the root as wide as its content", () => {
    expect(recipe.base?.["root"]).toMatchObject({ inlineSize: "fit" });
  });

  it("turns the ring while the value is unknown", () => {
    expect(recipe.base?.["circle"]).toMatchObject({
      "&[data-state=indeterminate]": { animationStyle: "spin" },
    });
  });

  it("dashes the whole ring for an unknown value under reduced motion", () => {
    expect(recipe.base?.["range"]).toMatchObject({
      "&[data-state=indeterminate]": {
        _motionReduce: { strokeDasharray: "var(--thickness) calc(var(--thickness) * 2)" },
      },
    });
  });

  it("styles the track as a CanvasText hairline under forced colors in every look", () => {
    const hairline = { "--thickness": "{borderWidths.hairline}", stroke: "CanvasText" };

    expect([
      recipe.variants?.["variant"]?.["subtle"]?.["track"]?.["_highContrast"],
      recipe.variants?.["variant"]?.["outline"]?.["track"]?.["_highContrast"],
    ]).toStrictEqual([hairline, hairline]);
  });

  it("tracks JSX named ProgressCircle parts", () => {
    expect(recipe.jsx).toStrictEqual([/^ProgressCircle\.\w+$/u]);
  });
});
