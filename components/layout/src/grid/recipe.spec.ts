import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import {
  axesOf,
  defaultsOf,
  recipeViolations,
  slotsOf,
  valuesOf,
} from "@stealthscale/testing-theme";

import page from "#grid/grid.specimen.tsx";
import { recipe } from "#grid/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Grid.Root", "Grid.Item"] })).toStrictEqual([]);
  });

  it("sets className to grid", () => {
    expect(recipe.className).toBe("grid");
  });

  it("declares the item and root slots", () => {
    expect(slotsOf(recipe)).toStrictEqual(["item", "root"]);
  });

  it("declares six variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["align", "columns", "flow", "gap", "justify", "span"]);
  });

  it("defaults to one column at the md gap", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ columns: "1", gap: "md" });
  });

  it("declares column counts up to 12", () => {
    expect(valuesOf(recipe, "columns")).toContain("12");
  });

  it("declares 36 values on the columns axis", () => {
    expect(valuesOf(recipe, "columns")).toHaveLength(36);
  });

  it.each(["fit-sm", "fill-sm"])("declares %s on the columns axis", (columns) => {
    expect(valuesOf(recipe, "columns")).toContain(columns);
  });

  it("declares 13 spans on the span axis", () => {
    expect(valuesOf(recipe, "span")).toHaveLength(13);
  });

  it("spans every column at span full", () => {
    expect(recipe.variants?.span?.full).toStrictEqual({ item: { gridColumn: "1 / -1" } });
  });

  it("declares two placements on the flow axis", () => {
    expect(valuesOf(recipe, "flow")).toStrictEqual(["dense", "row"]);
  });

  it("declares three alignments on the justify axis", () => {
    expect(valuesOf(recipe, "justify")).toStrictEqual(["center", "end", "start"]);
  });

  it("sets justify-items on the root at each justify value", () => {
    expect(recipe.variants?.justify?.center).toStrictEqual({
      root: { justifyItems: "center" },
    });
  });

  it("matches every JSX tag that opens with Grid", () => {
    expect(recipe.jsx).toStrictEqual([/^Grid(\.\w+)?$/u]);
  });
});
