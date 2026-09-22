import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#popover/popover.specimen.tsx";
import { recipe } from "#popover/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Popover"] })).toStrictEqual([]);
  });

  it("names its class popover", () => {
    expect(recipe.className).toBe("popover");
  });

  it("draws the eleven parts a popover is composed of", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "anchor",
      "arrow",
      "arrowTip",
      "closeTrigger",
      "content",
      "description",
      "indicator",
      "positioner",
      "root",
      "title",
      "trigger",
    ]);
  });

  it("takes part in no layout at the root the machine does not name", () => {
    expect(recipe.base?.["root"]).toStrictEqual({ display: "contents" });
  });

  it("offers the two axes a popover takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["size", "variant"]);
  });

  it("draws a surfaced popover at the middle size by default", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "surface" });
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

  it("offers the three ways the panel is set off from the page", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["elevated", "glass", "surface"]);
  });

  it("reads the heading role for the title and the body role for the paragraph", () => {
    expect(recipe.variants?.["size"]?.["md"]).toMatchObject({
      description: { textStyle: "body.md" },
      title: { textStyle: "heading.md" },
    });
  });

  it("fills the point from the same custom property the panel states its surface as", () => {
    expect(recipe.base?.["arrow"]).toMatchObject({
      "--arrow-background": "var(--popover-surface)",
    });
    expect(recipe.variants?.["variant"]?.["surface"]?.["content"]).toMatchObject({
      "--popover-surface": "colors.bg.popover",
    });
  });

  it("grows from the corner the machine placed the panel against", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      transformOrigin: "var(--transform-origin)",
    });
  });

  it("states nothing about where the panel goes", () => {
    expect(recipe.base?.["positioner"]).toStrictEqual({ position: "relative" });
  });

  it("turns the mark half a revolution while the panel is open", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({ _open: { rotate: "180deg" } });
  });

  it("turns the mark without a turn for a reader who asked for no motion", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({
      _motionReduce: { transitionDuration: "0s" },
    });
  });

  it("tracks the tag named Popover and every part under it", () => {
    expect(recipe.jsx).toStrictEqual([/^Popover(\.\w+)?$/u]);
  });
});
