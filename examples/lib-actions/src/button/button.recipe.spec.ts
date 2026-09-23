import { describe, expect, it } from "vitest";

import {
  axesOf,
  compoundClass,
  defaultsOf,
  recipeViolations,
  valuesOf,
} from "@stealthscale/testing-theme";

import { recipe } from "#button/button.recipe.ts";

describe("recipe", () => {
  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe)).toStrictEqual([]);
  });

  it("names its only compound hero for a large solid button", () => {
    expect(recipe.compoundVariants).toStrictEqual([
      {
        className: compoundClass("button", "hero"),
        css: { fontWeight: "bold", letterSpacing: "wide" },
        size: "lg",
        variant: "solid",
      },
    ]);
  });

  it("declares palette size and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["palette", "size", "variant"]);
  });

  it("defaults to a medium solid button", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "solid" });
  });

  it("declares four looks on the variant axis", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["ghost", "outline", "solid", "subtle"]);
  });

  it("declares the eight semantic palettes on the palette axis", () => {
    expect(valuesOf(recipe, "palette")).toStrictEqual([
      "accent",
      "error",
      "info",
      "neutral",
      "primary",
      "secondary",
      "success",
      "warning",
    ]);
  });
});
