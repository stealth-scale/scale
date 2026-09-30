import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { FLAT_PALETTE, tabbed, TABS } from "#page/metrics.ts";
import page from "#page/page.specimen.tsx";
import {
  GUTTER,
  MEASURE,
  recipe,
  SCROLLPORT,
  STICKY_OFFSET,
  STICKY_TOP,
  TOOLBAR,
} from "#page/recipe.ts";
import { recipe as toolbar } from "#toolbar/recipe.ts";

/**
 * Room a focus ring takes outside an element, as the recipe writes it.
 */
const RING = "calc(var(--focus-ring-offset, 0px) + var(--focus-ring-width, 0px))";

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
  "nav",
  "tabs",
  "picker",
  "palette",
  "toolbar",
  "body",
  "aside",
  "asideScroller",
  "asideContent",
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

  it("declares twenty-one slots", () => {
    expect(recipe.slots).toStrictEqual(PARTS);
  });

  it("caps a sticky aside beside the body at the room under the sticky bands", () => {
    expect(recipe.base?.["aside"]?.["&[data-sticky]"]?.["lg"]).toStrictEqual({
      display: "flex",
      flexDirection: "column",
      maxBlockSize: `calc(var(${SCROLLPORT}, 100dvh) - var(--app-shell-sticky-top, 0px) - var(${STICKY_TOP}, 0px) - {spacing.gap.xl} * 2)`,
    });
  });

  it("pulls a sticky aside's scroll area out by its content's padding", () => {
    expect(recipe.base?.["asideScroller"]).toStrictEqual({ margin: `calc(${RING} * -1)` });
  });

  it("pads a sticky aside's content by the room a focus ring takes", () => {
    expect(recipe.base?.["asideContent"]).toStrictEqual({ padding: RING });
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

  it("folds a secondary action to its icon on a narrow page", () => {
    expect(recipe.base?.["action"]?.["&[data-priority=secondary]"]).toMatchObject({
      "&[data-narrow]": { aspectRatio: "square" },
    });
  });

  it("reads the priority from each action", () => {
    expect(axesOf(recipe)).not.toContain("priority");
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

  it("pads the header by the inset and by a gap before the navigation", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["header"]).toStrictEqual({
      "&:has(+ .page__nav)": { paddingBlockEnd: "calc({spacing.gap.md} * var(--density, 1))" },
      paddingBlock: "calc({spacing.inset.md} * var(--density, 1))",
    });
  });

  it("sets no gap between the header's rows", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["header"]).not.toHaveProperty("rowGap");
    expect(recipe.base?.["header"]).not.toHaveProperty("rowGap");
  });

  it("sets the context one size smaller with a small margin above the title's row", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["context"]).toStrictEqual({
      gap: "calc({spacing.gap.md} * var(--density, 1))",
      marginBlockEnd: "{spacing.0.5}",
      textStyle: "body.sm",
    });
    expect(recipe.variants?.["size"]?.["lg"]?.["context"]).toMatchObject({
      marginBlockEnd: "{spacing.1}",
    });
  });

  it("sets the description in fg.subtle at the body role of its size", () => {
    expect(recipe.base?.["description"]).toMatchObject({ color: "fg.subtle" });
    expect(recipe.variants?.["size"]?.["lg"]?.["description"]).toStrictEqual({
      textStyle: "body.md",
    });
    expect(recipe.variants?.["size"]?.["sm"]?.["description"]).toStrictEqual({
      textStyle: "body.sm",
    });
  });

  it("parts the actions from the title by the xl inset", () => {
    expect(recipe.base?.["actions"]).toMatchObject({
      paddingInlineStart: "calc({spacing.inset.xl} * var(--density, 1))",
    });
  });

  it("parts the leading mark from the title by the lg gap", () => {
    expect(recipe.base?.["leading"]).toMatchObject({
      marginInlineEnd: "calc({spacing.gap.lg} * var(--density, 1))",
    });
  });

  it("sets the title one size larger than a section title", () => {
    expect(recipe.variants?.["size"]?.["sm"]?.["title"]).toMatchObject({ textStyle: "heading.md" });
    expect(recipe.variants?.["size"]?.["md"]?.["title"]).toMatchObject({ textStyle: "heading.lg" });
    expect(recipe.variants?.["size"]?.["lg"]?.["title"]).toMatchObject({ textStyle: "heading.xl" });
  });

  it("sets the title of a narrow page one size smaller", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["title"]).toMatchObject({
      ".page__root[data-narrow] > .page__header > &": { textStyle: "heading.md" },
    });
  });

  it("sets the trail one size smaller", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["trail"]).toStrictEqual({
      gap: "calc({spacing.gap.sm} * var(--density, 1))",
      textStyle: "body.sm",
    });
  });

  it("pads the navigation band on the block axis", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["nav"]).toMatchObject({
      paddingBlock: "calc({spacing.gap.md} * var(--density, 1))",
    });
  });

  it("sets a navigation band with a strip of tabs flush on its hairline", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["nav"]).toMatchObject({
      "&:has(> .tabs__root)": { paddingBlock: "0" },
    });
  });

  it("sizes the navigation band's tabs from the page's size", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["nav"]).toMatchObject(tabbed("md"));
    expect(recipe.variants?.["size"]?.["sm"]?.["nav"]).toMatchObject(tabbed("sm"));
  });

  it("parts the navigation band's controls by the lg gap", () => {
    expect(recipe.base?.["nav"]).toMatchObject({
      gap: "calc({spacing.gap.lg} * var(--density, 1))",
    });
  });

  it("renders the palette panel as one box at every size", () => {
    expect(recipe.variants?.["size"]?.["sm"]?.["palette"]).toStrictEqual(FLAT_PALETTE);
    expect(recipe.variants?.["size"]?.["lg"]?.["palette"]).toStrictEqual(FLAT_PALETTE);
  });

  it("shrinks the tabs' root in the navigation band to its tabs", () => {
    expect(TABS).toBe("tabs");
    expect(recipe.base?.["nav"]?.["& > .tabs__root"]).toStrictEqual({
      flex: "0 1 auto",
      inlineSize: "auto",
      minInlineSize: "0",
    });
  });

  it("keeps a toolbar on the row of the navigation band's tabs", () => {
    expect(TOOLBAR).toBe(toolbar.className);
    expect(recipe.base?.["nav"]?.["& > .toolbar__root"]).toStrictEqual({
      flex: "0 1 auto",
      inlineSize: "auto",
    });
  });

  it("truncates the words of the picker", () => {
    expect(recipe.base?.["picker"]?.["& > span"]).toMatchObject({ whiteSpace: "nowrap" });
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

  it("sticks a band under the sticky bands before it", () => {
    expect(recipe.base?.["nav"]?.["&[data-sticky]"]).toMatchObject({
      insetBlockStart: `calc(var(--app-shell-sticky-top, 0px) + var(${STICKY_OFFSET}, 0px))`,
    });
  });

  it("names the properties the root sets for its sticky bands", () => {
    expect([STICKY_OFFSET, STICKY_TOP]).toStrictEqual([
      "--page-sticky-offset",
      "--page-sticky-top",
    ]);
  });

  it("removes the header's hairline above the navigation in the divided look", () => {
    expect(
      recipe.variants?.["divided"]?.["true"]?.["header"]?.["&:has(+ .page__nav)"],
    ).toStrictEqual({ borderBlockEndWidth: "0" });
  });

  it("removes the line of a strip of tabs in a divided navigation band", () => {
    expect(
      recipe.variants?.["divided"]?.["true"]?.["nav"]?.["& .page__tabs[data-orientation]"],
    ).toStrictEqual({ borderBlockEndWidth: "0" });
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

  it("keeps a sticky aside at the top of its row under the sticky bars and bands", () => {
    expect(recipe.base?.["aside"]?.["&[data-sticky]"]).toMatchObject({
      alignSelf: "start",
      insetBlockStart: `calc(var(--app-shell-sticky-top, 0px) + var(${STICKY_TOP}, 0px) + {spacing.gap.xl})`,
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

  it("moves the meta's start margin above and below it on a folded page", () => {
    const stacked = recipe.compoundVariants?.find((each) =>
      (each.className ?? "").endsWith("meta--stacked"),
    );

    expect(stacked?.css?.["meta"]).toStrictEqual({
      marginBlock: "calc({spacing.gap.sm} * var(--density, 1))",
      marginInlineStart: "0",
    });
  });

  it("parts the actions of a folded page from the title by the sm inset", () => {
    const stacked = recipe.compoundVariants?.find((each) =>
      (each.className ?? "").endsWith("actions--stacked"),
    );

    expect(stacked?.css?.["actions"]).toStrictEqual({
      paddingInlineStart: "calc({spacing.inset.sm} * var(--density, 1))",
    });
  });

  it("sets the md gutter on a folded page", () => {
    expect(recipe.variants?.["folded"]?.["true"]?.["root"]).toStrictEqual({
      [GUTTER]: "{spacing.inset.md}",
    });
  });

  it("matches every Page tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Page(\.\w+)?$/u]);
  });
});
