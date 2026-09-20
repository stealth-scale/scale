import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#input/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Input"] })).toStrictEqual([]);
  });

  it("names its class input", () => {
    expect(recipe.className).toBe("input");
  });

  it("offers the three axes a field takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["size", "status", "variant"]);
  });

  it("draws an outlined field at the middle size when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "outline" });
  });

  it("offers the eight sizes every component shares", () => {
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

  it("offers the three looks an edge is drawn in", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["flushed", "outline", "subtle"]);
  });

  it("offers the four statuses", () => {
    expect(valuesOf(recipe, "status")).toStrictEqual(["error", "info", "success", "warning"]);
  });

  it("reads a layer style the theme owns for every look", () => {
    expect(recipe.variants?.["variant"]).toMatchObject({
      flushed: { layerStyle: "field.flushed" },
      outline: { layerStyle: "field.outline" },
      subtle: { layerStyle: "field.subtle" },
    });
  });

  it("drops the inset with the flushed box so its text lines up with the label", () => {
    expect(recipe.variants?.["variant"]?.["flushed"]).toMatchObject({ paddingInline: "0" });
  });

  it("reads the control scale so a field lines up with a button beside it", () => {
    expect(recipe.variants?.["size"]?.["md"]).toMatchObject({
      height: "calc({sizes.control.md} * var(--density, 1))",
    });
  });

  it("marks a field that is wrong off the attribute a screen reader reads too", () => {
    expect(recipe.base?.["_invalid"]).toMatchObject({ borderColor: "border.error" });
  });

  it("draws the focus ring inside the box so a flush field does not clip it", () => {
    expect(recipe.base).toMatchObject({ focusVisibleRing: "inside" });
  });

  it("tracks the tag named Input and not the search field", () => {
    const [pattern] = recipe.jsx ?? [];

    expect(pattern).toStrictEqual(/^Input$/u);
    expect(pattern instanceof RegExp && pattern.test("SearchInput")).toBe(false);
  });
});
