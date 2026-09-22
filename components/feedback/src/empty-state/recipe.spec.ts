import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#empty-state/empty-state.specimen.tsx";
import { recipe } from "#empty-state/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to move", () => {
    expect(recipeViolations(recipe, { names: ["EmptyState"] })).toStrictEqual([]);
  });

  it("prefixes its generated classes with empty-state", () => {
    expect(recipe.className).toBe("empty-state");
  });

  it("declares exactly the five slots content through title", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "content",
      "description",
      "indicator",
      "root",
      "title",
    ]);
  });

  it("declares size as its only variant", () => {
    expect(axesOf(recipe)).toStrictEqual(["size"]);
  });

  it("defaults size to md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("accepts all eight steps of the shared size scale", () => {
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

  it("scales every slot but the description from a single size value", () => {
    expect(recipe.variants?.["size"]?.["md"]).toStrictEqual({
      content: { gap: "calc({spacing.gap.md} * var(--density, 1))" },
      indicator: { boxSize: "calc({sizes.icon.md} * var(--density, 1))" },
      root: { padding: "calc({spacing.inset.md} * var(--density, 1))" },
      title: { textStyle: "heading.md" },
    });
  });

  it("leaves the description slot untouched by the largest size", () => {
    expect(recipe.variants?.["size"]?.["4xl"]).not.toHaveProperty("description");
  });

  it("pins the description to the small body text style in its base", () => {
    expect(recipe.base?.["description"]).toMatchObject({ textStyle: "body.sm" });
  });

  it("matches EmptyState and any dotted member of it for jsx tracking", () => {
    expect(recipe.jsx).toStrictEqual([/^EmptyState(\.\w+)?$/u]);
  });
});
