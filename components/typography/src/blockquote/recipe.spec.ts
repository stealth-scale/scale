import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";
import { PALETTES } from "@stealthscale/theme/authoring";

import page from "#blockquote/blockquote.specimen.tsx";
import { recipe } from "#blockquote/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Blockquote.Root", "Blockquote.Content", "Blockquote.Caption", "Blockquote.Icon"],
        parts: ["root", "content", "caption", "icon"],
      }),
    ).toStrictEqual([]);
  });

  it("sets className to blockquote", () => {
    expect(recipe.className).toBe("blockquote");
  });

  it("declares four slots in the order a caller nests the parts", () => {
    expect(recipe.slots).toStrictEqual(["root", "content", "caption", "icon"]);
  });

  it("declares five variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["justify", "motion", "palette", "size", "variant"]);
  });

  it("defaults to the subtle look at md aligned to the start", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ justify: "start", size: "md", variant: "subtle" });
  });

  it("defaults to the neutral palette", () => {
    expect(recipe.base?.root).toMatchObject({ colorPalette: "neutral" });
  });

  it("declares five looks on the variant axis", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual([
      "glass",
      "plain",
      "solid",
      "subtle",
      "surface",
    ]);
  });

  it("renders the quotation upright", () => {
    expect(recipe.base?.content).not.toHaveProperty("fontStyle");
  });

  it("sets the icon font size to one line of the quotation", () => {
    expect(recipe.base?.icon).toMatchObject({ fontSize: "1lh" });
  });

  it("puts an icon in a start gutter at justify start", () => {
    expect(recipe.variants?.justify.start.root).toMatchObject({
      "&:has(> .blockquote__icon)": { gridTemplateColumns: "auto minmax(0, 1fr)" },
    });
  });

  it("sets no start padding in the plain look", () => {
    expect(recipe.variants?.variant.plain.root).toMatchObject({ paddingInlineStart: "0" });
  });

  it("fills the surface look with colorPalette.subtle", () => {
    expect(recipe.variants?.variant.surface.root).toMatchObject({
      background: "colorPalette.subtle",
    });
  });

  it("colours the icon with colorPalette.solid in the surface look", () => {
    expect(recipe.variants?.variant.surface.icon).toStrictEqual({ color: "colorPalette.solid" });
  });

  it("declares five body sizes on the size axis", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm", "xl", "xs"]);
  });

  it("declares the eight semantic palettes on the palette axis", () => {
    expect(valuesOf(recipe, "palette")).toStrictEqual([...PALETTES].toSorted());
  });

  it("lists every palette under staticCss", () => {
    expect(recipe.staticCss).toStrictEqual([{ palette: [...PALETTES] }]);
  });

  it("declares two entrance motions on the motion axis", () => {
    expect(valuesOf(recipe, "motion")).toStrictEqual(["reveal", "rise"]);
  });

  it("sets no size on the icon slot", () => {
    const styled = Object.values(recipe.variants?.size ?? {});

    expect.hasAssertions();

    for (const value of styled) {
      expect(value).not.toHaveProperty("icon");
    }
  });

  it("matches every JSX tag that opens with Blockquote", () => {
    expect(recipe.jsx).toStrictEqual([/^Blockquote(\.\w+)?$/u]);
  });
});
