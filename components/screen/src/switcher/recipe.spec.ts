import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#switcher/recipe.ts";

/**
 * The parts a switcher draws, which the check is handed to read the slots by.
 */
const PARTS = [
  "root",
  "mark",
  "label",
  "name",
  "detail",
  "indicator",
  "content",
  "option",
  "check",
  "action",
];

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Switcher"], parts: PARTS })).toStrictEqual([]);
  });

  it("names its class switcher", () => {
    expect(recipe.className).toBe("switcher");
  });

  it("styles the ten parts a switcher draws", () => {
    expect(recipe.slots).toStrictEqual(PARTS);
  });

  it("offers the three axes a switcher takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["placement", "size", "variant"]);
  });

  it("draws a plain control at the middle size in a sidebar when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      placement: "sidebar",
      size: "md",
      variant: "plain",
    });
  });

  it("shrinks the mark to a tinted square in a toolbar and opens the control's gap", () => {
    expect(recipe.compoundVariants).toStrictEqual([
      {
        className: "switcher__root--marked",
        css: { root: { gap: "gap.lg" } },
        placement: "toolbar",
      },
      {
        className: "switcher__mark--marked",
        css: {
          mark: {
            background: "bg.muted",
            borderRadius: "l1",
            boxSize: "icon.md",
            fontSize: "xs",
            fontWeight: "semibold",
            justifyContent: "center",
            lineHeight: "tight",
          },
        },
        placement: "toolbar",
      },
    ]);
  });

  it("holds the control at its size's height and sets the name semibold", () => {
    expect(recipe.variants?.["size"]?.["sm"]?.["root"]).toStrictEqual({
      borderRadius: "l2",
      gap: "gap.sm",
      minBlockSize: "control.sm",
      paddingInline: "gap.sm",
    });
    expect(recipe.variants?.["size"]?.["sm"]?.["name"]).toStrictEqual({
      fontSize: "sm",
      fontWeight: "semibold",
      lineHeight: "tight",
    });
  });

  it("fills a sidebar's column and takes the width of its words in a toolbar", () => {
    expect(recipe.variants?.["placement"]?.["sidebar"]?.["root"]).toStrictEqual({
      inlineSize: "full",
    });
    expect(recipe.variants?.["placement"]?.["toolbar"]).toStrictEqual({
      detail: { display: "none" },
      root: { inlineSize: "auto" },
    });
  });

  it("offers the three ways the control is set against what holds it", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["outline", "plain", "subtle"]);
  });

  it("cuts a long name short rather than wrapping the control", () => {
    expect(recipe.base?.["name"]).toMatchObject({
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    });
  });

  it("stacks the name over the detail", () => {
    expect(recipe.base?.["label"]).toMatchObject({ display: "flex", flexDirection: "column" });
  });

  it("draws the detail quieter than the name", () => {
    expect(recipe.base?.["detail"]).toMatchObject({ color: "fg.muted", textStyle: "caption" });
  });

  it("puts the tick at the end of the row and keeps the row's end clear for it", () => {
    expect(recipe.base?.["check"]).not.toHaveProperty("insetInlineStart");
    expect(recipe.variants?.["size"]?.["md"]?.["check"]).toStrictEqual({
      boxSize: "icon.md",
      insetInlineEnd: "gap.md",
      insetInlineStart: "auto",
    });
    expect(recipe.variants?.["size"]?.["md"]?.["option"]).toMatchObject({
      paddingInlineEnd: "calc({sizes.icon.md} + 2 * {spacing.gap.md})",
    });
  });

  it("pushes the mark that opens the list to the end of the control and holds it still", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({
      _open: { rotate: "0deg" },
      alignItems: "center",
      display: "inline-flex",
      marginInlineStart: "auto",
    });
  });

  it("sets the control in the neutral palette's ink", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      color: "colorPalette.fg",
      colorPalette: "neutral",
    });
  });

  it("tracks every tag under the Switcher namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^Switcher(\.\w+)?$/u]);
  });
});
