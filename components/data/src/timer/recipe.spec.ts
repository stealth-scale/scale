import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#timer/recipe.ts";
import page from "#timer/timer.specimen.tsx";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, {
        names: [
          "Timer.ActionTrigger",
          "Timer.Area",
          "Timer.Control",
          "Timer.Item",
          "Timer.Root",
          "Timer.Separator",
        ],
        parts: ["root", "area", "item", "separator", "control", "actionTrigger"],
      }),
    ).toStrictEqual([]);
  });

  it("sets className to timer", () => {
    expect(recipe.className).toBe("timer");
  });

  it("declares four axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["effect", "palette", "size", "variant"]);
  });

  it("defaults to the plain look at md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "plain" });
  });

  it("declares every flat look", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual([
      "outline",
      "plain",
      "solid",
      "subtle",
      "surface",
    ]);
  });

  it.each([
    { size: "sm", style: "heading.sm" },
    { size: "md", style: "heading.lg" },
    { size: "lg", style: "heading.2xl" },
  ] as const)("sets the count at $size in $style", ({ size, style }) => {
    expect(recipe.variants?.["size"]?.[size]?.["item"]).toStrictEqual({ textStyle: style });
  });

  it("sets the figures in tabular numbers", () => {
    expect(recipe.base?.["area"]).toMatchObject({ fontVariantNumeric: "tabular-nums" });
  });

  it("pads a tile by the insets the root sets", () => {
    expect(recipe.variants?.["variant"]?.["subtle"]?.["item"]).toMatchObject({
      layerStyle: "flat.subtle",
      paddingBlock: "var(--timer-tile-block)",
      paddingInline: "var(--timer-tile-inline)",
    });
  });

  it("edges a tile in CanvasText under forced colors", () => {
    expect(recipe.variants?.["variant"]?.["outline"]?.["item"]).toMatchObject({
      _highContrast: { outlineColor: "CanvasText" },
    });
  });

  it("leaves a plain part without padding", () => {
    expect(recipe.variants?.["variant"]?.["plain"]?.["item"]).toStrictEqual({
      layerStyle: "flat.plain",
    });
  });

  it("removes a hidden action trigger from the layout", () => {
    expect(recipe.base?.["actionTrigger"]).toStrictEqual({ "&[hidden]": { display: "none" } });
  });

  it("sets the palette on the root", () => {
    expect(recipe.variants?.["palette"]?.["info"]).toStrictEqual({
      root: { colorPalette: "info" },
    });
  });

  it("emits every palette", () => {
    expect(recipe.staticCss).toContainEqual({
      palette: ["primary", "secondary", "accent", "neutral", "info", "success", "warning", "error"],
    });
  });

  it("matches every Timer tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Timer\.\w+$/u]);
  });
});
