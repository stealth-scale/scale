import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import {
  alignVariants,
  columnCounts,
  DISTRIBUTIONS,
  filledColumns,
  fittedColumns,
  gapSizes,
  justifyVariants,
  spanCounts,
  widthSizes,
} from "#authoring/recipes/flow.ts";

describe("flow", () => {
  it("offers the whole gap scale when a recipe names no steps", () => {
    expect(Object.keys(gapSizes())).toHaveLength(8);
    expect(gapSizes(["sm", "4xl"])).toStrictEqual({
      "4xl": { gap: "gap.4xl" },
      sm: { gap: "gap.sm" },
    });
  });

  it("names the four places a child takes across the direction it runs in", () => {
    expect(alignVariants()).toStrictEqual({
      baseline: { alignItems: "baseline" },
      "flex-end": { alignItems: "flex-end" },
      "flex-start": { alignItems: "flex-start" },
      stretch: { alignItems: "stretch" },
    });
  });

  it("names the six ways the space along that direction is shared out", () => {
    expect(Object.keys(justifyVariants())).toStrictEqual([...DISTRIBUTIONS]);
    expect(justifyVariants(["between"])).toStrictEqual({
      between: { justifyContent: "space-between" },
    });
  });

  it("offers no value on one axis that the other offers", () => {
    const across = Object.keys(alignVariants());

    expect(Object.keys(justifyVariants()).filter((each) => across.includes(each))).toStrictEqual(
      [],
    );
  });

  it("fits as many columns of a measure as a grid has room for", () => {
    expect(fittedColumns(["sm"])).toStrictEqual({
      "fit-sm": {
        gridTemplateColumns: "repeat(auto-fit, minmax(min({sizes.sm}, 100%), 1fr))",
      },
    });
    expect(Object.keys(fittedColumns())).toHaveLength(12);
  });

  it("fills a row with columns of a measure whether or not every column has an entry", () => {
    expect(filledColumns(["sm"])).toStrictEqual({
      "fill-sm": {
        gridTemplateColumns: "repeat(auto-fill, minmax(min({sizes.sm}, 100%), 1fr))",
      },
    });
    expect(Object.keys(filledColumns())).toHaveLength(12);
  });

  it("draws a count of equal columns", () => {
    expect(columnCounts(["3"])).toStrictEqual({
      "3": { gridTemplateColumns: "repeat(3, minmax(0, 1fr))" },
    });
    expect(Object.keys(columnCounts())).toHaveLength(12);
  });

  it("reaches an entry across a count of columns", () => {
    expect(spanCounts(["2"])).toStrictEqual({ "2": { gridColumn: "span 2" } });
    expect(Object.keys(spanCounts())).toHaveLength(12);
  });

  it("holds a box to the measure of its name", () => {
    expect(widthSizes(["prose" as never])).toStrictEqual({ prose: { maxInlineSize: "prose" } });
    expect(Object.keys(widthSizes())).toHaveLength(12);
  });

  it("reads tokens the foundation defines at every gap and measure", () => {
    const recipe = defineRecipe({
      base: { display: "flex" },
      className: "x",
      variants: {
        align: alignVariants(),
        gap: gapSizes(),
        justify: justifyVariants(),
      },
    });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });
});
