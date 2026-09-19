import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#toc/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Toc"] })).toStrictEqual([]);
  });

  it("names its class toc", () => {
    expect(recipe.className).toBe("toc");
  });

  it("draws the six parts a rail is composed of", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "indicator",
      "item",
      "link",
      "list",
      "root",
      "title",
    ]);
  });

  it("offers a size axis alone", () => {
    expect(axesOf(recipe)).toStrictEqual(["size"]);
  });

  it("draws the middle size by default", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("offers the three sizes a rail is read at", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("reads the body role a step below the size and the label role two below", () => {
    expect(recipe.variants?.["size"]?.["md"]).toStrictEqual({
      link: {
        paddingBlock: "gap.xs",
        paddingInlineEnd: "inset.sm",
        paddingInlineStart: "inset.md",
        textStyle: "body.sm",
      },
      root: { gap: "gap.sm" },
      title: { paddingInline: "inset.sm", textStyle: "label.xs" },
    });
  });

  it("places the mark from the properties the machine measures", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({
      blockSize: "var(--height)",
      insetBlockStart: "var(--top)",
      position: "absolute",
    });
  });

  it("indents a row by one gap for each level below the top", () => {
    expect(recipe.base?.["item"]).toStrictEqual({
      paddingInlineStart: "calc((var(--depth) - 2) * {spacing.gap.md})",
    });
  });

  it("sets a link naming a heading on screen in the page's ink", () => {
    expect(recipe.base?.["link"]).toMatchObject({
      "&[data-active]": { color: "fg", fontWeight: "medium" },
      color: "fg.muted",
    });
  });

  it("tracks the tag named Toc and every part under it", () => {
    expect(recipe.jsx).toStrictEqual([/^Toc(\.\w+)?$/u]);
  });
});
