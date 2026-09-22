import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#list/list.specimen.tsx";
import { recipe } from "#list/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("writes no value a theme cannot move", () => {
    expect(
      recipeViolations(recipe, {
        names: ["List.Root", "List.Item", "List.Indicator"],
        parts: ["root", "item", "indicator"],
      }),
    ).toStrictEqual([]);
  });

  it("names its class list", () => {
    expect(recipe.className).toBe("list");
  });

  it("styles the root and the item and the indicator", () => {
    expect(recipe.slots).toStrictEqual(["root", "item", "indicator"]);
  });

  it("offers the five axes a list takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["align", "gap", "marker", "motion", "variant"]);
  });

  it("offers the eleven markers the browser draws", () => {
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

  it("draws the browser's markers at the middle gap when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ gap: "md", variant: "marker" });
  });

  it("offers the eight gaps", () => {
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

  it("offers the marker look and the plain look", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["marker", "plain"]);
  });

  it("offers the two motions an entry enters with", () => {
    expect(valuesOf(recipe, "motion")).toStrictEqual(["reveal", "rise"]);
  });

  it("tracks the namespace and every tag whose name opens with List", () => {
    expect(recipe.jsx).toStrictEqual([/^List(\.\w+)?$/u]);
  });
});
