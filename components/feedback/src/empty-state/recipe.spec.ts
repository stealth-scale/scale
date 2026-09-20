import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#empty-state/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["EmptyState"] })).toStrictEqual([]);
  });

  it("names its class empty-state", () => {
    expect(recipe.className).toBe("empty-state");
  });

  it("draws the five parts an empty state is composed of", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "content",
      "description",
      "indicator",
      "root",
      "title",
    ]);
  });

  it("offers the one axis every part steps with", () => {
    expect(axesOf(recipe)).toStrictEqual(["size"]);
  });

  it("draws the middle size when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
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

  it("steps the panel the content the mark and the title together at one name", () => {
    expect(recipe.variants?.["size"]?.["md"]).toStrictEqual({
      content: { gap: "calc({spacing.gap.md} * var(--density, 1))" },
      indicator: { boxSize: "calc({sizes.icon.md} * var(--density, 1))" },
      root: { padding: "calc({spacing.inset.md} * var(--density, 1))" },
      title: { textStyle: "heading.md" },
    });
  });

  it("holds the description at one size whatever the panel's is", () => {
    expect(recipe.variants?.["size"]?.["4xl"]).not.toHaveProperty("description");
    expect(recipe.base?.["description"]).toMatchObject({ textStyle: "body.sm" });
  });

  it("tracks the tag named EmptyState and every part under it", () => {
    expect(recipe.jsx).toStrictEqual([/^EmptyState(\.\w+)?$/u]);
  });
});
