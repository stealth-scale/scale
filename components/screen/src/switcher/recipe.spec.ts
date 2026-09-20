import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#switcher/recipe.ts";

const PARTS = ["root", "mark", "label", "name", "detail", "indicator"];

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Switcher"], parts: PARTS })).toStrictEqual([]);
  });

  it("names its class switcher", () => {
    expect(recipe.className).toBe("switcher");
  });

  it("styles the six parts of the control and nothing of the menu's", () => {
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

  it("shrinks the mark to an icon's box in a toolbar", () => {
    expect(recipe.compoundVariants).toStrictEqual([
      {
        className: "switcher__mark--marked",
        css: { mark: { boxSize: "calc({sizes.icon.lg} * var(--density, 1))", fontSize: "xs" } },
        placement: "toolbar",
      },
    ]);
  });

  it("reads the control a step below the size it was asked for and rounds its corners", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["root"]).toStrictEqual({
      borderRadius: "l2",
      gap: "calc({spacing.gap.md} * var(--density, 1))",
      paddingBlock: "calc({spacing.gap.sm} * var(--density, 1))",
      paddingInline: "calc({spacing.gap.md} * var(--density, 1))",
      textStyle: "body.sm",
    });
    expect(recipe.variants?.["size"]?.["md"]?.["name"]).toStrictEqual({ textStyle: "body.sm" });
    expect(recipe.base?.["name"]).toMatchObject({ fontWeight: "medium" });
  });

  it("fills a sidebar's column and fits the width of its words in a toolbar", () => {
    expect(recipe.variants?.["placement"]?.["sidebar"]?.["root"]).toStrictEqual({
      inlineSize: "full",
    });
    expect(recipe.variants?.["placement"]?.["toolbar"]).toStrictEqual({
      detail: { display: "none" },
      root: { inlineSize: "fit" },
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

  it("stacks the name over the detail and lets the pair fill the control", () => {
    expect(recipe.base?.["label"]).toMatchObject({
      display: "flex",
      flex: "1",
      flexDirection: "column",
    });
  });

  it("draws the detail quieter than the name", () => {
    expect(recipe.base?.["detail"]).toMatchObject({ color: "fg.subtle", textStyle: "caption" });
  });

  it("pushes the mark that opens the list to the end of the control and holds it still", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({
      _open: { rotate: "0deg" },
      alignItems: "center",
      display: "inline-flex",
      marginInlineStart: "auto",
    });
  });

  it("draws the mark as a tinted square and centres whatever it holds", () => {
    expect(recipe.base?.["mark"]).toStrictEqual({
      alignItems: "center",
      background: "bg.muted",
      borderRadius: "l1",
      color: "fg.muted",
      display: "inline-flex",
      flexShrink: "0",
      fontWeight: "semibold",
      justifyContent: "center",
      lineHeight: "tight",
      overflow: "clip",
    });
  });

  it("sizes the mark two steps under the control's box and sets its initial a step under", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["mark"]).toStrictEqual({
      boxSize: "calc({sizes.control.xs} * var(--density, 1))",
      fontSize: "sm",
    });
  });

  it("sets the control in the muted ink", () => {
    expect(recipe.base?.["root"]).toMatchObject({ color: "fg.muted", colorPalette: "neutral" });
  });

  it("tracks every tag under the Switcher namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^Switcher(\.\w+)?$/u]);
  });
});
