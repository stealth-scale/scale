import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#tag/recipe.ts";
import page from "#tag/tag.specimen.tsx";

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
        names: ["Tag.Root"],
        parts: ["root", "label", "startElement", "endElement", "closeTrigger"],
      }),
    ).toStrictEqual([]);
  });

  it("sets className to tag", () => {
    expect(recipe.className).toBe("tag");
  });

  it("declares effect palette radius size and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["effect", "palette", "radius", "size", "variant"]);
  });

  it("defaults to the middle size in the surface look with the l2 corner", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ radius: "l2", size: "md", variant: "surface" });
  });

  it("declares sm md lg and xl on the size axis", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm", "xl"]);
  });

  it("declares the five flat looks on the variant axis", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual([
      "outline",
      "plain",
      "solid",
      "subtle",
      "surface",
    ]);
  });

  it("truncates the label on the inline axis only so descenders are not cut", () => {
    expect(recipe.base?.["label"]).toMatchObject({
      minInlineSize: "0",
      overflowX: "clip",
      overflowY: "visible",
      textOverflow: "ellipsis",
    });
  });

  it("raises the label a tenth of an em to centre its text in the tag", () => {
    expect(recipe.base?.["label"]).toMatchObject({ translate: "0 -0.1em" });
  });

  it("pulls each mark an eighth of an em towards the tag's edge", () => {
    expect(recipe.base?.["startElement"]).toMatchObject({ marginInlineStart: "-0.125em" });
    expect(recipe.base?.["endElement"]).toMatchObject({ marginInlineEnd: "-0.125em" });
  });

  it("pads a middle tag by the medium gap with the extra small gap between its parts", () => {
    expect(recipe.variants?.["size"]?.["md"]).toStrictEqual({
      root: {
        gap: "calc({spacing.gap.xs} * var(--density, 1))",
        height: "calc({sizes.tag.md} * var(--density, 1))",
        paddingInline: "calc({spacing.gap.md} * var(--density, 1))",
        textStyle: "label.sm",
      },
    });
  });

  it("gives the close trigger a touch target under a coarse pointer", () => {
    expect(recipe.base?.["closeTrigger"]).toMatchObject({ _touch: { position: "relative" } });
  });

  it("inks the close trigger's hover and focus ring with the contrast role on a solid tag", () => {
    expect(
      recipe.compoundVariants?.find((each) => each.variant === "solid")?.css?.["closeTrigger"],
    ).toStrictEqual({
      _hover: { background: "colorPalette.contrast/20" },
      focusRingColor: "colorPalette.contrast",
    });
  });

  it("outlines the root in CanvasText in forced colors mode", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      _highContrast: { outlineColor: "CanvasText", outlineStyle: "solid" },
    });
  });

  it("draws the close trigger's focus ring inside its box", () => {
    expect(recipe.base?.["closeTrigger"]).toMatchObject({ focusVisibleRing: "inside" });
  });
});
