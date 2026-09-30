import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { REPLACED, UNANCHORED, VIEWED } from "#navigation-menu/metrics.ts";
import page from "#navigation-menu/navigation-menu.specimen.tsx";
import { recipe } from "#navigation-menu/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["NavigationMenu"] })).toStrictEqual([]);
  });

  it("sets className to navigation-menu", () => {
    expect(recipe.className).toBe("navigation-menu");
  });

  it("declares nine slots", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "content",
      "indicator",
      "item",
      "link",
      "list",
      "root",
      "trigger",
      "viewport",
      "viewportPositioner",
    ]);
  });

  it("declares the palette and size axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["palette", "size"]);
  });

  it("defaults to md in the primary palette", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ palette: "primary", size: "md" });
  });

  it("declares three sizes", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("declares the eight semantic palettes", () => {
    expect(valuesOf(recipe, "palette")).toStrictEqual([
      "accent",
      "error",
      "info",
      "neutral",
      "primary",
      "secondary",
      "success",
      "warning",
    ]);
  });

  it("sizes the viewport's content box to the open panel", () => {
    expect(recipe.base?.["viewport"]).toMatchObject({
      blockSize: "var(--viewport-height)",
      boxSizing: "content-box",
      inlineSize: "var(--viewport-width)",
    });
  });

  it("places every panel inside the viewport in its one grid cell", () => {
    expect(recipe.base?.["content"]?.[VIEWED]).toMatchObject({
      gridArea: "1 / 1 / 2 / 2",
      position: "static",
    });
  });

  it("hides a panel of a list with an indicator at once while another item opens", () => {
    expect(recipe.base?.["content"]?.[REPLACED]).toStrictEqual({ _closed: { animation: "none" } });
  });

  it("leaves an item unpositioned in a list with an indicator", () => {
    expect(recipe.base?.["item"]).toMatchObject({
      position: "relative",
      [UNANCHORED]: { position: "static" },
    });
  });

  it("places the indicator on the open trigger's bottom edge", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({
      inlineSize: "var(--trigger-width)",
      translate:
        "var(--trigger-x) calc(var(--trigger-y) + var(--trigger-height) - {borderWidths.indicator})",
    });
  });

  it("paints the indicator CanvasText under forced colors", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({
      _highContrast: { background: "CanvasText", forcedColorAdjust: "none" },
    });
  });

  it("fills an open trigger with Highlight under forced colors", () => {
    expect(recipe.base?.["trigger"]).toMatchObject({
      _open: {
        _highContrast: {
          background: "Highlight",
          color: "HighlightText",
          forcedColorAdjust: "none",
        },
      },
    });
  });

  it("fills an open trigger under the pointer with Highlight under forced colors", () => {
    expect(recipe.base?.["trigger"]).toMatchObject({
      _hover: {
        _open: {
          _highContrast: {
            background: "Highlight",
            color: "HighlightText",
            forcedColorAdjust: "none",
          },
        },
      },
    });
  });

  it("packs a panel link's rows at its top", () => {
    expect(recipe.base?.["link"]).toMatchObject({ alignContent: "start", display: "grid" });
  });

  it("matches every NavigationMenu tag", () => {
    expect(recipe.jsx).toStrictEqual([/^NavigationMenu(\.\w+)?$/u]);
  });
});
