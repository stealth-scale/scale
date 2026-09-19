import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#menu/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Menu"] })).toStrictEqual([]);
  });

  it("names its class menu", () => {
    expect(recipe.className).toBe("menu");
  });

  it("draws the fifteen parts a menu is composed of", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "arrow",
      "arrowTip",
      "content",
      "contextTrigger",
      "indicator",
      "item",
      "itemGroup",
      "itemGroupLabel",
      "itemIndicator",
      "itemText",
      "positioner",
      "root",
      "separator",
      "trigger",
      "triggerItem",
    ]);
  });

  it("takes part in no layout at the root the machine does not name", () => {
    expect(recipe.base?.["root"]).toStrictEqual({ display: "contents" });
  });

  it("offers the four axes a menu takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["highlight", "inset", "size", "variant"]);
  });

  it("draws a surfaced menu at the middle size tinting the highlighted row by default", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      highlight: "tint",
      size: "md",
      variant: "surface",
    });
  });

  it("offers the three steps a list of rows is read at", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("offers the three ways the panel is set off from the page", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["elevated", "glass", "surface"]);
  });

  it("offers the three ways the row the reader is on is marked", () => {
    expect(valuesOf(recipe, "highlight")).toStrictEqual(["bar", "fill", "tint"]);
  });

  it("marks a submenu's control the same way as a row beside it", () => {
    expect(recipe.variants?.["highlight"]?.["fill"]).toStrictEqual({
      item: { _highlighted: { layerStyle: "fill.solid" } },
      triggerItem: { _highlighted: { layerStyle: "fill.solid" } },
    });
  });

  it("caps the panel at the height the machine measured for it", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      maxBlockSize: "var(--available-height)",
      overflowY: "auto",
    });
  });

  it("keeps a scroll inside the panel rather than passing it to the page", () => {
    expect(recipe.base?.["content"]).toMatchObject({ overscrollBehavior: "contain" });
  });

  it("enters from the side the machine placed the panel on", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      _closed: { animationStyle: "slide-fade.out" },
      _open: { animationStyle: "slide-fade.in" },
    });
  });

  it("stacks the panel on the dropdown rung rather than the popover rung", () => {
    expect(recipe.base?.["content"]).toMatchObject({ zIndex: "dropdown" });
  });

  it("states no width so the panel is as wide as its widest row", () => {
    expect(recipe.base?.["content"]).not.toHaveProperty("minInlineSize");
  });

  it("draws no ring on the panel the machine focuses as it opens", () => {
    expect(recipe.base?.["content"]).toMatchObject({ outline: "0" });
    expect(recipe.base?.["content"]).not.toHaveProperty("_focusVisible");
  });

  it("leaves the gutter a mark sits in on a row that carries one", () => {
    expect(recipe.base?.["item"]).toMatchObject({
      "&[data-type]": { paddingInlineStart: "var(--menu-gutter)" },
    });
  });

  it("leaves the same gutter on every row when the menu is inset", () => {
    expect(recipe.variants?.["inset"]?.["true"]).toStrictEqual({
      item: { paddingInlineStart: "var(--menu-gutter)" },
      triggerItem: { paddingInlineStart: "var(--menu-gutter)" },
    });
  });

  it("measures the gutter from the room at the edge the mark and the gap beside it", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["item"]).toMatchObject({
      "--menu-gutter": "calc({spacing.inset.sm} + {sizes.icon.sm} + {spacing.gap.sm})",
    });
  });

  it("reads a row one step below the name the menu was asked for", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["item"]).toMatchObject({
      minBlockSize: "control.sm",
      textStyle: "label.sm",
    });
  });

  it("reads a group's label one step below the rows it labels", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["itemGroupLabel"]).toMatchObject({
      textStyle: "label.xs",
    });
  });

  it("draws a row that undoes something in the error palette", () => {
    expect(recipe.base?.["item"]).toMatchObject({
      "&[data-tone=critical]": { color: "colorPalette.fg", colorPalette: "error" },
    });
  });

  it("draws a row in the neutral palette until its tone says otherwise", () => {
    expect(recipe.base?.["item"]).toMatchObject({ colorPalette: "neutral" });
  });

  it("draws the arrow over a row rather than the hand", () => {
    expect(recipe.base?.["item"]).toMatchObject({ cursor: "menuitem" });
  });

  it("places a mark in the gutter rather than in the flow of the row", () => {
    expect(recipe.base?.["itemIndicator"]).toMatchObject({ position: "absolute" });
  });

  it("cuts a label too long for its row rather than wrapping it", () => {
    expect(recipe.base?.["itemText"]).toMatchObject({
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    });
  });

  it("fills the point from the same custom property the panel states its surface as", () => {
    expect(recipe.base?.["arrow"]).toMatchObject({ "--arrow-background": "var(--menu-surface)" });
    expect(recipe.variants?.["variant"]?.["surface"]?.["content"]).toMatchObject({
      "--menu-surface": "colors.bg.popover",
    });
  });

  it("states nothing about where the panel goes", () => {
    expect(recipe.base?.["positioner"]).toStrictEqual({ position: "relative" });
  });

  it("turns the mark half a revolution while the panel is open", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({ _open: { rotate: "180deg" } });
  });

  it("turns the mark without a turn for a reader who asked for no motion", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({
      _motionReduce: { transitionDuration: "0s" },
    });
  });

  it("tracks the tag named Menu and every part under it", () => {
    expect(recipe.jsx).toStrictEqual([/^Menu(\.\w+)?$/u]);
  });
});
