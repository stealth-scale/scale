import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#tabs/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Tabs"] })).toStrictEqual([]);
  });

  it("names its class tabs", () => {
    expect(recipe.className).toBe("tabs");
  });

  it("draws the five parts a set of tabs is composed of", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "content",
      "indicator",
      "list",
      "root",
      "trigger",
    ]);
  });

  it("offers the four axes a set of tabs takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["fitted", "justify", "size", "variant"]);
  });

  it("offers every way the theme distributes a row", () => {
    expect(valuesOf(recipe, "justify")).toStrictEqual([
      "around",
      "between",
      "center",
      "end",
      "evenly",
      "start",
    ]);
  });

  it("shares the strip's width between the controls where a caller asks", () => {
    expect(recipe.variants?.["fitted"]?.["true"]).toStrictEqual({ trigger: { flex: "1" } });
  });

  it("draws a line of tabs at the middle size by default", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "line" });
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

  it("offers the four ways a strip is drawn", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["enclosed", "line", "plain", "subtle"]);
  });

  it("offers no axis for the way the set runs because the machine states it", () => {
    expect(axesOf(recipe)).not.toContain("orientation");
  });

  it("turns the strip into a column where the set runs down", () => {
    expect(recipe.base?.["list"]).toMatchObject({
      _horizontal: { flexDirection: "row" },
      _vertical: { flexDirection: "column" },
    });
  });

  it("moves the bar to the inline edge where the set runs down", () => {
    expect(recipe.variants?.["variant"]?.["line"]?.["indicator"]).toMatchObject({
      _vertical: { insetInlineStart: "0" },
    });
  });

  it("states the bar's thickness and never its place", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({ borderRadius: "l1", zIndex: "0" });
  });

  it("paints every tab over the indicator so a filled one never covers the words", () => {
    expect(recipe.base?.["trigger"]).toMatchObject({ position: "relative", zIndex: "1" });
  });

  it("tracks the tag named Tabs and every part under it", () => {
    expect(recipe.jsx).toStrictEqual([/^Tabs(\.\w+)?$/u]);
  });
});
