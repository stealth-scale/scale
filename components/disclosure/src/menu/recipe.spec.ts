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

  it("draws the nineteen parts a menu is composed of", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "arrow",
      "arrowTip",
      "content",
      "contextTrigger",
      "indicator",
      "item",
      "itemCommand",
      "itemDescription",
      "itemGroup",
      "itemGroupLabel",
      "itemIndicator",
      "itemLines",
      "itemMark",
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
    expect(recipe.variants?.["highlight"]?.["fill"]).toMatchObject({
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

  it("opens the panel at least as wide as its control and as wide as its widest row", () => {
    expect(recipe.base?.["content"]).toMatchObject({ minInlineSize: "var(--reference-width)" });
    expect(recipe.base?.["content"]).not.toHaveProperty("inlineSize");
  });

  it("draws no ring on the panel the machine focuses as it opens", () => {
    expect(recipe.base?.["content"]).toMatchObject({ outline: "0" });
    expect(recipe.base?.["content"]).not.toHaveProperty("_focusVisible");
  });

  it("leaves no gutter on a row that carries a tick", () => {
    expect(recipe.base?.["item"]).not.toHaveProperty("&[data-type]");
  });

  it("leaves the same gutter on every row when the menu is inset", () => {
    expect(recipe.variants?.["inset"]?.["true"]).toStrictEqual({
      item: { paddingInlineStart: "var(--menu-gutter)" },
      triggerItem: { paddingInlineStart: "var(--menu-gutter)" },
    });
  });

  it("measures the gutter from the room at the edge the mark and the gap beside it", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["item"]).toMatchObject({
      "--menu-gutter": "calc({spacing.inset.sm} + {sizes.icon.sm} + {spacing.gap.md})",
    });
  });

  it("reads a row one step below the name the menu was asked for and rounds its corners", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["item"]).toStrictEqual({
      "--menu-gutter": "calc({spacing.inset.sm} + {sizes.icon.sm} + {spacing.gap.md})",
      gap: "calc({spacing.gap.md} * var(--density, 1))",
      paddingBlock: "calc({spacing.gap.sm} * var(--density, 1))",
      paddingInline: "calc({spacing.inset.sm} * var(--density, 1))",
      textStyle: "body.sm",
    });
    expect(recipe.base?.["item"]).toMatchObject({ borderRadius: "l1" });
  });

  it("runs a rule out to the panel's edge whatever width the rows took", () => {
    expect(recipe.base?.["separator"]).toMatchObject({ inlineSize: "auto" });
  });

  it("draws a submenu's control as a row", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["triggerItem"]).toStrictEqual(
      recipe.variants?.["size"]?.["md"]?.["item"],
    );
  });

  it("reads a group's label smaller and lighter than the rows it names", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["itemGroupLabel"]).toMatchObject({
      textStyle: "body.xs",
    });
    expect(recipe.base?.["itemGroupLabel"]).toStrictEqual({
      color: "fg.subtle",
      fontWeight: "medium",
    });
  });

  it("pushes the keys that run a row to its end a step quieter and smaller", () => {
    expect(recipe.base?.["itemCommand"]).toMatchObject({
      color: "fg.muted",
      marginInlineStart: "auto",
    });
    expect(recipe.variants?.["size"]?.["md"]?.["itemCommand"]).toMatchObject({
      textStyle: "body.xs",
    });
  });

  it("runs a rule out to the panel's edge through the room round the rows", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["separator"]).toStrictEqual({
      marginBlock: "calc({spacing.gap.sm} * var(--density, 1))",
      marginInline: "calc(-1 * calc({spacing.gap.sm} * var(--density, 1)))",
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

  it("pushes the tick to the end of the row and keeps its box while the row is off", () => {
    expect(recipe.base?.["itemIndicator"]).toMatchObject({
      "&[data-state=checked]": { visibility: "visible" },
      marginInlineStart: "auto",
      order: "1",
      visibility: "hidden",
    });
    expect(recipe.base?.["itemIndicator"]).not.toHaveProperty("position");
  });

  it("cuts a label too long for its row rather than wrapping it", () => {
    expect(recipe.base?.["itemText"]).toMatchObject({
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    });
  });

  it("draws a row's mark as a tinted square the size of a tag", () => {
    expect(recipe.base?.["itemMark"]).toMatchObject({
      background: "bg.muted",
      borderRadius: "l1",
      flexShrink: "0",
      fontWeight: "semibold",
    });
    expect(recipe.variants?.["size"]?.["md"]?.["itemMark"]).toStrictEqual({
      boxSize: "calc({sizes.tag.md} * var(--density, 1))",
      fontSize: "xs",
    });
  });

  it("stacks a row's words over the line about them and fills the row with the pair", () => {
    expect(recipe.base?.["itemLines"]).toStrictEqual({
      display: "flex",
      flex: "1",
      flexDirection: "column",
      minInlineSize: "0",
    });
  });

  it("draws the line under a row's words in the caption's type and the subtle ink", () => {
    expect(recipe.base?.["itemDescription"]).toMatchObject({
      color: "fg.subtle",
      textStyle: "caption",
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

  it("pushes the mark that opens the panel to the end of its control and holds it still", () => {
    expect(recipe.base?.["indicator"]).toStrictEqual({
      alignItems: "center",
      display: "inline-flex",
      flexShrink: "0",
      marginInlineStart: "auto",
    });
  });

  it("tracks the tag named Menu and every part under it", () => {
    expect(recipe.jsx).toStrictEqual([/^Menu(\.\w+)?$/u]);
  });
});
