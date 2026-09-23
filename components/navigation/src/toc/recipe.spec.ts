import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#toc/recipe.ts";
import page from "#toc/toc.specimen.tsx";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

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

  it("offers a placement axis and a size axis", () => {
    expect(axesOf(recipe)).toStrictEqual(["placement", "size"]);
  });

  it("stands where it is written at the middle size by default", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ placement: "inline", size: "md" });
  });

  it("offers the three sizes a rail is read at", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("draws the rail at least eleven rems wide", () => {
    expect(recipe.base?.["root"]).toMatchObject({ minInlineSize: "44" });
  });

  it("reads the body role a step below the size and the label role two below", () => {
    expect(recipe.variants?.["size"]?.["md"]).toStrictEqual({
      link: {
        paddingBlock: "calc({spacing.gap.xs} * var(--density, 1))",
        paddingInlineEnd: "calc({spacing.inset.sm} * var(--density, 1))",
        paddingInlineStart: "calc({spacing.inset.md} * var(--density, 1))",
        textStyle: "body.sm",
      },
      root: { gap: "calc({spacing.gap.sm} * var(--density, 1))" },
      title: {
        paddingInline: "calc({spacing.inset.sm} * var(--density, 1))",
        textStyle: "label.xs",
      },
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

  it("holds the mark still for a reader who asks for less motion", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({
      _motionReduce: { transitionDuration: "0s" },
    });
  });

  it("tracks the tag named Toc and every part under it", () => {
    expect(recipe.jsx).toStrictEqual([/^Toc(\.\w+)?$/u]);
  });
});
