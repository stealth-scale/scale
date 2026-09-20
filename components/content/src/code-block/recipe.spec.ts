import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#code-block/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["CodeBlock"] })).toStrictEqual([]);
  });

  it("names its class code-block", () => {
    expect(recipe.className).toBe("code-block");
  });

  it("draws the six parts a code block is composed of", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "code",
      "content",
      "control",
      "header",
      "root",
      "title",
    ]);
  });

  it("offers the one axis a code block takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["size"]);
  });

  it("draws the middle size by default", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("offers the two sizes the code role is set at", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["md", "sm"]);
  });

  it("sets the code in the code role and the title a step down at each size", () => {
    expect(recipe.variants?.["size"]?.["md"]).toMatchObject({
      code: { textStyle: "code.md" },
      title: { textStyle: "label.sm" },
    });
  });

  it("inks each kind of token from the code family the theme states", () => {
    expect(recipe.base?.["code"]).toMatchObject({
      "& [data-token=keyword]": { color: "code.keyword" },
      "& [data-token=string]": { color: "code.string" },
      "& [data-token=tag]": { color: "code.tag" },
    });
  });

  it("folds the highlighter's finer kinds into the family's", () => {
    expect(recipe.base?.["code"]).toMatchObject({
      "& [data-token=literal]": { color: "code.number" },
      "& [data-token=meta]": { color: "code.comment" },
      "& [data-token=property]": { color: "code.attr" },
      "& [data-token=selector]": { color: "code.type" },
    });
  });

  it("keeps every space and line break of the passage", () => {
    expect(recipe.base?.["code"]).toMatchObject({ fontFamily: "mono", whiteSpace: "pre" });
  });

  it("scrolls a long line across the box rather than wrapping it", () => {
    expect(recipe.base?.["content"]).toMatchObject({ overflowX: "auto" });
  });

  it("tracks the tag named CodeBlock and every part under it", () => {
    expect(recipe.jsx).toStrictEqual([/^CodeBlock(\.\w+)?$/u]);
  });
});
