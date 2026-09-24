import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#popover/popover.specimen.tsx";
import { recipe } from "#popover/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Popover"] })).toStrictEqual([]);
  });

  it("sets className to popover", () => {
    expect(recipe.className).toBe("popover");
  });

  it("declares eleven slots", () => {
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

  it("sets display contents on the root", () => {
    expect(recipe.base?.["root"]).toStrictEqual({ display: "contents" });
  });

  it("declares the size and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["size", "variant"]);
  });

  it("defaults to the surface look at md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "surface" });
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

  it("declares three looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["elevated", "glass", "surface"]);
  });

  it("sets the title on the heading role and the description on the body role", () => {
    expect(recipe.variants?.["size"]?.["md"]).toMatchObject({
      description: { textStyle: "body.md" },
      title: { textStyle: "heading.md" },
    });
  });

  it("fills the arrow from --popover-surface", () => {
    expect(recipe.base?.["arrow"]).toMatchObject({
      "--arrow-background": "var(--popover-surface)",
    });
    expect(recipe.variants?.["variant"]?.["surface"]?.["content"]).toMatchObject({
      "--popover-surface": "colors.bg.popover",
    });
  });

  it("scales the panel from --transform-origin", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      transformOrigin: "var(--transform-origin)",
    });
  });

  it("sets no offset on the positioner", () => {
    expect(recipe.base?.["positioner"]).toStrictEqual({ position: "relative" });
  });

  it("turns the indicator 180deg while open", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({ _open: { rotate: "180deg" } });
  });

  it("removes the indicator's transition under reduced motion", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({
      _motionReduce: { transitionDuration: "0s" },
    });
  });

  it("matches every Popover tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Popover(\.\w+)?$/u]);
  });
});
