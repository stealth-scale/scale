import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#breadcrumb/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Breadcrumb"] })).toStrictEqual([]);
  });

  it("names its class breadcrumb", () => {
    expect(recipe.className).toBe("breadcrumb");
  });

  it("draws the six parts a trail is composed of", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "currentLink",
      "item",
      "link",
      "list",
      "root",
      "separator",
    ]);
  });

  it("offers the two axes a trail takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["size", "variant"]);
  });

  it("draws the middle size with no underline at rest by default", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "plain" });
  });

  it("offers the five sizes the body role is read at", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm", "xl", "xs"]);
  });

  it("sets the text on the root so every part reads at one size", () => {
    expect(recipe.variants?.["size"]?.["md"]).toStrictEqual({
      list: { gap: "calc({spacing.gap.md} * var(--density, 1))" },
      root: { textStyle: "body.md" },
    });
  });

  it("draws a crumb above the page quieter than the page's own", () => {
    expect(recipe.variants?.["variant"]?.["plain"]).toMatchObject({
      currentLink: { color: "fg" },
      link: { color: "fg.muted" },
    });
  });

  it("turns the mark around where the line runs right to left", () => {
    expect(recipe.base?.["separator"]).toMatchObject({ _rtl: { rotate: "180deg" } });
  });

  it("tracks the tag named Breadcrumb and every part under it", () => {
    expect(recipe.jsx).toStrictEqual([/^Breadcrumb(\.\w+)?$/u]);
  });
});
