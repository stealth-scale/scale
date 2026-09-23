import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#list/list.specimen.tsx";
import { recipe } from "#list/recipe.ts";

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
        names: ["List.Root", "List.Item", "List.Indicator"],
        parts: ["root", "item", "indicator"],
      }),
    ).toStrictEqual([]);
  });

  it("sets className to list", () => {
    expect(recipe.className).toBe("list");
  });

  it("declares three slots in the order a caller nests the parts", () => {
    expect(recipe.slots).toStrictEqual(["root", "item", "indicator"]);
  });

  it("declares five variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["align", "gap", "marker", "motion", "variant"]);
  });

  it("declares eleven browser marker types on the marker axis", () => {
    expect(valuesOf(recipe, "marker")).toStrictEqual([
      "circle",
      "dash",
      "decimal",
      "disc",
      "leading-zero",
      "lower-alpha",
      "lower-greek",
      "lower-roman",
      "square",
      "upper-alpha",
      "upper-roman",
    ]);
  });

  it("defaults to the marker look at the md gap", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ gap: "md", variant: "marker" });
  });

  it("declares eight gaps on the gap axis", () => {
    expect(valuesOf(recipe, "gap")).toStrictEqual([
      "2xl",
      "3xl",
      "4xl",
      "lg",
      "md",
      "sm",
      "xl",
      "xs",
    ]);
  });

  it("declares two looks on the variant axis", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["marker", "plain"]);
  });

  it("declares two entrance motions on the motion axis", () => {
    expect(valuesOf(recipe, "motion")).toStrictEqual(["reveal", "rise"]);
  });

  it("sets the indicator to one line tall", () => {
    expect(recipe.base?.indicator).toMatchObject({ alignItems: "center", height: "1lh" });
  });

  it("sizes an svg inside the indicator to the text", () => {
    expect(recipe.base?.indicator).toMatchObject({ "& > svg": { boxSize: "1em" } });
  });

  it("matches every JSX tag that opens with List", () => {
    expect(recipe.jsx).toStrictEqual([/^List(\.\w+)?$/u]);
  });
});
