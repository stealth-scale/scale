import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#page/page.specimen.tsx";
import { GUTTER, MEASURE, recipe } from "#page/recipe.ts";

/**
 * Slots of the page recipe, which the recipe check reads.
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
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Page"], parts: PARTS })).toStrictEqual([]);
  });

  it("sets className to page", () => {
    expect(recipe.className).toBe("page");
  });

  it("declares twenty slots", () => {
    expect(recipe.slots).toStrictEqual(PARTS);
  });

  it("declares six axes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "align",
      "divided",
      "folded",
      "gutter",
      "measure",
      "size",
    ]);
  });

  it("folds an action by its priority", () => {
    expect(recipe.base?.["action"]?.["&[data-priority=tertiary]"]).toStrictEqual({
      "[data-narrow] &": { display: "none" },
    });
  });

  it("reads the priority from each action", () => {
    expect(axesOf(recipe)).not.toContain("priority");
  });

  it("shows the folded control on a folded page alone", () => {
    expect(recipe.base?.["folded"]).toMatchObject({ display: "none" });
    expect(recipe.base?.["folded"]?.["[data-narrow] &"]).toMatchObject({
      display: "inline-flex",
    });
  });

  it("names the measured axis folded apart from measure narrow", () => {
    expect(valuesOf(recipe, "measure")).toContain("narrow");
    expect(axesOf(recipe)).not.toContain("narrow");
  });

  it("defaults to a full-width page at md with the xl gutter", () => {
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
      rowGap: "calc({spacing.gap.sm} * var(--density, 1))",
    });
  });

  it("separates the header's rows by a gap one size smaller", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["header"]?.["rowGap"]).toBe(
      "calc({spacing.gap.sm} * var(--density, 1))",
    );
  });

  it("sets the context one size smaller", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["context"]).toStrictEqual({
      gap: "calc({spacing.gap.md} * var(--density, 1))",
      textStyle: "body.sm",
    });
  });

  it("sets the title one size larger than a section title", () => {
    expect(recipe.variants?.["size"]?.["sm"]?.["title"]).toStrictEqual({ textStyle: "heading.md" });
    expect(recipe.variants?.["size"]?.["md"]?.["title"]).toStrictEqual({ textStyle: "heading.lg" });
    expect(recipe.variants?.["size"]?.["lg"]?.["title"]).toStrictEqual({ textStyle: "heading.xl" });
  });

  it("pads the body and the banner on the block axis alone", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["body"]).toStrictEqual({
      paddingBlock: "calc({spacing.inset.md} * var(--density, 1))",
    });
    expect(recipe.variants?.["size"]?.["md"]?.["banner"]).toStrictEqual({
      paddingBlock: "calc({spacing.inset.md} * var(--density, 1))",
    });
  });

  it("declares three measures", () => {
    expect(valuesOf(recipe, "measure")).toStrictEqual(["full", "narrow", "wide"]);
  });

  it("names the width axis measure", () => {
    expect(axesOf(recipe)).not.toContain("width");
  });

  it("pads the content of every edge-to-edge band", () => {
    const lead = `var(--page-lead, var(${GUTTER}))`;

    expect(recipe.base?.["header"]).toMatchObject({ paddingInlineStart: lead });
    expect(recipe.base?.["body"]).toMatchObject({ paddingInlineStart: lead });
  });

  it("stops every band's content at the measure", () => {
    expect(recipe.base?.["header"]?.["paddingInlineEnd"]).toBe(
      `max(var(${GUTTER}), calc(100% - var(${MEASURE}, 100%) - var(--page-lead, var(${GUTTER}))))`,
    );
  });

  it("splits the spare room between both sides of a centred page", () => {
    expect(recipe.variants?.["align"]?.["center"]?.["root"]).toStrictEqual({
      "--page-lead": `max(var(${GUTTER}), calc((100% - var(${MEASURE}, 100%)) / 2))`,
    });
    expect(recipe.variants?.["align"]?.["start"]?.["root"]).toStrictEqual({
      "--page-lead": `var(${GUTTER})`,
    });
  });

  it("lays the header out as a grid of named areas", () => {
    expect(recipe.base?.["header"]).toMatchObject({ display: "grid" });
  });

  it("fills a sticky band", () => {
    expect(recipe.base?.["header"]?.["&[data-sticky]"]).toMatchObject({
      background: "bg",
      position: "sticky",
    });
  });

  it("removes the header's hairline above the navigation", () => {
    expect(recipe.base?.["header"]?.["&:has(+ .page__nav)"]).toStrictEqual({
      borderBlockEndWidth: "0",
    });
  });

  it("selects another band by its class", () => {
    expect(JSON.stringify(recipe)).not.toContain("data-part");
  });

  it("lays the body beside an aside from the lg breakpoint", () => {
    expect(recipe.base?.["root"]?.["&:has(> .page__aside)"]).toStrictEqual({
      lg: {
        columnGap: "calc({spacing.gap.xl} * var(--density, 1))",
        display: "grid",
        gridTemplateAreas:
          '"banner banner" "header header" "nav nav" "toolbar toolbar" "body aside" "footer footer"',
        gridTemplateColumns: "minmax(0, 1fr) auto",
        gridTemplateRows: "auto auto auto auto 1fr auto",
      },
    });
  });

  it("names the area each band takes in that grid", () => {
    const areas = ["banner", "header", "nav", "toolbar", "body", "aside", "footer"] as const;

    expect(areas.map((band) => recipe.base?.[band]?.["gridArea"])).toStrictEqual([...areas]);
  });

  it("hides an aside with folds hide below the lg breakpoint", () => {
    expect(recipe.base?.["aside"]?.["&[data-folds=hide]"]).toStrictEqual({
      lgDown: { display: "none" },
    });
  });

  it("keeps a sticky aside at the top of its row under the shell's sticky bars", () => {
    expect(recipe.base?.["aside"]?.["&[data-sticky]"]).toStrictEqual({
      alignSelf: "start",
      insetBlockStart: "calc(var(--app-shell-sticky-top, 0px) + {spacing.gap.xl})",
      position: "sticky",
    });
  });

  it("pads an aside beside the body at its end alone", () => {
    expect(recipe.base?.["aside"]).toMatchObject({
      lg: { paddingInlineStart: "0" },
      paddingInline: `var(${GUTTER})`,
    });
  });

  it("pads an aside on the block axis like the body", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["aside"]).toStrictEqual(
      recipe.variants?.["size"]?.["md"]?.["body"],
    );
  });

  it("stacks the meta under the title on a folded page", () => {
    const stacked = recipe.compoundVariants?.find((each) =>
      (each.className ?? "").endsWith("header--stacked"),
    );

    expect(stacked?.css?.["header"]?.["gridTemplateAreas"]).toContain('"meta meta meta"');
  });

  it("removes the meta's start margin on a folded page", () => {
    const stacked = recipe.compoundVariants?.find((each) =>
      (each.className ?? "").endsWith("meta--stacked"),
    );

    expect(stacked?.css?.["meta"]).toStrictEqual({ marginInlineStart: "0" });
  });

  it("sets the sm gutter on a folded page", () => {
    expect(recipe.variants?.["folded"]?.["true"]?.["root"]).toStrictEqual({
      [GUTTER]: "{spacing.inset.sm}",
    });
  });

  it("matches every Page tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Page(\.\w+)?$/u]);
  });
});
