import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#badge/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Badge"] })).toStrictEqual([]);
  });

  it("names its class badge", () => {
    expect(recipe.className).toBe("badge");
  });

  it("offers the four axes a badge takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["radius", "size", "status", "variant"]);
  });

  it("draws the middle size in the subtle look at the middle corner by default", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ radius: "l2", size: "md", variant: "subtle" });
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

  it("offers the five flat looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual([
      "outline",
      "plain",
      "solid",
      "subtle",
      "surface",
    ]);
  });

  it("leaves the ghost look out because a badge repaints under no pointer", () => {
    expect(valuesOf(recipe, "variant")).not.toContain("ghost");
  });

  it("offers the four statuses and the neutral palette", () => {
    expect(valuesOf(recipe, "status")).toStrictEqual([
      "error",
      "info",
      "neutral",
      "success",
      "warning",
    ]);
  });

  it("emits every status whether or not a page writes it", () => {
    expect(recipe.staticCss).toStrictEqual([
      { status: ["info", "success", "warning", "error"] },
      { status: ["neutral"] },
    ]);
  });

  it("offers the four corners the theme draws", () => {
    expect(valuesOf(recipe, "radius")).toStrictEqual(["full", "l1", "l2", "l3"]);
  });

  it("reads the tag scale rather than the control scale at every size", () => {
    expect(recipe.variants?.["size"]?.["md"]).toMatchObject({
      height: "calc({sizes.tag.md} * var(--density, 1))",
    });
  });

  it("tracks every tag whose name ends in Badge", () => {
    expect(recipe.jsx).toStrictEqual([/Badge$/u]);
  });
});
