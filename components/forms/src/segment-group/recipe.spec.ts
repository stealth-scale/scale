import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import {
  axesOf,
  defaultsOf,
  recipeViolations,
  scaleOf,
  valuesOf,
} from "@stealthscale/testing-theme";
import { PALETTES } from "@stealthscale/theme/authoring";

import { recipe } from "#segment-group/recipe.ts";
import page from "#segment-group/segment-group.specimen.tsx";

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
        names: ["SegmentGroup"],
        parts: ["root", "indicator", "item", "itemText"],
      }),
    ).toStrictEqual([]);
  });

  it("uses the class name segment-group", () => {
    expect(recipe.className).toBe("segment-group");
  });

  it("declares the four slots", () => {
    expect(recipe.slots).toStrictEqual(["root", "indicator", "item", "itemText"]);
  });

  it("declares five axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["fitted", "iconic", "palette", "size", "variant"]);
  });

  it("defaults to a surface thumb at size md in the primary palette", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      palette: "primary",
      size: "md",
      variant: "surface",
    });
  });

  it("offers three looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["outline", "solid", "surface"]);
  });

  it("offers five sizes", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm", "xl", "xs"]);
  });

  it("emits every palette it offers", () => {
    expect(recipe.staticCss).toContainEqual({ palette: [...PALETTES] });
  });

  it("sizes and places the thumb from the four properties the machine writes", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({
      height: "var(--height)",
      left: "var(--left)",
      top: "var(--top)",
      width: "var(--width)",
    });
  });

  it("slides the thumb at the move pace", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({
      "--transition-duration": "{durations.move}",
      "--transition-timing-function": "{easings.move}",
    });
  });

  it("stops the slide under reduced motion", () => {
    expect(recipe.base?.["indicator"]?.["_motionReduce"]).toStrictEqual({
      "--transition-duration": "0s",
    });
  });

  it("keeps every item at least 24px tall", () => {
    expect(JSON.stringify(scaleOf(recipe, "size", "item", ["xs"])[0])).toContain(
      '"height":"max({sizes.6}, ',
    );
  });

  it("draws the focus ring inside the item's edge", () => {
    expect(recipe.base?.["item"]).toMatchObject({
      _focusVisible: { outlineOffset: "calc({borderWidths.ring} * -1)" },
      focusVisibleRing: "inside",
    });
  });

  it("draws the focus ring in the contrast ink on a checked solid item", () => {
    expect(scaleOf(recipe, "variant", "item", ["solid"])[0]).toMatchObject({
      _checked: { focusRingColor: "colorPalette.contrast" },
    });
  });

  it("insets the ring of a checked solid item two ring widths", () => {
    expect(scaleOf(recipe, "variant", "item", ["solid"])[0]).toMatchObject({
      _checked: { _focusVisible: { outlineOffset: "calc({borderWidths.ring} * -2)" } },
    });
  });

  it("hides the separator of the first item and of the checked item", () => {
    expect(recipe.base?.["item"]?.["&:is(:first-of-type, [data-state=checked])"]).toStrictEqual({
      _before: { opacity: "0" },
    });
  });

  it("hides the separator of the item after the checked item", () => {
    expect(recipe.base?.["item"]?.["&[data-state=checked] + &"]).toStrictEqual({
      _before: { opacity: "0" },
    });
  });

  it("paints a checked item with its thumb's fill before the machine measures", () => {
    expect(scaleOf(recipe, "variant", "item", ["solid", "surface", "outline"])).toMatchObject([
      { "&[data-ssr]": { _checked: { background: "colorPalette.solid" } } },
      { "&[data-ssr]": { _checked: { background: "bg.panel" } } },
      { "&[data-ssr]": { _checked: { background: "colorPalette.subtle" } } },
    ]);
  });

  it("restates the invalid edge on the outline look", () => {
    expect(scaleOf(recipe, "variant", "root", ["outline"])[0]).toMatchObject({
      _invalid: { borderColor: "border.error" },
    });
  });

  it("keeps the track as wide as its items when not fitted", () => {
    expect(recipe.base?.["root"]).toMatchObject({ blockSize: "fit", inlineSize: "fit" });
  });

  it("fills the width of its container when fitted", () => {
    expect(scaleOf(recipe, "fitted", "root", ["true"])[0]).toStrictEqual({
      display: "flex",
      inlineSize: "full",
    });
  });

  it("hides the words of an iconic item visually", () => {
    expect(scaleOf(recipe, "iconic", "item", ["true"])[0]).toStrictEqual({
      "& > :not(svg)": { srOnly: true },
    });
  });

  it("squares the items of an iconic group", () => {
    expect(recipe.compoundVariants?.find((compound) => compound.iconic === true)).toMatchObject({
      css: { item: { aspectRatio: "square", paddingInline: "0" } },
    });
  });

  it("fills the thumb with Highlight under forced colors on every look", () => {
    expect(
      recipe.compoundVariants?.find((compound) => Array.isArray(compound.variant)),
    ).toMatchObject({
      css: { indicator: { _highContrast: { background: "Highlight", forcedColorAdjust: "none" } } },
      variant: ["solid", "surface", "outline"],
    });
  });

  it("tracks JSX named SegmentGroup and its parts", () => {
    expect(recipe.jsx).toStrictEqual([/^SegmentGroup(\.\w+)?$/u]);
  });
});
