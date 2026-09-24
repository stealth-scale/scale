import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#menu/menu.specimen.tsx";
import { recipe } from "#menu/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Menu"] })).toStrictEqual([]);
  });

  it("sets className to menu", () => {
    expect(recipe.className).toBe("menu");
  });

  it("declares nineteen slots", () => {
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

  it("sets display contents on the root", () => {
    expect(recipe.base?.["root"]).toStrictEqual({ display: "contents" });
  });

  it("declares five axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["highlight", "inset", "palette", "size", "variant"]);
  });

  it("defaults to the surface look at md in neutral with the tint highlight", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      highlight: "tint",
      palette: "neutral",
      size: "md",
      variant: "surface",
    });
  });

  it("declares three sizes", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("declares three looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["elevated", "glass", "surface"]);
  });

  it("declares three highlights", () => {
    expect(valuesOf(recipe, "highlight")).toStrictEqual(["bar", "fill", "tint"]);
  });

  it("sets the palette on the panel", () => {
    expect(recipe.variants?.["palette"]?.["info"]).toStrictEqual({
      content: { colorPalette: "info" },
    });
  });

  it("emits every palette", () => {
    expect(recipe.staticCss).toContainEqual({
      palette: ["primary", "secondary", "accent", "neutral", "info", "success", "warning", "error"],
    });
  });

  it("highlights a submenu's trigger row like any row", () => {
    expect(recipe.variants?.["highlight"]?.["fill"]).toMatchObject({
      item: { _highlighted: { layerStyle: "fill.solid" } },
      triggerItem: { _highlighted: { layerStyle: "fill.solid" } },
    });
  });

  it("caps the panel at --available-height", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      maxBlockSize: "var(--available-height)",
      overflowY: "auto",
    });
  });

  it("contains the panel's overscroll", () => {
    expect(recipe.base?.["content"]).toMatchObject({ overscrollBehavior: "contain" });
  });

  it("animates the panel with slide-fade", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      _closed: { animationStyle: "slide-fade.out" },
      _open: { animationStyle: "slide-fade.in" },
    });
  });

  it("stacks the panel on the dropdown z-index plus its depth", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      zIndex: "calc({zIndex.dropdown} + var(--menu-depth, 0))",
    });
  });

  it("sets no z-index on the positioner", () => {
    expect(recipe.base?.["positioner"]).not.toHaveProperty("zIndex");
  });

  it("sizes the panel from sizes.44 to its widest row", () => {
    expect(recipe.base?.["content"]).toMatchObject({ minInlineSize: "44" });
    expect(recipe.base?.["content"]).not.toHaveProperty("inlineSize");
  });

  it("sets no outline on the panel", () => {
    expect(recipe.base?.["content"]).toMatchObject({ outline: "0" });
    expect(recipe.base?.["content"]).not.toHaveProperty("_focusVisible");
  });

  it("leaves no gutter on a checkable row", () => {
    expect(recipe.base?.["item"]).not.toHaveProperty("&[data-type]");
  });

  it("leaves the gutter on every row when inset is true", () => {
    expect(recipe.variants?.["inset"]?.["true"]).toStrictEqual({
      item: { paddingInlineStart: "var(--menu-gutter)" },
      triggerItem: { paddingInlineStart: "var(--menu-gutter)" },
    });
  });

  it("sizes the gutter from the row's padding the icon and the gap", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["item"]).toMatchObject({
      "--menu-gutter": "calc({spacing.inset.sm} + {sizes.icon.sm} + {spacing.gap.md})",
    });
  });

  it("sets a row on the body role one size smaller with rounded corners", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["item"]).toStrictEqual({
      "--menu-gutter": "calc({spacing.inset.sm} + {sizes.icon.sm} + {spacing.gap.md})",
      gap: "calc({spacing.gap.md} * var(--density, 1))",
      paddingBlock: "calc({spacing.gap.sm} * var(--density, 1))",
      paddingInline: "calc({spacing.inset.sm} * var(--density, 1))",
      textStyle: "body.sm",
    });
    expect(recipe.base?.["item"]).toMatchObject({ borderRadius: "l1" });
  });

  it("sizes the separator to the panel's width", () => {
    expect(recipe.base?.["separator"]).toMatchObject({ inlineSize: "auto" });
  });

  it("sizes a submenu's trigger row like a row", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["triggerItem"]).toStrictEqual(
      recipe.variants?.["size"]?.["md"]?.["item"],
    );
  });

  it("sets a group label two sizes smaller in fg.subtle", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["itemGroupLabel"]).toMatchObject({
      textStyle: "body.xs",
    });
    expect(recipe.base?.["itemGroupLabel"]).toStrictEqual({
      color: "fg.subtle",
      fontWeight: "medium",
    });
  });

  it("puts the keys at the row's end two sizes smaller in fg.muted", () => {
    expect(recipe.base?.["itemCommand"]).toMatchObject({
      color: "fg.muted",
      marginInlineStart: "auto",
    });
    expect(recipe.variants?.["size"]?.["md"]?.["itemCommand"]).toMatchObject({
      textStyle: "body.xs",
    });
  });

  it("extends the separator through the panel's padding", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["separator"]).toStrictEqual({
      marginBlock: "calc({spacing.gap.sm} * var(--density, 1))",
      marginInline: "calc(-1 * calc({spacing.gap.sm} * var(--density, 1)))",
    });
  });

  it("sets a critical row in the error palette", () => {
    expect(recipe.base?.["item"]).toMatchObject({
      "&[data-tone=critical]": { color: "colorPalette.fg", colorPalette: "error" },
    });
  });

  it("sets no palette on a row", () => {
    expect(recipe.base?.["item"]).not.toHaveProperty("colorPalette");
  });

  it("sets the menuitem cursor on a row", () => {
    expect(recipe.base?.["item"]).toMatchObject({ cursor: "menuitem" });
  });

  it("shows a row's indicator at the row's end only while checked", () => {
    expect(recipe.base?.["itemIndicator"]).toMatchObject({
      "&[data-state=checked]": { visibility: "visible" },
      marginInlineStart: "auto",
      order: "1",
      visibility: "hidden",
    });
    expect(recipe.base?.["itemIndicator"]).not.toHaveProperty("position");
  });

  it("truncates a row's text", () => {
    expect(recipe.base?.["itemText"]).toMatchObject({
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    });
  });

  it("sizes a row's mark as a tag on bg.muted", () => {
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

  it("stacks a row's lines in a growing column", () => {
    expect(recipe.base?.["itemLines"]).toStrictEqual({
      display: "flex",
      flex: "1",
      flexDirection: "column",
      minInlineSize: "0",
    });
  });

  it("sets a row's description on the caption role in fg.subtle", () => {
    expect(recipe.base?.["itemDescription"]).toMatchObject({
      color: "fg.subtle",
      textStyle: "caption",
      whiteSpace: "nowrap",
    });
  });

  it("fills the arrow from --menu-surface", () => {
    expect(recipe.base?.["arrow"]).toMatchObject({ "--arrow-background": "var(--menu-surface)" });
    expect(recipe.variants?.["variant"]?.["surface"]?.["content"]).toMatchObject({
      "--menu-surface": "colors.bg.popover",
    });
  });

  it("sets no offset on the positioner", () => {
    expect(recipe.base?.["positioner"]).toStrictEqual({ position: "relative" });
  });

  it("puts the indicator at its trigger's end", () => {
    expect(recipe.base?.["indicator"]).toStrictEqual({
      "& > svg": { boxSize: "100%" },
      alignItems: "center",
      display: "inline-flex",
      flexShrink: "0",
      justifyContent: "center",
      marginInlineStart: "auto",
    });
  });

  it("sizes the indicator like a checked row's mark", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["indicator"]).toStrictEqual({
      boxSize: "calc({sizes.icon.sm} * var(--density, 1))",
    });
  });

  it("matches every Menu tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Menu(\.\w+)?$/u]);
  });
});
