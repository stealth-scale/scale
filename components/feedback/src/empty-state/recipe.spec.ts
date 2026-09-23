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

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["EmptyState"] })).toStrictEqual([]);
  });

  it("sets className to empty-state", () => {
    expect(recipe.className).toBe("empty-state");
  });

  it("declares five slots", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "content",
      "description",
      "indicator",
      "root",
      "title",
    ]);
  });

  it("declares the size axis only", () => {
    expect(axesOf(recipe)).toStrictEqual(["size"]);
  });

  it("defaults to the md size", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("declares sm md and lg on the size axis", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("sizes the mark two icon steps above the title at md", () => {
    expect(recipe.variants?.["size"]?.["md"]).toStrictEqual({
      content: { gap: "calc({spacing.gap.lg} * var(--density, 1))" },
      indicator: {
        boxSize: "calc({sizes.icon.2xl} * var(--density, 1))",
        marginBlockEnd: "calc({spacing.gap.lg} * var(--density, 1))",
      },
      root: { padding: "calc({spacing.inset.2xl} * var(--density, 1))" },
      title: { textStyle: "heading.sm" },
    });
  });

  it("reads heading.xs on the title at sm", () => {
    expect(recipe.variants?.["size"]?.["sm"]).toMatchObject({
      title: { textStyle: "heading.xs" },
    });
  });

  it("leaves the description out of the size axis", () => {
    expect(recipe.variants?.["size"]?.["lg"]).not.toHaveProperty("description");
  });

  it("reads body.sm on the description in the base", () => {
    expect(recipe.base?.["description"]).toMatchObject({ textStyle: "body.sm" });
  });

  it("matches the EmptyState tag and its parts", () => {
    expect(recipe.jsx).toStrictEqual([/^EmptyState(\.\w+)?$/u]);
  });
});
