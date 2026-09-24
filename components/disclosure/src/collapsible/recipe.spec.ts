import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#collapsible/collapsible.specimen.tsx";
import { recipe } from "#collapsible/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Collapsible"] })).toStrictEqual([]);
  });

  it("sets className to collapsible", () => {
    expect(recipe.className).toBe("collapsible");
  });

  it("declares four slots", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual(["content", "indicator", "root", "trigger"]);
  });

  it("declares four axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["motion", "palette", "size", "variant"]);
  });

  it("defaults to a plain collapsible at md in neutral sliding open", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      motion: "slide",
      palette: "neutral",
      size: "md",
      variant: "plain",
    });
  });

  it("declares the eight shared sizes", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual([
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

  it("sets the palette on the root", () => {
    expect(recipe.variants?.["palette"]?.["warning"]).toStrictEqual({
      root: { colorPalette: "warning" },
    });
  });

  it("emits every palette", () => {
    expect(recipe.staticCss).toContainEqual({
      palette: ["primary", "secondary", "accent", "neutral", "info", "success", "warning", "error"],
    });
  });

  it("declares four looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["outline", "plain", "subtle", "surface"]);
  });

  it("rounds the subtle trigger with the root's radius", () => {
    expect(recipe.variants?.["variant"]?.["subtle"]?.["trigger"]).toMatchObject({
      _open: { borderEndEndRadius: "0", borderEndStartRadius: "0" },
      borderRadius: "l2",
    });
    expect(recipe.variants?.["variant"]?.["subtle"]?.["root"]).toMatchObject({
      borderRadius: "l2",
    });
  });

  it("declares three motions", () => {
    expect(valuesOf(recipe, "motion")).toStrictEqual(["fade", "none", "slide"]);
  });

  it("animates slide with the theme's collapse styles", () => {
    expect(recipe.variants?.["motion"]?.["slide"]).toStrictEqual({
      content: {
        _closed: { animationStyle: "collapse.out" },
        _open: { animationStyle: "collapse.in" },
      },
    });
  });

  it("sizes the trigger the content and the indicator from one size", () => {
    expect(recipe.variants?.["size"]?.["md"]).toStrictEqual({
      content: { padding: "calc({spacing.inset.md} * var(--density, 1))" },
      indicator: { boxSize: "calc({sizes.icon.md} * var(--density, 1))" },
      trigger: {
        "&:has(> svg:first-child)": {
          paddingInlineStart: "calc({spacing.inset.sm} * var(--density, 1))",
        },
        gap: "calc({spacing.gap.md} * var(--density, 1))",
        height: "calc({sizes.control.md} * var(--density, 1))",
        paddingInlineEnd: "var(--control-inset-end, calc({spacing.inset.md} * var(--density, 1)))",
        paddingInlineStart:
          "var(--control-inset-start, calc({spacing.inset.md} * var(--density, 1)))",
        textStyle: "label.md",
      },
    });
  });

  it("turns the indicator 180deg while open", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({ _open: { rotate: "180deg" } });
  });

  it("removes the indicator's transition under reduced motion", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({
      _motionReduce: { transitionDuration: "none" },
    });
  });

  it("clips the content's overflow", () => {
    expect(recipe.base?.["content"]).toStrictEqual({ overflow: "hidden" });
  });

  it("transitions the indicator's rotate property", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({ transitionProperty: "rotate" });
  });

  it("matches every Collapsible tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Collapsible(\.\w+)?$/u]);
  });
});
