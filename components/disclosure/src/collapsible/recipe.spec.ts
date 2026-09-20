import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#collapsible/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Collapsible"] })).toStrictEqual([]);
  });

  it("names its class collapsible", () => {
    expect(recipe.className).toBe("collapsible");
  });

  it("draws the four parts a collapsible is composed of", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual(["content", "indicator", "root", "trigger"]);
  });

  it("offers the three axes a collapsible takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["motion", "size", "variant"]);
  });

  it("draws an unframed collapsible sliding open at the middle size by default", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ motion: "slide", size: "md", variant: "plain" });
  });

  it("offers the eight sizes every component shares", () => {
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

  it("offers the four ways the pair is set off from the page", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["outline", "plain", "subtle", "surface"]);
  });

  it("offers the three ways the block appears and goes", () => {
    expect(valuesOf(recipe, "motion")).toStrictEqual(["fade", "none", "slide"]);
  });

  it("reads an animation style the theme owns for each motion but none", () => {
    expect(recipe.variants?.["motion"]?.["slide"]).toStrictEqual({
      content: {
        _closed: { animationStyle: "collapse.out" },
        _open: { animationStyle: "collapse.in" },
      },
    });
  });

  it("steps the trigger the block and the mark together at one name", () => {
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

  it("turns the mark half a revolution while the block is open", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({ _open: { rotate: "180deg" } });
  });

  it("holds the mark still for a reader who asked for less motion", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({
      _motionReduce: { transitionDuration: "none" },
    });
  });

  it("clips the block so it has a height to animate from", () => {
    expect(recipe.base?.["content"]).toStrictEqual({ overflow: "hidden" });
  });

  it("names the property the mark actually turns in", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({ transitionProperty: "rotate" });
  });

  it("tracks the tag named Collapsible and every part under it", () => {
    expect(recipe.jsx).toStrictEqual([/^Collapsible(\.\w+)?$/u]);
  });
});
