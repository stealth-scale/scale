import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#sidebar/recipe.ts";
import page from "#sidebar/sidebar.specimen.tsx";

/**
 * Slots of the sidebar recipe, in declaration order.
 */
const PARTS = [
  "root",
  "header",
  "scroller",
  "content",
  "footer",
  "nav",
  "navLabel",
  "navHeading",
  "navAction",
  "search",
  "empty",
  "separator",
];

/**
 * Selects a band's children that do not fold to an icon by themselves.
 */
const LINES = "& > :not(.sidebar__search, .sidebar__nav, .nav-list__root, .switcher__root)";

/**
 * Selects a band's lines that have no icon form.
 */
const WORDS = "& > :not(svg, .sidebar__search, .sidebar__nav, .nav-list__root, .switcher__root)";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Sidebar"], parts: PARTS })).toStrictEqual([]);
  });

  it("sets className to sidebar", () => {
    expect(recipe.className).toBe("sidebar");
  });

  it("declares twelve slots", () => {
    expect(recipe.slots).toStrictEqual(PARTS);
  });

  it("declares two axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["size", "variant"]);
  });

  it("defaults to a plain sidebar at md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "plain" });
  });

  it("declares four looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["outline", "plain", "subtle", "surface"]);
  });

  it("fills the subtle look without an edge", () => {
    expect(recipe.variants?.["variant"]?.["subtle"]?.["root"]).toStrictEqual({
      background: "bg.subtle",
    });
  });

  it("fills the column between the bands with the scroller", () => {
    expect(recipe.base?.["scroller"]).toStrictEqual({ flex: "1", minBlockSize: "0" });
  });

  it("leaves the scrolling to the scroll area", () => {
    expect([recipe.base?.["content"], recipe.base?.["root"]]).not.toContainEqual(
      expect.objectContaining({ overflowY: "auto" }),
    );
  });

  it("stacks the header and the footer in a column", () => {
    expect(recipe.base?.["header"]).toMatchObject({ display: "flex", flexDirection: "column" });
    expect(recipe.base?.["footer"]).toMatchObject({ display: "flex", flexDirection: "column" });
  });

  it("pads a band by the content's padding", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["header"]).toMatchObject({
      padding: "calc({spacing.gap.md} * var(--density, 1))",
    });
    expect(recipe.variants?.["size"]?.["md"]?.["content"]).toMatchObject({
      padding: "calc({spacing.gap.md} * var(--density, 1))",
    });
  });

  it("insets a band's lines of words by a row's inset", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["footer"]?.[LINES]).toStrictEqual({
      marginInline: "calc({spacing.inset.xs} * var(--density, 1))",
    });
  });

  it("places the block control in the label's row", () => {
    expect(recipe.base?.["nav"]).toMatchObject({
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) auto",
    });
    expect(recipe.base?.["navAction"]).toMatchObject({ gridColumn: "2 / 3" });
    expect(recipe.base?.["navLabel"]).toMatchObject({ gridColumn: "1 / 2" });
  });

  it("spaces a block's children as far apart as two rows", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["nav"]).toStrictEqual({
      gap: "calc({spacing.gap.xs} * var(--density, 1))",
    });
  });

  it("fills the block control on hover", () => {
    expect(recipe.base?.["navAction"]).toMatchObject({
      _hover: { background: "colorPalette.muted", color: "fg" },
      background: "transparent",
    });
  });

  it("rings the block control on keyboard focus", () => {
    expect(recipe.base?.["navAction"]).toMatchObject({
      focusRingColor: "colorPalette.focusRing",
      focusVisibleRing: "outside",
    });
  });

  it("sizes the block control as the navigation list's end column", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["navAction"]).toMatchObject({
      blockSize: "max({sizes.6}, calc({sizes.tag.sm} * var(--density, 1)))",
      marginInlineEnd: "calc({spacing.inset.xs} * var(--density, 1))",
      minInlineSize: "max({sizes.6}, calc({sizes.tag.sm} * var(--density, 1)))",
    });
  });

  it("sizes the block control's icon as a row's leading icon", () => {
    expect(recipe.variants?.["size"]?.["lg"]?.["navAction"]?.["& > svg"]).toStrictEqual({
      boxSize: "calc({sizes.icon.md} * var(--density, 1))",
    });
  });

  it("insets the labels by a row's inset", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["navLabel"]).toMatchObject({
      paddingInline: "calc({spacing.inset.xs} * var(--density, 1))",
    });
  });

  it("sizes a block's label as a row of the navigation list", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["navLabel"]).toMatchObject({
      blockSize: "max({sizes.6}, calc({sizes.control.xs} * var(--density, 1)))",
    });
  });

  it("sizes a small block's label as a 24px row", () => {
    expect(recipe.variants?.["size"]?.["sm"]?.["navLabel"]).toMatchObject({
      blockSize: "max({sizes.6}, calc({sizes.tag.md} * var(--density, 1)))",
    });
  });

  it.each([
    { size: "sm", step: "lg" },
    { size: "md", step: "xl" },
    { size: "lg", step: "2xl" },
  ] as const)("spaces the $size content's blocks by the $step gap", ({ size, step }) => {
    expect(recipe.variants?.["size"]?.[size]?.["content"]).toMatchObject({
      gap: `calc({spacing.gap.${step}} * var(--density, 1))`,
    });
  });

  it("sets no margin on a separator between the content's blocks", () => {
    expect(
      recipe.variants?.["size"]?.["md"]?.["content"]?.["& > .sidebar__separator"],
    ).toStrictEqual({ marginBlock: "0" });
  });

  it("hides the header and footer words visually on a rail", () => {
    const railed = { alignItems: "center", [WORDS]: { srOnly: true } };

    expect(recipe.base?.["header"]?.["[data-iconic] &"]).toStrictEqual(railed);
    expect(recipe.base?.["footer"]?.["[data-iconic] &"]).toStrictEqual(railed);
  });

  it("hides a block's label visually on a rail", () => {
    expect(recipe.base?.["navLabel"]?.["[data-iconic] &"]).toStrictEqual({ srOnly: true });
  });

  it("fills the band the search is placed in", () => {
    expect(recipe.base?.["search"]).toMatchObject({ inlineSize: "full", minInlineSize: "0" });
  });

  it("centres the search's button on a rail", () => {
    expect(recipe.base?.["search"]?.["[data-iconic] &"]).toStrictEqual({
      display: "flex",
      justifyContent: "center",
    });
  });

  it("sets a block's label small and uppercase", () => {
    expect(recipe.base?.["navLabel"]).toMatchObject({
      textStyle: "label.xs",
      textTransform: "uppercase",
    });
  });

  it("sets a block's label in fg.subtle at the medium weight", () => {
    expect(recipe.base?.["navLabel"]).toMatchObject({ color: "fg.subtle", fontWeight: "medium" });
  });

  it("sets the header's words one size above the rows' words", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["header"]).toMatchObject({
      textStyle: "label.sm",
    });
  });

  it("removes the block control from a rail", () => {
    expect(recipe.base?.["navAction"]?.["[data-iconic] &"]).toStrictEqual({ display: "none" });
  });

  it("matches every Sidebar tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Sidebar(\.\w+)?$/u]);
  });
});
