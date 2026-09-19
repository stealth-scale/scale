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

  it("pushes the mark that opens the list to the end of the control", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({ marginInlineStart: "auto" });
  });

  it("tracks every tag under the Switcher namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^Switcher(\.\w+)?$/u]);
  });
});
