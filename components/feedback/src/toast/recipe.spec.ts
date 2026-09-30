import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, recipeViolations } from "@stealthscale/testing-theme";

import { recipe } from "#toast/recipe.ts";
import page from "#toast/toast.specimen.tsx";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Toast"] })).toStrictEqual([]);
  });

  it("sets className to toast", () => {
    expect(recipe.className).toBe("toast");
  });

  it("declares eight slots", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "actionTrigger",
      "closeTrigger",
      "content",
      "description",
      "indicator",
      "region",
      "root",
      "title",
    ]);
  });

  it("declares no axes", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("moves the root by the machine's custom properties", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      opacity: "var(--opacity)",
      scale: "var(--scale)",
      translate: "var(--x) var(--y)",
      zIndex: "var(--z-index)",
    });
  });

  it.each([
    { palette: "error", type: "error" },
    { palette: "info", type: "info" },
    { palette: "neutral", type: "loading" },
    { palette: "success", type: "success" },
    { palette: "warning", type: "warning" },
  ])("sets the $palette palette on a $type toast", ({ palette, type }) => {
    expect(recipe.base?.["root"]).toMatchObject({
      [`&[data-type=${type}]`]: { colorPalette: palette },
    });
  });

  it("caps the root at sizes.sm and the window less the region's offsets", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      inlineSize:
        "min({sizes.sm}, calc(100vw - var(--viewport-offset-left) - var(--viewport-offset-right)))",
    });
  });

  it("inks the indicator in the palette's solid", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({ color: "colorPalette.solid" });
  });

  it("matches every Toast tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Toast(\.\w+)?$/u]);
  });
});
