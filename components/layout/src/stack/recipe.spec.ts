import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#stack/recipe.ts";
import page from "#stack/stack.specimen.tsx";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Stack"] })).toStrictEqual([]);
  });

  it("sets className to stack", () => {
    expect(recipe.className).toBe("stack");
  });

  it("declares five variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["align", "direction", "gap", "justify", "wrap"]);
  });

  it("defaults to the md gap", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ gap: "md" });
  });

  it("declares eight gaps on the gap axis", () => {
    expect(valuesOf(recipe, "gap")).toHaveLength(8);
  });

  it("declares four flex directions on the direction axis", () => {
    expect(valuesOf(recipe, "direction")).toStrictEqual([
      "column",
      "column-reverse",
      "row",
      "row-reverse",
    ]);
  });

  it("declares six distributions on the justify axis", () => {
    expect(valuesOf(recipe, "justify")).toStrictEqual([
      "around",
      "between",
      "center",
      "end",
      "evenly",
      "start",
    ]);
  });

  it("centres a row on the cross axis in the base", () => {
    expect(recipe.base).toMatchObject({
      "&.stack--direction_row, &.stack--direction_row-reverse": { alignItems: "center" },
    });
  });

  it("sets only flex-direction on each direction value", () => {
    expect(recipe.variants?.["direction"]).toStrictEqual({
      column: { flexDirection: "column" },
      "column-reverse": { flexDirection: "column-reverse" },
      row: { flexDirection: "row" },
      "row-reverse": { flexDirection: "row-reverse" },
    });
  });

  it("matches the Stack JSX tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Stack$/u]);
  });
});
