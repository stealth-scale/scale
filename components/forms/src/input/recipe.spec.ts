import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#input/input.specimen.tsx";
import { recipe } from "#input/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Input"] })).toStrictEqual([]);
  });

  it("uses the class name input", () => {
    expect(recipe.className).toBe("input");
  });

  it("declares three axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["size", "status", "variant"]);
  });

  it("defaults to an outline field at size md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "outline" });
  });

  it("offers the eight control sizes", () => {
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

  it("offers three looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["flushed", "outline", "subtle"]);
  });

  it("offers the four statuses", () => {
    expect(valuesOf(recipe, "status")).toStrictEqual(["error", "info", "success", "warning"]);
  });

  it("applies the theme's field layer style for each look", () => {
    expect(recipe.variants?.["variant"]).toMatchObject({
      flushed: { layerStyle: "field.flushed" },
      outline: { layerStyle: "field.outline" },
      subtle: { layerStyle: "field.subtle" },
    });
  });

  it("sets the smallest inset on a flushed field through the control inset properties", () => {
    expect(recipe.variants?.["variant"]?.["flushed"]).toMatchObject({
      paddingInlineEnd: "var(--control-inset-end, calc({spacing.inset.xs} * var(--density, 1)))",
      paddingInlineStart:
        "var(--control-inset-start, calc({spacing.inset.xs} * var(--density, 1)))",
    });
  });

  it("sets typed text at the normal weight at every size", () => {
    const weights = Object.values(recipe.variants?.["size"] ?? {}).map(
      (styles) => styles.fontWeight,
    );

    expect(weights).toStrictEqual(Array.from({ length: 8 }, () => "normal"));
  });

  it("reads the md height from the control scale", () => {
    expect(recipe.variants?.["size"]?.["md"]).toMatchObject({
      height: "calc({sizes.control.md} * var(--density, 1))",
    });
  });

  it("reads the inline inset one step below the size", () => {
    expect(recipe.variants?.["size"]?.["md"]).toMatchObject({
      paddingInlineEnd: "var(--control-inset-end, calc({spacing.inset.sm} * var(--density, 1)))",
      paddingInlineStart:
        "var(--control-inset-start, calc({spacing.inset.sm} * var(--density, 1)))",
    });
  });

  it("writes the error edge under the invalid state", () => {
    expect(recipe.base?.["_invalid"]).toMatchObject({
      "--field-edge": "{colors.border.error}",
    });
  });

  it("draws the focus ring inside the border box", () => {
    expect(recipe.base).toMatchObject({ focusVisibleRing: "inside" });
  });

  it("tracks JSX named Input only", () => {
    const [pattern] = recipe.jsx ?? [];

    expect(pattern).toStrictEqual(/^Input$/u);
    expect(pattern instanceof RegExp && pattern.test("SearchInput")).toBe(false);
  });
});
