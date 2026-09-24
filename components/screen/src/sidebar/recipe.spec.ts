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

  it("declares eleven slots", () => {
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

  it("scrolls the content instead of the root", () => {
    expect(recipe.base?.["content"]).toMatchObject({ overflowY: "auto" });
    expect(recipe.base?.["root"]).not.toHaveProperty("overflowY");
  });

  it("places the block control in the label's row", () => {
    expect(recipe.base?.["nav"]).toMatchObject({
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) auto",
    });
    expect(recipe.base?.["navAction"]).toMatchObject({ gridColumn: "2 / 3" });
    expect(recipe.base?.["navLabel"]).toMatchObject({ gridColumn: "1 / 2" });
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
      marginInlineEnd: "calc({spacing.inset.sm} * var(--density, 1))",
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
      paddingInline: "calc({spacing.inset.sm} * var(--density, 1))",
    });
  });

  it("insets the header by the content's padding and a row's inset", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["header"]).toMatchObject({
      paddingInline:
        "calc(calc({spacing.gap.md} * var(--density, 1)) + calc({spacing.inset.sm} * var(--density, 1)))",
    });
  });

  it("hides the header and footer words visually on a rail", () => {
    const railed = { "& > :not(svg)": { srOnly: true }, justifyContent: "center" };

    expect(recipe.base?.["header"]?.["[data-iconic] &"]).toStrictEqual(railed);
    expect(recipe.base?.["footer"]?.["[data-iconic] &"]).toStrictEqual(railed);
  });

  it("hides a block's label visually on a rail", () => {
    expect(recipe.base?.["navLabel"]?.["[data-iconic] &"]).toStrictEqual({ srOnly: true });
  });

  it("fills the band the search is placed in", () => {
    expect(recipe.base?.["search"]).toMatchObject({ inlineSize: "full", minInlineSize: "0" });
  });

  it("removes the search from a rail", () => {
    expect(recipe.base?.["search"]?.["[data-iconic] &"]).toStrictEqual({ display: "none" });
  });

  it("removes the block control from a rail", () => {
    expect(recipe.base?.["navAction"]?.["[data-iconic] &"]).toStrictEqual({ display: "none" });
  });

  it("matches every Sidebar tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Sidebar(\.\w+)?$/u]);
  });
});
