import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#stack/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Stack"] })).toStrictEqual([]);
  });

  it("names its class stack", () => {
    expect(recipe.className).toBe("stack");
  });

  it("offers the five axes a stack takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["align", "direction", "gap", "justify", "wrap"]);
  });

  it("draws a column at the middle gap when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ gap: "md" });
  });

  it("offers the whole gap scale", () => {
    expect(valuesOf(recipe, "gap")).toHaveLength(8);
  });

  it("offers the four directions children run in", () => {
    expect(valuesOf(recipe, "direction")).toStrictEqual([
      "column",
      "column-reverse",
      "row",
      "row-reverse",
    ]);
  });

  it("offers the six ways the space along the direction is shared out", () => {
    expect(valuesOf(recipe, "justify")).toStrictEqual([
      "around",
      "between",
      "center",
      "end",
      "evenly",
      "start",
    ]);
  });

  it("centres a row across the flow from the base", () => {
    const across = "&.stack--direction_row, &.stack--direction_row-reverse";

    expect(recipe.base).toMatchObject({ [across]: { alignItems: "center" } });
    expect(recipe.variants?.["direction"]).toStrictEqual({
      column: { flexDirection: "column" },
      "column-reverse": { flexDirection: "column-reverse" },
      row: { flexDirection: "row" },
      "row-reverse": { flexDirection: "row-reverse" },
    });
  });

  it("tracks the tag a consumer writes it under", () => {
    expect(recipe.jsx).toStrictEqual([/^Stack$/u]);
  });
});
