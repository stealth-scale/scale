import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#matrix/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Matrix"] })).toStrictEqual([]);
  });

  it("names its class matrix", () => {
    expect(recipe.className).toBe("matrix");
  });

  it("offers one axis for the count of values across", () => {
    expect(axesOf(recipe)).toStrictEqual(["across"]);
  });

  it("offers every count of a grid of twelve", () => {
    expect(valuesOf(recipe, "across")).toHaveLength(12);
    expect(valuesOf(recipe, "across")).toContain("1");
    expect(valuesOf(recipe, "across")).toContain("12");
  });

  it("draws one value across when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ across: "1" });
  });

  it("draws a column per value across that shares the card and one beside them for the side", () => {
    expect(recipe.variants?.["across"]?.["3"]).toStrictEqual({
      grid: { "@/md": { gridTemplateColumns: "max-content repeat(3, minmax(min-content, 1fr))" } },
    });
  });

  it("never squeezes a column past what the cells in it can give", () => {
    expect(recipe.variants?.["across"]?.["6"]).toStrictEqual({
      grid: { "@/md": { gridTemplateColumns: "max-content repeat(6, minmax(min-content, 1fr))" } },
    });
  });

  it("holds two rows further apart than two cells of one row", () => {
    expect(recipe.base?.["grid"]).toMatchObject({
      "@/md": {
        columnGap: "calc({spacing.gap.lg} * var(--density, 1))",
        rowGap: "calc({spacing.gap.xl} * var(--density, 1))",
      },
    });
  });

  it("centres each cell in its row once unfolded", () => {
    expect(recipe.base?.["grid"]).toMatchObject({ "@/md": { alignItems: "center" } });
  });

  it("leaves room for what a cell paints outside its box and takes the room back", () => {
    expect(recipe.base?.["grid"]).toMatchObject({
      "@/md": {
        marginBlock: "calc({sizes.12} * -1)",
        overflowX: "auto",
        paddingBlock: "{sizes.12}",
      },
    });
  });

  it("folds the grid into rows below the middle container size", () => {
    expect(recipe.base?.["grid"]).toMatchObject({ "@/md": { display: "grid" }, display: "flex" });
    expect(recipe.base?.["head"]).toMatchObject({
      "@/md": { display: "contents" },
      display: "none",
    });
    expect(recipe.base?.["row"]).toMatchObject({
      "@/md": { display: "contents" },
      display: "flex",
    });
    expect(recipe.base?.["label"]).toMatchObject({ "@/md": { display: "none" } });
  });

  it("measures the grid against its root rather than the window", () => {
    expect(recipe.base?.["root"]).toStrictEqual({ containerType: "inline-size" });
  });

  it("tracks the tag a consumer writes it under", () => {
    expect(recipe.jsx).toStrictEqual([/^Matrix(\.\w+)?$/u]);
  });
});
