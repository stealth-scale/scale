import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import {
  axesOf,
  defaultsOf,
  recipeViolations,
  scaleOf,
  valuesOf,
} from "@stealthscale/testing-theme";

import { card } from "#card.ts";
import page from "#checkbox-card/checkbox-card.specimen.tsx";
import { recipe } from "#checkbox-card/recipe.ts";

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
        names: ["CheckboxCard"],
        parts: ["root", "content", "label", "description", "control", "indicator", "addon"],
      }),
    ).toStrictEqual([]);
  });

  it("uses the class name checkbox-card", () => {
    expect(recipe.className).toBe("checkbox-card");
  });

  it("declares five axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["align", "layout", "palette", "size", "variant"]);
  });

  it("defaults to outline cards at size md with the box beside the words", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      align: "start",
      layout: "inline",
      palette: "primary",
      size: "md",
      variant: "outline",
    });
  });

  it("offers four looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["outline", "solid", "subtle", "surface"]);
  });

  it("renders the card from the shared card styles", () => {
    expect(recipe.base?.["root"]).toStrictEqual(card());
  });

  it("renders the focus ring on the card and none on the box", () => {
    expect([
      recipe.base?.["root"]?.["focusVisibleRing"],
      recipe.base?.["control"]?.["focusVisibleRing"],
    ]).toStrictEqual(["outside", "none"]);
  });

  it("keeps the box's height under a coarse pointer", () => {
    expect(recipe.base?.["control"]).not.toHaveProperty("_touch");
  });

  it("hides an indicator the machine marks hidden", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({ "&[hidden]": { display: "none" } });
  });

  it("fills a partly-on box on every look", () => {
    expect(
      scaleOf(recipe, "variant", "control", ["solid", "subtle", "surface", "outline"]),
    ).toMatchObject([
      { _indeterminate: { layerStyle: "fill.solid" } },
      { _indeterminate: { layerStyle: "outline.solid" } },
      { _indeterminate: { layerStyle: "fill.solid" } },
      { _indeterminate: { layerStyle: "fill.solid" } },
    ]);
  });

  it("renders the box of a checked solid card on the panel color", () => {
    expect(scaleOf(recipe, "variant", "control", ["solid"])[0]).toMatchObject({
      _checked: { background: "bg.panel", color: "colorPalette.solid" },
    });
  });

  it("sets a checked card's edge to Highlight under forced colors on every look", () => {
    expect(recipe.compoundVariants?.[0]).toMatchObject({
      css: { root: { _highContrast: { _checked: { borderColor: "Highlight" } } } },
      variant: ["solid", "subtle", "surface", "outline"],
    });
  });

  it("tracks JSX named CheckboxCard and its parts", () => {
    expect(recipe.jsx).toStrictEqual([/^CheckboxCard(\.\w+)?$/u]);
  });
});
