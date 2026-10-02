import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#tree-view/recipe.ts";
import page from "#tree-view/tree-view.specimen.tsx";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["TreeView"] })).toStrictEqual([]);
  });

  it("sets className to tree-view", () => {
    expect(recipe.className).toBe("tree-view");
  });

  it("declares fifteen slots", () => {
    expect(recipe.slots).toHaveLength(15);
  });

  it("declares four axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["effect", "palette", "selected", "size"]);
  });

  it("defaults to subtle selected rows at md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ selected: "subtle", size: "md" });
  });

  it("declares three sizes", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("declares three selected looks", () => {
    expect(valuesOf(recipe, "selected")).toStrictEqual(["plain", "solid", "subtle"]);
  });

  it("writes the inset the gap and the mark on the root from the size", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["root"]).toMatchObject({
      "--tree-view-gap": "calc({spacing.gap.sm} * var(--density, 1))",
      "--tree-view-inset": "calc({spacing.inset.xs} * var(--density, 1))",
      "--tree-view-mark": "calc({sizes.icon.sm} * var(--density, 1))",
    });
  });

  it.each([
    { row: "{sizes.tag.md}", size: "sm" },
    { row: "{sizes.control.xs}", size: "md" },
    { row: "{sizes.control.md}", size: "lg" },
  ] as const)("sets a row at $size to $row", ({ row, size }) => {
    expect(recipe.variants?.["size"]?.[size]?.["item"]).toStrictEqual({
      minBlockSize: `calc(${row} * var(--density, 1))`,
    });
  });

  it("indents a branch's row one level per depth below the first", () => {
    expect(recipe.base?.["branchControl"]).toMatchObject({
      paddingInlineStart:
        "calc(var(--tree-view-inset) + (var(--depth) - 1) * (var(--tree-view-mark) + var(--tree-view-gap)))",
    });
  });

  it("reserves the indicator's column in an item's row", () => {
    expect(recipe.base?.["item"]).toMatchObject({
      paddingInlineStart:
        "calc(var(--tree-view-inset) + var(--depth) * (var(--tree-view-mark) + var(--tree-view-gap)))",
    });
  });

  it("places the guide on the centre of the branch's indicator", () => {
    expect(recipe.base?.["branchIndentGuide"]).toMatchObject({
      insetInlineStart:
        "calc(var(--tree-view-inset) + (var(--depth) - 1) * (var(--tree-view-mark) + var(--tree-view-gap)) + var(--tree-view-mark) / 2 - {borderWidths.hairline} / 2)",
    });
  });

  it("renders the guide as a border", () => {
    expect(recipe.base?.["branchIndentGuide"]).toMatchObject({
      borderInlineStartStyle: "solid",
      borderInlineStartWidth: "hairline",
    });
  });

  it("puts the focus ring inside a row", () => {
    expect(recipe.base?.["item"]).toMatchObject({
      _focusVisible: { outlineOffset: "calc({borderWidths.ring} * -1)" },
      focusVisibleRing: "inside",
    });
  });

  it("turns the indicator a quarter while its branch is open", () => {
    expect(recipe.base?.["branchIndicator"]).toMatchObject({ _open: { rotate: "90deg" } });
  });

  it("hides a row's text while the row is renamed", () => {
    expect(recipe.base?.["itemText"]).toMatchObject({
      "[data-renaming] > &": { display: "none" },
    });
  });

  it("sets a subtle selected row in medium weight", () => {
    expect(recipe.variants?.["selected"]?.["subtle"]?.["item"]).toMatchObject({
      _selected: { fontWeight: "medium", layerStyle: "flat.subtle" },
    });
  });

  it("fills a selected row with Highlight under forced colors", () => {
    expect(recipe.variants?.["selected"]?.["solid"]?.["branchControl"]).toMatchObject({
      _selected: {
        _highContrast: {
          background: "Highlight",
          color: "HighlightText",
          forcedColorAdjust: "none",
        },
      },
    });
  });

  it("restates Highlight on a hovered selected row more specifically than the hover fill", () => {
    expect(recipe.variants?.["selected"]?.["subtle"]?.["item"]).toMatchObject({
      _selected: {
        _hover: {
          _selected: { _highContrast: { background: "Highlight", color: "HighlightText" } },
          background: "colorPalette.muted",
        },
      },
    });
  });

  it.each([{ slot: "branchIndicator" }, { slot: "itemIndicator" }] as const)(
    "gives the $slot the row's color under forced colors",
    ({ slot }) => {
      expect(recipe.base?.[slot]).toMatchObject({ _highContrast: { color: "inherit" } });
    },
  );

  it("edges the checkbox of a selected row in HighlightText under forced colors", () => {
    expect(recipe.base?.["nodeCheckbox"]).toMatchObject({
      "[aria-selected=true] > &": { _highContrast: { borderColor: "HighlightText" } },
    });
  });

  it("fills a checked box with the palette's solid color", () => {
    expect(recipe.base?.["nodeCheckbox"]).toMatchObject({
      "&[data-state=checked], &[data-state=indeterminate]": {
        background: "colorPalette.solid",
        color: "colorPalette.contrast",
      },
    });
  });

  it("sets the palette on the root", () => {
    expect(recipe.variants?.["palette"]?.["accent"]).toStrictEqual({
      root: { colorPalette: "accent" },
    });
  });

  it("emits every palette", () => {
    expect(recipe.staticCss).toContainEqual({
      palette: ["primary", "secondary", "accent", "neutral", "info", "success", "warning", "error"],
    });
  });

  it("emits the plain look the JSON tree view sets", () => {
    expect(recipe.staticCss).toContainEqual({ selected: ["plain"] });
  });

  it("emits the sm and md sizes the JSON tree view sets", () => {
    expect(recipe.staticCss).toContainEqual({ size: ["sm", "md"] });
  });

  it("matches every TreeView tag", () => {
    expect(recipe.jsx).toStrictEqual([/^TreeView(\.\w+)?$/u]);
  });
});
