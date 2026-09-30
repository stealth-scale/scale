import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#tabs/recipe.ts";
import page from "#tabs/tabs.specimen.tsx";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Tabs"] })).toStrictEqual([]);
  });

  it("sets className to tabs", () => {
    expect(recipe.className).toBe("tabs");
  });

  it("declares six slots", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "closeTrigger",
      "content",
      "indicator",
      "list",
      "root",
      "trigger",
    ]);
  });

  it("declares five axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["fitted", "justify", "palette", "size", "variant"]);
  });

  it("declares every distribution on the justify axis", () => {
    expect(valuesOf(recipe, "justify")).toStrictEqual([
      "around",
      "between",
      "center",
      "end",
      "evenly",
      "start",
    ]);
  });

  it("grows every tab equally when fitted is true", () => {
    expect(recipe.variants?.["fitted"]?.["true"]).toStrictEqual({ trigger: { flex: "1" } });
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

  it("defaults to the line look at md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "line" });
  });

  it("declares the eight shared sizes", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual([
      "2xl",
      "3xl",
      "4xl",
      "lg",
      "md",
      "sm",
      "xl",
      "xs",
    ]);
  });

  it("declares four looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["enclosed", "line", "plain", "subtle"]);
  });

  it("declares no orientation axis", () => {
    expect(axesOf(recipe)).not.toContain("orientation");
  });

  it("lays the list out as a column when vertical", () => {
    expect(recipe.base?.["list"]).toMatchObject({
      _horizontal: { flexDirection: "row" },
      _vertical: { flexDirection: "column" },
    });
  });

  it("puts the line indicator at the inline start when vertical", () => {
    expect(recipe.variants?.["variant"]?.["line"]?.["indicator"]).toMatchObject({
      _vertical: { insetInlineStart: "0" },
    });
  });

  it("rounds the indicator and stacks it at zero", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({ borderRadius: "l1", zIndex: "0" });
  });

  it("stacks every tab over the indicator", () => {
    expect(recipe.base?.["trigger"]).toMatchObject({ position: "relative", zIndex: "1" });
  });

  it.each(["line", "plain"] as const)(
    "paints the %s indicator in Highlight under forced colors",
    (look) => {
      expect(recipe.variants?.["variant"]?.[look]?.["indicator"]).toMatchObject({
        _highContrast: { background: "Highlight", forcedColorAdjust: "none" },
      });
    },
  );

  it("shows the plain indicator under forced colors alone", () => {
    expect(recipe.variants?.["variant"]?.["plain"]?.["indicator"]).toMatchObject({
      _highContrast: { display: "block" },
      display: "none",
    });
  });

  it("outlines the subtle indicator in Highlight under forced colors", () => {
    expect(recipe.variants?.["variant"]?.["subtle"]?.["indicator"]).toMatchObject({
      _highContrast: { outlineColor: "Highlight", outlineStyle: "solid" },
    });
  });

  it("starts a vertical tab's words at its inline start", () => {
    expect(recipe.base?.["trigger"]).toMatchObject({ _vertical: { justifyContent: "flex-start" } });
  });

  it("sizes a glyph in a tab to one text size", () => {
    expect(recipe.base?.["trigger"]).toMatchObject({
      "& > svg": { blockSize: "1em", flexShrink: "0", inlineSize: "1em" },
    });
  });

  it("makes the close trigger a pointer target of at least sizes.6", () => {
    expect(recipe.base?.["closeTrigger"]).toMatchObject({ minBlockSize: "6", minInlineSize: "6" });
  });

  it("takes the close trigger's room around its glyph back with negative margins", () => {
    expect(recipe.base?.["closeTrigger"]).toMatchObject({
      marginInline: "calc((1em - {sizes.6}) / 2)",
    });
  });

  it("sizes the close trigger's glyph to one text size", () => {
    expect(recipe.base?.["closeTrigger"]).toMatchObject({
      "& > svg": { blockSize: "1em", inlineSize: "1em" },
    });
  });

  it("matches every Tabs tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Tabs(\.\w+)?$/u]);
  });
});
