import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#steps/recipe.ts";
import page from "#steps/steps.specimen.tsx";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Steps"] })).toStrictEqual([]);
  });

  it("sets className to steps", () => {
    expect(recipe.className).toBe("steps");
  });

  it("declares twelve slots", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "content",
      "description",
      "indicator",
      "item",
      "list",
      "nextTrigger",
      "prevTrigger",
      "root",
      "separator",
      "status",
      "title",
      "trigger",
    ]);
  });

  it("declares four axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["labelPlacement", "palette", "size", "variant"]);
  });

  it("defaults to solid discs at md in neutral with the titles beside them", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      labelPlacement: "beside",
      palette: "neutral",
      size: "md",
      variant: "solid",
    });
  });

  it("declares three sizes", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("declares two looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["solid", "subtle"]);
  });

  it("declares two title placements", () => {
    expect(valuesOf(recipe, "labelPlacement")).toStrictEqual(["below", "beside"]);
  });

  it("sets the palette on the root", () => {
    expect(recipe.variants?.["palette"]?.["warning"]).toStrictEqual({
      root: { colorPalette: "warning" },
    });
  });

  it("emits every palette", () => {
    expect(recipe.staticCss).toContainEqual({
      palette: ["primary", "secondary", "accent", "neutral", "info", "success", "warning", "error"],
    });
  });

  it("writes the disc's side and the gutter on the root from the size", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["root"]).toStrictEqual({
      "--steps-disc": "calc({sizes.control.md} * var(--density, 1))",
      "--steps-gutter": "calc({spacing.gap.md} * var(--density, 1))",
      gap: "calc({spacing.inset.md} * var(--density, 1))",
    });
  });

  it("sizes the discs from the root's custom property", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({
      blockSize: "var(--steps-disc)",
      inlineSize: "var(--steps-disc)",
    });
  });

  it("sizes an icon in a disc one step below the size", () => {
    expect(recipe.variants?.["size"]?.["lg"]?.["indicator"]).toMatchObject({
      "& > svg": { boxSize: "calc({sizes.icon.md} * var(--density, 1))" },
    });
  });

  it("leaves two insets below every vertical item but the last", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["item"]).toStrictEqual({
      _vertical: {
        _last: { paddingBlockEnd: "0" },
        paddingBlockEnd: "calc(calc({spacing.inset.md} * 2) * var(--density, 1))",
      },
    });
  });

  it("renders a rule as a border in the border color", () => {
    expect(recipe.base?.["separator"]).toMatchObject({
      _horizontal: { borderBlockStartWidth: "{borderWidths.indicator}" },
      _vertical: { borderInlineStartWidth: "{borderWidths.indicator}" },
      borderColor: "border",
    });
  });

  it("lays the items out at their natural width while the list measures", () => {
    expect(recipe.base?.["item"]).toMatchObject({
      _horizontal: { "[data-measuring] > &": { flex: "0 0 auto" } },
    });
  });

  it("stacks every item's disc over its words below", () => {
    expect(recipe.variants?.["labelPlacement"]?.["below"]?.["item"]).toStrictEqual({
      _horizontal: { _last: { flex: "1 0 0" }, flexDirection: "column", textAlign: "center" },
    });
  });

  it("moves the titles below the discs in a crowded list beside", () => {
    expect(recipe.variants?.["labelPlacement"]?.["beside"]?.["item"]).toStrictEqual({
      _horizontal: {
        "[data-crowded] > &": {
          _last: { flex: "1 0 0" },
          flexDirection: "column",
          textAlign: "center",
        },
      },
    });
  });

  it("runs a rule below from one disc to the next", () => {
    expect(recipe.variants?.["labelPlacement"]?.["below"]?.["separator"]).toStrictEqual({
      _horizontal: {
        insetBlockStart: "calc(var(--steps-disc) / 2 - {borderWidths.indicator} / 2)",
        insetInlineEnd: "calc(-50% + var(--steps-disc) / 2 + var(--steps-gutter))",
        insetInlineStart: "calc(50% + var(--steps-disc) / 2 + var(--steps-gutter))",
        marginInlineEnd: "0",
        position: "absolute",
      },
    });
  });

  it("fills a completed solid disc with the palette's solid color", () => {
    expect(recipe.variants?.["variant"]?.["solid"]?.["indicator"]).toMatchObject({
      "&[data-complete]": { background: "colorPalette.solid", color: "colorPalette.contrast" },
    });
  });

  it("rings the current solid disc in the palette's solid color", () => {
    expect(recipe.variants?.["variant"]?.["solid"]?.["indicator"]).toMatchObject({
      "&[data-current]": { borderColor: "colorPalette.solid", color: "colorPalette.fg" },
    });
  });

  it("fills the subtle discs from the palette's subtle muted and emphasized roles", () => {
    expect(recipe.variants?.["variant"]?.["subtle"]?.["indicator"]).toMatchObject({
      "&[data-complete]": { background: "colorPalette.muted" },
      "&[data-current]": { background: "colorPalette.emphasized" },
      "&[data-incomplete]": { background: "colorPalette.subtle" },
    });
  });

  it("fills a completed disc with Highlight under forced colors", () => {
    expect(recipe.variants?.["variant"]?.["subtle"]?.["indicator"]).toMatchObject({
      "&[data-complete]": {
        _highContrast: { background: "Highlight", forcedColorAdjust: "none" },
      },
    });
  });

  it("rings the current disc with Highlight under forced colors", () => {
    expect(recipe.variants?.["variant"]?.["solid"]?.["indicator"]).toMatchObject({
      "&[data-current]": {
        _highContrast: {
          background: "Canvas",
          borderColor: "Highlight",
          forcedColorAdjust: "none",
        },
      },
    });
  });

  it("colors the rule after a completed step from the palette", () => {
    expect(recipe.variants?.["variant"]?.["solid"]?.["separator"]).toMatchObject({
      "&[data-complete]": { borderColor: "colorPalette.solid" },
    });
  });

  it("hides the status words visually", () => {
    expect(recipe.base?.["status"]).toStrictEqual({ srOnly: true });
  });

  it("mutes the title of a later step", () => {
    expect(recipe.base?.["title"]).toMatchObject({ "&[data-incomplete]": { color: "fg.muted" } });
  });

  it("matches every Steps tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Steps(\.\w+)?$/u]);
  });
});
