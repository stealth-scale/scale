import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#number-input/number-input.specimen.tsx";
import { recipe } from "#number-input/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["NumberInput"] })).toStrictEqual([]);
  });

  it("uses the class name number-input", () => {
    expect(recipe.className).toBe("number-input");
  });

  it("styles the triggers as interactive buttons with an outside focus ring", () => {
    expect(recipe.base).toMatchObject({ cursor: "button", focusVisibleRing: "outside" });
  });

  it("fills a trigger with bg.muted on hover", () => {
    expect(recipe.base).toMatchObject({ _hover: { background: "bg.muted", color: "fg" } });
  });

  it("keeps a disabled trigger transparent on hover", () => {
    expect(recipe.base).toMatchObject({
      _disabled: { _hover: { background: "transparent", color: "fg.muted" } },
    });
  });

  it("declares the size axis only", () => {
    expect(axesOf(recipe)).toStrictEqual(["size"]);
  });

  it("defaults to size md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
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

  it("sizes the md square to the tag height with a 24px floor", () => {
    expect(recipe.variants?.["size"]?.["md"]).toStrictEqual({
      boxSize: "max({sizes.6}, calc({sizes.tag.md} * var(--density, 1)))",
    });
  });

  it("tracks JSX named NumberInput and its parts", () => {
    expect(recipe.jsx).toStrictEqual([/^NumberInput(\.\w+)?$/u]);
  });
});
