import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#hover-card/hover-card.specimen.tsx";
import { recipe } from "#hover-card/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["HoverCard"] })).toStrictEqual([]);
  });

  it("sets className to hover-card", () => {
    expect(recipe.className).toBe("hover-card");
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

  it("defaults to the surface look at md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "surface" });
  });

  it("declares four sizes", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm", "xs"]);
  });

  it("declares three looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["elevated", "glass", "surface"]);
  });

  it("sets the text of the panel on the body role", () => {
    expect(recipe.variants?.["size"]?.["lg"]).toMatchObject({
      content: { textStyle: "body.lg" },
    });
  });

  it("fills the arrow from --hover-card-surface", () => {
    expect(recipe.base?.["arrow"]).toMatchObject({
      "--arrow-background": "var(--hover-card-surface)",
    });
    expect(recipe.variants?.["variant"]?.["surface"]?.["content"]).toMatchObject({
      "--hover-card-surface": "colors.bg.popover",
    });
  });

  it("gives the elevated panel a transparent hairline edge", () => {
    expect(recipe.variants?.["variant"]?.["elevated"]?.["content"]).toMatchObject({
      borderColor: "transparent",
      borderStyle: "solid",
      borderWidth: "hairline",
    });
  });

  it("underlines the trigger at rest", () => {
    expect(recipe.base?.["trigger"]).toMatchObject({ textDecoration: "underline" });
  });

  it("colors the trigger with the link ink", () => {
    expect(recipe.base?.["trigger"]).toMatchObject({ color: "fg.link" });
  });

  it("caps the panel at 20rem or the room the machine measures beside the trigger", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      maxInlineSize: "min({sizes.xs}, var(--available-width, {sizes.xs}))",
    });
  });

  it("sets no offset on the positioner", () => {
    expect(recipe.base?.["positioner"]).toStrictEqual({ position: "relative" });
  });

  it("matches every HoverCard tag", () => {
    expect(recipe.jsx).toStrictEqual([/^HoverCard(\.\w+)?$/u]);
  });
});
