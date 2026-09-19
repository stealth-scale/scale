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

  it("draws a column of its own width per value across and one beside them for the side", () => {
    expect(recipe.variants?.["across"]?.["3"]).toStrictEqual({
      grid: { "@/md": { gridTemplateColumns: "repeat(4, max-content)" } },
    });
  });

  it("seats each cell at the top of its row once unfolded", () => {
    expect(recipe.base?.["grid"]).toMatchObject({ "@/md": { alignItems: "start" } });
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
