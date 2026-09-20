import { describe, expect, it } from "vitest";

import {
  axesOf,
  defaultsOf,
  recipeViolations,
  slotsOf,
  valuesOf,
} from "@stealthscale/testing-theme";

import { recipe } from "#grid/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Grid.Root", "Grid.Item"] })).toStrictEqual([]);
  });

  it("names its class grid", () => {
    expect(recipe.className).toBe("grid");
  });

  it("styles the root and the entry", () => {
    expect(slotsOf(recipe)).toStrictEqual(["item", "root"]);
  });

  it("offers the six axes a grid takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["align", "columns", "flow", "gap", "justify", "span"]);
  });

  it("draws one column at the middle gap when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ columns: "1", gap: "md" });
  });

  it("offers a count of columns up to twelve", () => {
    expect(valuesOf(recipe, "columns")).toContain("12");
  });

  it("offers a fitted and a filled column at every measure the page is read at", () => {
    expect(valuesOf(recipe, "columns")).toContain("fit-sm");
    expect(valuesOf(recipe, "columns")).toContain("fill-sm");
    expect(valuesOf(recipe, "columns")).toHaveLength(36);
  });

  it("reaches an entry across a count of columns or the whole row", () => {
    expect(valuesOf(recipe, "span")).toContain("full");
    expect(valuesOf(recipe, "span")).toHaveLength(13);
  });

  it("tracks the namespace and every tag whose name opens with Grid", () => {
    expect(recipe.jsx).toStrictEqual([/^Grid(\.\w+)?$/u]);
  });
});
