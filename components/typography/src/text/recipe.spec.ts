import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#text/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Text"] })).toStrictEqual([]);
  });

  it("names its class text", () => {
    expect(recipe.className).toBe("text");
  });

  it("offers the seven axes a paragraph takes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "align",
      "mask",
      "motion",
      "size",
      "tone",
      "truncate",
      "weight",
    ]);
  });

  it("draws the middle body size when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("offers the five body sizes", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm", "xl", "xs"]);
  });

  it("offers the foreground roles and the four statuses as tones", () => {
    expect(valuesOf(recipe, "tone")).toStrictEqual([
      "default",
      "error",
      "info",
      "inverted",
      "muted",
      "subtle",
      "success",
      "warning",
    ]);
  });

  it("offers the four weights a body of text takes", () => {
    expect(valuesOf(recipe, "weight")).toStrictEqual(["bold", "medium", "normal", "semibold"]);
  });

  it("offers the four alignments", () => {
    expect(valuesOf(recipe, "align")).toStrictEqual(["center", "end", "justify", "start"]);
  });

  it("offers the three motions a paragraph enters with", () => {
    expect(valuesOf(recipe, "motion")).toStrictEqual(["fade", "reveal", "rise"]);
  });

  it("offers the mask that fades the bottom edge out", () => {
    expect(valuesOf(recipe, "mask")).toStrictEqual(["bottom"]);
  });

  it("tracks every tag whose name ends in Text", () => {
    expect(recipe.jsx).toStrictEqual([/Text$/u]);
  });
});
