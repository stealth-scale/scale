import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#toggle-tip/recipe.ts";
import page from "#toggle-tip/toggle-tip.specimen.tsx";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["ToggleTip"] })).toStrictEqual([]);
  });

  it("sets className to toggle-tip", () => {
    expect(recipe.className).toBe("toggle-tip");
  });

  it("declares six slots", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "arrow",
      "arrowTip",
      "content",
      "positioner",
      "root",
      "trigger",
    ]);
  });

  it("sets display contents on the root", () => {
    expect(recipe.base?.["root"]).toStrictEqual({ display: "contents" });
  });

  it("declares the size and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["size", "variant"]);
  });

  it("defaults to the inverted look at md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "inverted" });
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

  it("declares two looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["inverted", "surface"]);
  });

  it("sets the text of the note on the label role", () => {
    expect(recipe.variants?.["size"]?.["md"]).toMatchObject({
      content: { textStyle: "label.md" },
    });
  });

  it("fills the arrow from --toggle-tip-surface", () => {
    expect(recipe.base?.["arrow"]).toMatchObject({
      "--arrow-background": "var(--toggle-tip-surface)",
    });
    expect(recipe.variants?.["variant"]?.["inverted"]?.["content"]).toMatchObject({
      "--toggle-tip-surface": "colors.bg.inverted",
    });
  });

  it("gives the inverted note a transparent hairline edge", () => {
    expect(recipe.variants?.["variant"]?.["inverted"]?.["content"]).toMatchObject({
      borderColor: "transparent",
      borderStyle: "solid",
      borderWidth: "hairline",
    });
  });

  it("sets a link inside the note in the note's ink with an underline", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      "& a": { color: "inherit", textDecoration: "underline" },
    });
  });

  it("caps the note at 20rem or the room the machine measures beside the trigger", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      maxInlineSize: "min({sizes.xs}, var(--available-width, {sizes.xs}))",
    });
  });

  it("sets the tooltip z-index on the note", () => {
    expect(recipe.base?.["content"]).toMatchObject({ zIndex: "tooltip" });
  });

  it("sets no offset on the positioner", () => {
    expect(recipe.base?.["positioner"]).toStrictEqual({ position: "relative" });
  });

  it("matches every ToggleTip tag", () => {
    expect(recipe.jsx).toStrictEqual([/^ToggleTip(\.\w+)?$/u]);
  });
});
