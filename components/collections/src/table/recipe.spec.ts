import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { NUMERIC, recipe } from "#table/recipe.ts";

const PARTS = [
  "scroller",
  "root",
  "columnGroup",
  "column",
  "caption",
  "header",
  "body",
  "footer",
  "row",
  "columnHeader",
  "sorter",
  "rowHeader",
  "cell",
];

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Table.Root", "Table.Cell", "Table.ColumnHeader"],
        parts: PARTS,
      }),
    ).toStrictEqual([]);
  });

  it("names its class table", () => {
    expect(recipe.className).toBe("table");
  });

  it("styles the thirteen parts a table draws", () => {
    expect(recipe.slots).toStrictEqual(PARTS);
  });

  it("offers the ten axes a table takes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "align",
      "interactive",
      "layout",
      "radius",
      "ruled",
      "size",
      "stickyColumn",
      "stickyHeader",
      "striped",
      "variant",
    ]);
  });

  it("draws a ruled table at the middle size when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      align: "middle",
      layout: "auto",
      radius: "l2",
      size: "md",
      variant: "line",
    });
  });

  it("offers the three ways a table is set off", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["line", "outline", "plain"]);
  });

  it("offers the three places a cell's words sit", () => {
    expect(valuesOf(recipe, "align")).toStrictEqual(["bottom", "middle", "top"]);
  });

  it("stripes the body's own rows in the shallowest well rather than every row of the table", () => {
    expect(recipe.variants?.["striped"]?.["true"]).toStrictEqual({
      body: { "& > tr": { _odd: { background: "bg.subtle" } } },
    });
  });

  it("sets a column of figures in tabular figures against its end", () => {
    expect(recipe.base?.["cell"]).toMatchObject({
      "&[data-numeric]": { fontVariantNumeric: "tabular-nums", textAlign: "end" },
    });
  });

  it("names the attribute a cell of figures carries", () => {
    expect(NUMERIC).toBe("data-numeric");
  });

  it("draws the sticky header on a surface so the rows do not read through it", () => {
    expect(recipe.variants?.["stickyHeader"]?.["true"]?.["header"]).toMatchObject({
      background: "bg.panel",
    });
  });

  it("lights an interactive row from the keyboard as well as the pointer", () => {
    expect(recipe.variants?.["interactive"]?.["true"]?.["body"]).toMatchObject({
      "& > tr": { _focusWithin: { background: "colorPalette.subtle" } },
    });
  });

  it("holds the row's own name still while the table scrolls sideways", () => {
    expect(recipe.variants?.["stickyColumn"]?.["true"]?.["rowHeader"]).toMatchObject({
      insetInlineStart: "0",
      position: "sticky",
    });
  });

  it("names both compounds", () => {
    expect(recipe.compoundVariants?.map((each) => each.className)).toStrictEqual([
      "table__body--tracked",
      "table__columnHeader--cornered",
    ]);
  });

  it("pins the corner above both the sticky header and the sticky column", () => {
    const [, cornered] = recipe.compoundVariants ?? [];

    expect(cornered?.css).toStrictEqual({
      columnHeader: {
        "&:first-of-type": { insetInlineStart: "0", position: "sticky", zIndex: "2" },
      },
    });
  });

  it("tracks the table and every part under its namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^Table(\.\w+)?$/u]);
  });
});
