import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#badge/recipe.ts";

describe("recipe", () => {
  it("styles Badge from tokens a theme can override", () => {
    expect(recipeViolations(recipe, { names: ["Badge"] })).toStrictEqual([]);
  });

  it("sets className to badge", () => {
    expect(recipe.className).toBe("badge");
  });

  it("declares four variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["radius", "size", "status", "variant"]);
  });

  it("defaults to the subtle look at the md size with the l2 corner", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ radius: "l2", size: "md", variant: "subtle" });
  });

  it("declares eight size values from xs to 4xl", () => {
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

  it("declares five look values", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual([
      "outline",
      "plain",
      "solid",
      "subtle",
      "surface",
    ]);
  });

  it("omits ghost from the look values", () => {
    expect(valuesOf(recipe, "variant")).not.toContain("ghost");
  });

  it("declares neutral alongside the four status values", () => {
    expect(valuesOf(recipe, "status")).toStrictEqual([
      "error",
      "info",
      "neutral",
      "success",
      "warning",
    ]);
  });

  it("lists all five status values under staticCss", () => {
    expect(recipe.staticCss).toStrictEqual([
      { status: ["info", "success", "warning", "error"] },
      { status: ["neutral"] },
    ]);
  });

  it("declares four radius values", () => {
    expect(valuesOf(recipe, "radius")).toStrictEqual(["full", "l1", "l2", "l3"]);
  });

  it("takes the md height from the tag scale rather than the control scale", () => {
    expect(recipe.variants?.["size"]?.["md"]).toMatchObject({
      height: "calc({sizes.tag.md} * var(--density, 1))",
    });
  });

  it("matches JSX tag names ending in Badge", () => {
    expect(recipe.jsx).toStrictEqual([/Badge$/u]);
  });
});
