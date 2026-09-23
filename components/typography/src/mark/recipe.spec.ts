import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";
import { PALETTES } from "@stealthscale/theme/authoring";

import page from "#mark/mark.specimen.tsx";
import { recipe } from "#mark/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Mark"] })).toStrictEqual([]);
  });

  it("sets className to mark", () => {
    expect(recipe.className).toBe("mark");
  });

  it("declares six variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "effect",
      "inset",
      "motion",
      "palette",
      "radius",
      "variant",
    ]);
  });

  it("defaults to the subtle look at the xs inset with the l1 corner", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ inset: "xs", radius: "l1", variant: "subtle" });
  });

  it("declares six looks on the variant axis", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual([
      "outline",
      "plain",
      "solid",
      "subtle",
      "surface",
      "text",
    ]);
  });

  it("declares the eight semantic palettes on the palette axis", () => {
    expect(valuesOf(recipe, "palette")).toStrictEqual([...PALETTES].toSorted());
  });

  it("lists every palette under staticCss", () => {
    expect(recipe.staticCss).toStrictEqual([{ palette: [...PALETTES] }]);
  });

  it("declares four corners on the radius axis", () => {
    expect(valuesOf(recipe, "radius")).toStrictEqual(["full", "l1", "l2", "l3"]);
  });

  it("declares three insets on the inset axis", () => {
    expect(valuesOf(recipe, "inset")).toStrictEqual(["md", "sm", "xs"]);
  });

  it("sets only padding-inline at each inset", () => {
    expect(recipe.variants?.["inset"]?.["md"]).toStrictEqual({
      paddingInline: "calc({spacing.inset.md} * var(--density, 1))",
    });
  });

  it.each(["plain", "text"] as const)("sets no inline padding in the %s look", (look) => {
    expect(recipe.variants?.["variant"]?.[look]).toMatchObject({ paddingInline: "0" });
  });

  it("repeats the inset and corners on every line of a wrapped highlight", () => {
    expect(recipe.base).toMatchObject({ boxDecorationBreak: "clone" });
  });

  it("sets color to colorPalette.fg in the tinted compound", () => {
    expect(recipe.compoundVariants).toStrictEqual([
      {
        className: "mark--tinted",
        css: { color: "colorPalette.fg" },
        palette: [...PALETTES],
        variant: ["plain", "text"],
      },
    ]);
  });

  it("matches every JSX tag that ends in Mark", () => {
    expect(recipe.jsx).toStrictEqual([/Mark$/u]);
  });
});
