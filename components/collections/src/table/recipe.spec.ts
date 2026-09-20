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
      "rules",
      "size",
      "stickyColumn",
      "stickyHeader",
      "striped",
      "variant",
    ]);
  });

  it("draws a table ruled between its rows at the middle size when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      align: "middle",
      layout: "auto",
      radius: "l2",
      rules: "rows",
      size: "md",
      variant: "plain",
    });
  });

  it("offers the two ways a table is set off", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["plain", "surface"]);
  });

  it("offers the three sets of rules a table is drawn with", () => {
    expect(valuesOf(recipe, "rules")).toStrictEqual(["all", "none", "rows"]);
  });

  it("separates the borders rather than collapsing them", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      borderCollapse: "separate",
      borderSpacing: "0",
    });
  });

  it("rules a cell's end on each axis and never its start", () => {
    const ruled = recipe.variants?.["rules"]?.["all"];
    const ends = { borderBlockEndWidth: "hairline" };

    expect(ruled?.["cell"]).toMatchObject(ends);
    expect(ruled?.["cell"]).not.toHaveProperty("borderBlockStartWidth");
    expect(ruled?.["cell"]).not.toHaveProperty("borderInlineStartWidth");
    expect(ruled?.["columnHeader"]).toMatchObject(ends);
    expect(ruled?.["rowHeader"]).toMatchObject(ends);
  });

  it("counts the last cell of a row by child rather than by type", () => {
    expect(recipe.variants?.["rules"]?.["all"]?.["rowHeader"]).toHaveProperty("&:not(:last-child)");
  });

  it("takes the rule off the last row of a body a footer follows", () => {
    expect(recipe.variants?.["rules"]?.["rows"]?.["body"]).toMatchObject({
      "&:has(+ tfoot) > tr:last-of-type > *": { borderBlockEndWidth: "0" },
    });
  });

  it("closes the band of names whichever way the rows are ruled", () => {
    const closed = { "& > tr:last-of-type > th": { borderBlockEndWidth: "indicator" } };

    expect(recipe.variants?.["rules"]?.["all"]?.["header"]).toMatchObject(closed);
    expect(recipe.variants?.["rules"]?.["none"]?.["header"]).toMatchObject(closed);
    expect(recipe.variants?.["rules"]?.["rows"]?.["header"]).toMatchObject(closed);
  });

  it("separates a total from the figures it sums whichever way the rows are ruled", () => {
    const over = { "& > tr:first-of-type > *": { borderBlockStartWidth: "indicator" } };

    expect(recipe.variants?.["rules"]?.["all"]?.["footer"]).toMatchObject(over);
    expect(recipe.variants?.["rules"]?.["none"]?.["footer"]).toMatchObject(over);
    expect(recipe.variants?.["rules"]?.["rows"]?.["footer"]).toMatchObject(over);
  });

  it("sets the column names back from the values they head", () => {
    expect(recipe.base?.["columnHeader"]).toMatchObject({
      color: "fg.muted",
      fontWeight: "medium",
    });
    expect(recipe.variants?.["size"]?.["md"]?.["columnHeader"]).toMatchObject({
      textStyle: "label.sm",
    });
  });

  it("takes the full ink back for the column a table is in the order of", () => {
    expect(recipe.base?.["columnHeader"]).toMatchObject({
      "&[aria-sort]:not([aria-sort=none])": { color: "fg" },
    });
  });

  it("offers the three places a cell's words sit", () => {
    expect(valuesOf(recipe, "align")).toStrictEqual(["bottom", "middle", "top"]);
  });

  it("stripes the body's own rows in the shallowest well rather than every row of the table", () => {
    expect(recipe.variants?.["striped"]?.["true"]).toStrictEqual({
      body: { "& > tr": { _odd: { background: "bg.muted" } } },
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

  it("draws the sticky header's cells on a surface so the rows do not read through it", () => {
    expect(recipe.variants?.["stickyHeader"]?.["true"]?.["columnHeader"]).toStrictEqual({
      background: "bg.panel",
    });
    expect(recipe.variants?.["stickyHeader"]?.["true"]?.["header"]).not.toHaveProperty(
      "background",
    );
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

  it("raises the held names over the held column rather than beside it", () => {
    expect(recipe.variants?.["stickyHeader"]?.["true"]?.["header"]).toMatchObject({
      "& > tr": { zIndex: "2" },
    });
    expect(recipe.variants?.["stickyColumn"]?.["true"]?.["rowHeader"]).toMatchObject({
      zIndex: "1",
    });
  });

  it("holds the name over a held column with the column itself", () => {
    expect(recipe.variants?.["stickyColumn"]?.["true"]?.["columnHeader"]).toMatchObject({
      "&:first-child": { insetInlineStart: "0", position: "sticky" },
    });
  });

  it("raises the corner over both the held names and the held column", () => {
    const [, cornered] = recipe.compoundVariants ?? [];

    expect(cornered?.css).toStrictEqual({ columnHeader: { "&:first-child": { zIndex: "2" } } });
  });

  it("tracks the table and every part under its namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^Table(\.\w+)?$/u]);
  });
});
