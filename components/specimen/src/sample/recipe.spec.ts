import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#sample/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Sample"] })).toStrictEqual([]);
  });

  it("names its class sample", () => {
    expect(recipe.className).toBe("sample");
  });

  it("draws the caption above the box it names", () => {
    expect(recipe.slots).toStrictEqual(["root", "caption", "body"]);
  });

  it("offers a place a span and a look", () => {
    expect(axesOf(recipe)).toStrictEqual(["place", "span", "variant"]);
  });

  it("fits the drawing and draws no box when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ place: "fit", variant: "plain" });
  });

  it("takes the width of what it holds until a caller asks for the cell", () => {
    expect(recipe.variants?.place?.fit).toStrictEqual({ body: { inlineSize: "fit-content" } });
    expect(recipe.variants?.place?.center?.body).toMatchObject({ inlineSize: "full" });
  });

  it("draws no fill no edge and no room in the plain look", () => {
    expect(recipe.variants?.variant?.plain).toStrictEqual({
      body: { background: "transparent", borderWidth: "0", padding: "0" },
    });
  });

  it("moves no ink of what it holds in any look", () => {
    expect(JSON.stringify(recipe.variants?.variant)).not.toContain("color");
  });

  it("offers the four looks a passive box is drawn in", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["outline", "plain", "subtle", "surface"]);
  });

  it("reaches a board's columns through the span", () => {
    expect(recipe.variants?.span?.full).toStrictEqual({ root: { gridColumn: "1 / -1" } });
  });

  it("tracks the tag a consumer writes it under", () => {
    expect(recipe.jsx).toStrictEqual([/^Sample$/u]);
  });
});
