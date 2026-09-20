import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { GUTTER, MEASURE, recipe } from "#page/recipe.ts";

/**
 * The parts a page draws, which the check is handed to read the slots by.
 */
const PARTS = [
  "root",
  "banner",
  "header",
  "context",
  "leading",
  "title",
  "meta",
  "description",
  "actions",
  "action",
  "folded",
  "nav",
  "tabs",
  "picker",
  "palette",
  "toolbar",
  "body",
  "aside",
  "footer",
  "trail",
];

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Page"], parts: PARTS })).toStrictEqual([]);
  });

  it("names its class page", () => {
    expect(recipe.className).toBe("page");
  });

  it("styles the twenty parts a page draws", () => {
    expect(recipe.slots).toStrictEqual(PARTS);
  });

  it("offers the six axes a page takes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "align",
      "divided",
      "folded",
      "gutter",
      "measure",
      "size",
    ]);
  });

  it("folds a control in the header by the priority the control states", () => {
    expect(recipe.base?.["action"]?.["&[data-priority=tertiary]"]).toStrictEqual({
      "[data-narrow] &": { display: "none" },
    });
  });

  it("reads the priority off each control rather than off the page", () => {
    expect(axesOf(recipe)).not.toContain("priority");
  });

  it("draws the control holding what was dropped only on a folded page", () => {
    expect(recipe.base?.["folded"]).toMatchObject({ display: "none" });
    expect(recipe.base?.["folded"]?.["[data-narrow] &"]).toMatchObject({
      display: "inline-flex",
    });
  });

  it("names the measured state apart from the width the measure offers", () => {
    expect(valuesOf(recipe, "measure")).toContain("narrow");
    expect(axesOf(recipe)).not.toContain("narrow");
  });

  it("draws a full-width page at the middle size with a wide gutter when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      align: "start",
      divided: true,
      gutter: "xl",
      measure: "full",
      size: "md",
    });
  });

  it("keeps the header closer to its body than to the bar above it", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["header"]).toStrictEqual({
      paddingBlockEnd: "calc({spacing.gap.md} * var(--density, 1))",
      paddingBlockStart: "calc({spacing.inset.md} * var(--density, 1))",
    });
  });

  it("sets the context a text step below the page", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["context"]).toStrictEqual({
      gap: "calc({spacing.gap.md} * var(--density, 1))",
      textStyle: "body.sm",
    });
  });

  it("sets the title one heading step above a section's at the same size", () => {
    expect(recipe.variants?.["size"]?.["sm"]?.["title"]).toStrictEqual({ textStyle: "heading.md" });
    expect(recipe.variants?.["size"]?.["md"]?.["title"]).toStrictEqual({ textStyle: "heading.lg" });
    expect(recipe.variants?.["size"]?.["lg"]?.["title"]).toStrictEqual({ textStyle: "heading.xl" });
  });

  it("insets the body and the banner on the block axis alone so the gutter holds", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["body"]).toStrictEqual({
      paddingBlock: "calc({spacing.inset.md} * var(--density, 1))",
    });
    expect(recipe.variants?.["size"]?.["md"]?.["banner"]).toStrictEqual({
      paddingBlock: "calc({spacing.inset.md} * var(--density, 1))",
    });
  });

  it("offers the three widths a page reads at", () => {
    expect(valuesOf(recipe, "measure")).toStrictEqual(["full", "narrow", "wide"]);
  });

  it("names the width axis apart from the style prop that would shadow it", () => {
    expect(axesOf(recipe)).not.toContain("width");
  });

  it("runs every band edge to edge and insets what it holds", () => {
    expect(recipe.base?.["header"]).toMatchObject({
      paddingInlineStart: `var(${GUTTER})`,
    });
    expect(recipe.base?.["body"]).toMatchObject({ paddingInlineStart: `var(${GUTTER})` });
  });

  it("leaves the spare room at the end rather than centring the column", () => {
    expect(recipe.base?.["header"]?.["paddingInlineEnd"]).toBe(
      `max(var(${GUTTER}), calc(100% - var(${MEASURE}, 100%) - var(${GUTTER})))`,
    );
  });

  it("places the header as a grid so its parts are written flat", () => {
    expect(recipe.base?.["header"]).toMatchObject({ display: "grid" });
  });

  it("fills a band that sticks", () => {
    expect(recipe.base?.["header"]?.["&[data-sticky]"]).toMatchObject({
      background: "bg",
      position: "sticky",
    });
  });

  it("drops the header's hairline where a navigation carries one under it", () => {
    expect(recipe.base?.["header"]?.["&:has(+ .page__nav)"]).toStrictEqual({
      borderBlockEndWidth: "0",
    });
  });

  it("reaches another band by the class its binding writes rather than by a part attribute", () => {
    expect(JSON.stringify(recipe)).not.toContain("data-part");
  });

  it("lays the body beside an aside from the large breakpoint up", () => {
    expect(recipe.base?.["root"]?.["&:has(> .page__aside)"]).toStrictEqual({
      lg: {
        columnGap: "calc({spacing.gap.xl} * var(--density, 1))",
        display: "grid",
        gridTemplateAreas:
          '"banner banner" "header header" "nav nav" "toolbar toolbar" "body aside" "footer footer"',
        gridTemplateColumns: "minmax(0, 1fr) auto",
      },
    });
  });

  it("names the area each band takes in that grid", () => {
    const areas = ["banner", "header", "nav", "toolbar", "body", "aside", "footer"] as const;

    expect(areas.map((band) => recipe.base?.[band]?.["gridArea"])).toStrictEqual([...areas]);
  });

  it("drops an aside that folds to nothing below the large breakpoint", () => {
    expect(recipe.base?.["aside"]?.["&[data-folds=hide]"]).toStrictEqual({
      lgDown: { display: "none" },
    });
  });

  it("keeps a sticking aside at the top of its row under the shell's pinned bars", () => {
    expect(recipe.base?.["aside"]?.["&[data-sticky]"]).toStrictEqual({
      alignSelf: "start",
      insetBlockStart: "calc(var(--app-shell-sticky-top, 0px) + {spacing.gap.xl})",
      position: "sticky",
    });
  });

  it("insets an aside beside the body on its end alone", () => {
    expect(recipe.base?.["aside"]).toMatchObject({
      lg: { paddingInlineStart: "0" },
      paddingInline: `var(${GUTTER})`,
    });
  });

  it("insets an aside on the block axis as the body is so the two start on one line", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["aside"]).toStrictEqual(
      recipe.variants?.["size"]?.["md"]?.["body"],
    );
  });

  it("stacks the marks under the title on a narrow page", () => {
    const stacked = recipe.compoundVariants?.find((each) =>
      (each.className ?? "").endsWith("header--stacked"),
    );

    expect(stacked?.css?.["header"]?.["gridTemplateAreas"]).toContain('"meta meta meta"');
  });

  it("pulls the gutter in by one step on a folded page", () => {
    expect(recipe.variants?.["folded"]?.["true"]?.["root"]).toStrictEqual({
      [GUTTER]: "{spacing.inset.sm}",
    });
  });

  it("tracks every tag under the Page namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^Page(\.\w+)?$/u]);
  });
});
