import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { NUMERIC, recipe } from "#table/recipe.ts";
import page from "#table/table.specimen.tsx";

const PARTS = [
  "scroller",
  "viewport",
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
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
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

  it("fills a selected row with Highlight in forced colours", () => {
    expect(recipe.base?.["row"]).toMatchObject({
      _selected: { _highContrast: { background: "Highlight", color: "HighlightText" } },
    });
  });

  it("declares fourteen slots in markup order", () => {
    expect(recipe.slots).toStrictEqual(PARTS);
  });

  it("rings the scroller while the viewport has keyboard focus", () => {
    expect(recipe.base?.["scroller"]).toMatchObject({
      "&:has(.table__viewport:focus-visible)": {
        outlineColor: "colorPalette.focusRing",
        outlineOffset: "ring",
        outlineStyle: "solid",
        outlineWidth: "ring",
      },
    });
  });

  it("hides the scroll area's own focus ring", () => {
    expect(recipe.base?.["scroller"]).toMatchObject({ "--scroll-area-ring-style": "none" });
  });

  it("clips the surface scroller to its corners", () => {
    expect(recipe.variants?.["variant"]?.["surface"]?.["scroller"]).toMatchObject({
      overflow: "hidden",
    });
  });

  it("declares twelve axes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "align",
      "banded",
      "interactive",
      "layout",
      "palette",
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

  it("sets the palette on the scroller", () => {
    expect(recipe.variants?.["palette"]?.["info"]).toStrictEqual({
      scroller: { colorPalette: "info" },
    });
  });

  it("emits every palette", () => {
    expect(recipe.staticCss).toContainEqual({
      palette: ["primary", "secondary", "accent", "neutral", "info", "success", "warning", "error"],
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

  it("renders the surface scroller on bg.panel inside a hairline edge", () => {
    expect(recipe.variants?.["variant"]?.["surface"]?.["scroller"]).toMatchObject({
      background: "bg.panel",
      borderWidth: "hairline",
    });
  });

  it("casts no shadow from the surface scroller", () => {
    expect(recipe.variants?.["variant"]?.["surface"]?.["scroller"]).toMatchObject({
      boxShadow: "none",
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
