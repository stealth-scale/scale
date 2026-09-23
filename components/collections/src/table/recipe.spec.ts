import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { NUMERIC, recipe } from "#table/recipe.ts";
import page from "#table/table.specimen.tsx";

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
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Table.Root", "Table.Cell", "Table.ColumnHeader"],
        parts: PARTS,
      }),
    ).toStrictEqual([]);
  });

  it("sets className to table", () => {
    expect(recipe.className).toBe("table");
  });

  it("declares thirteen slots in markup order", () => {
    expect(recipe.slots).toStrictEqual(PARTS);
  });

  it("declares eleven variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "align",
      "banded",
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

  it("defaults to row rules at the md size in the plain variant", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      align: "center",
      layout: "auto",
      radius: "l2",
      rules: "rows",
      size: "md",
      variant: "plain",
    });
  });

  it("fills the column headers with bg.subtle when banded is true", () => {
    expect(recipe.variants?.["banded"]?.["true"]).toStrictEqual({
      columnHeader: {
        background: "bg.subtle",
        letterSpacing: "wide",
        textTransform: "uppercase",
      },
    });
  });

  it("declares plain and surface on the variant axis", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["plain", "surface"]);
  });

  it("sets bg.panel and the sm shadow on the scroller for the surface variant", () => {
    expect(recipe.variants?.["variant"]?.["surface"]?.["scroller"]).toMatchObject({
      background: "bg.panel",
      boxShadow: "sm",
    });
  });

  it("declares all none and rows on the rules axis", () => {
    expect(valuesOf(recipe, "rules")).toStrictEqual(["all", "none", "rows"]);
  });

  it("sets border-collapse to separate on the root", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      borderCollapse: "separate",
      borderSpacing: "0",
    });
  });

  it("rules only the end edges of a cell when rules is all", () => {
    const ruled = recipe.variants?.["rules"]?.["all"];
    const ends = { borderBlockEndWidth: "hairline" };

    expect(ruled?.["cell"]).toMatchObject(ends);
    expect(ruled?.["cell"]).not.toHaveProperty("borderBlockStartWidth");
    expect(ruled?.["cell"]).not.toHaveProperty("borderInlineStartWidth");
    expect(ruled?.["columnHeader"]).toMatchObject(ends);
    expect(ruled?.["rowHeader"]).toMatchObject(ends);
  });

  it("selects the last cell of a row with last-child", () => {
    expect(recipe.variants?.["rules"]?.["all"]?.["rowHeader"]).toHaveProperty("&:not(:last-child)");
  });

  it("removes the rule under the last body row when a footer follows", () => {
    expect(recipe.variants?.["rules"]?.["rows"]?.["body"]).toMatchObject({
      "&:has(+ tfoot) > tr:last-of-type > *": { borderBlockEndWidth: "0" },
    });
  });

  it("rules the bottom of the header at every rules value", () => {
    const closed = { "& > tr:last-of-type > th": { borderBlockEndWidth: "indicator" } };

    expect(recipe.variants?.["rules"]?.["all"]?.["header"]).toMatchObject(closed);
    expect(recipe.variants?.["rules"]?.["none"]?.["header"]).toMatchObject(closed);
    expect(recipe.variants?.["rules"]?.["rows"]?.["header"]).toMatchObject(closed);
  });

  it("rules the top of the footer at every rules value", () => {
    const over = { "& > tr:first-of-type > *": { borderBlockStartWidth: "indicator" } };

    expect(recipe.variants?.["rules"]?.["all"]?.["footer"]).toMatchObject(over);
    expect(recipe.variants?.["rules"]?.["none"]?.["footer"]).toMatchObject(over);
    expect(recipe.variants?.["rules"]?.["rows"]?.["footer"]).toMatchObject(over);
  });

  it("reads fg.muted on the column headers at label.sm", () => {
    expect(recipe.base?.["columnHeader"]).toMatchObject({
      color: "fg.muted",
      fontWeight: "medium",
    });
    expect(recipe.variants?.["size"]?.["md"]?.["columnHeader"]).toMatchObject({
      textStyle: "label.sm",
    });
  });

  it("reads fg on a column header with an aria-sort value", () => {
    expect(recipe.base?.["columnHeader"]).toMatchObject({
      "&[aria-sort]:not([aria-sort=none])": { color: "fg" },
    });
  });

  it("declares center end and start on the align axis", () => {
    expect(valuesOf(recipe, "align")).toStrictEqual(["center", "end", "start"]);
  });

  it("fills odd body rows with bg.muted when striped is true", () => {
    expect(recipe.variants?.["striped"]?.["true"]).toStrictEqual({
      body: { "& > tr": { _odd: { background: "bg.muted" } } },
    });
  });

  it("sets tabular numerals at the end of a numeric cell", () => {
    expect(recipe.base?.["cell"]).toMatchObject({
      "&[data-numeric]": { fontVariantNumeric: "tabular-nums", textAlign: "end" },
    });
  });

  it("exports data-numeric as NUMERIC", () => {
    expect(NUMERIC).toBe("data-numeric");
  });

  it("fills the sticky column headers with bg.panel", () => {
    expect(recipe.variants?.["stickyHeader"]?.["true"]?.["columnHeader"]).toStrictEqual({
      background: "bg.panel",
    });
    expect(recipe.variants?.["stickyHeader"]?.["true"]?.["header"]).not.toHaveProperty(
      "background",
    );
  });

  it("fills an interactive row on focus within", () => {
    expect(recipe.variants?.["interactive"]?.["true"]?.["body"]).toMatchObject({
      "& > tr": { _focusWithin: { background: "colorPalette.subtle" } },
    });
  });

  it("makes the row header sticky when stickyColumn is true", () => {
    expect(recipe.variants?.["stickyColumn"]?.["true"]?.["rowHeader"]).toMatchObject({
      insetInlineStart: "0",
      position: "sticky",
    });
  });

  it("writes the kebab-case slot class of both compounds", () => {
    expect(recipe.compoundVariants?.map((each) => each.className)).toStrictEqual([
      "table__body--tracked",
      "table__column-header--cornered",
    ]);
  });

  it("stacks the sticky header above the sticky column", () => {
    expect(recipe.variants?.["stickyHeader"]?.["true"]?.["header"]).toMatchObject({
      "& > tr": { zIndex: "2" },
    });
    expect(recipe.variants?.["stickyColumn"]?.["true"]?.["rowHeader"]).toMatchObject({
      zIndex: "1",
    });
  });

  it("makes the first column header sticky when stickyColumn is true", () => {
    expect(recipe.variants?.["stickyColumn"]?.["true"]?.["columnHeader"]).toMatchObject({
      "&:first-child": { insetInlineStart: "0", position: "sticky" },
    });
  });

  it("stacks the corner header above both sticky bands", () => {
    const [, cornered] = recipe.compoundVariants ?? [];

    expect(cornered?.css).toStrictEqual({ columnHeader: { "&:first-child": { zIndex: "2" } } });
  });

  it("matches the Table tag and its parts", () => {
    expect(recipe.jsx).toStrictEqual([/^Table(\.\w+)?$/u]);
  });
});
