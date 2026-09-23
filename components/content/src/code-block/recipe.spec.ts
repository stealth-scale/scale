import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#code-block/code-block.specimen.tsx";
import { recipe } from "#code-block/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["CodeBlock"] })).toStrictEqual([]);
  });

  it("sets className to code-block", () => {
    expect(recipe.className).toBe("code-block");
  });

  it("declares six slots", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "code",
      "content",
      "control",
      "header",
      "root",
      "title",
    ]);
  });

  it("declares size as its only variant", () => {
    expect(axesOf(recipe)).toStrictEqual(["size"]);
  });

  it("defaults size to md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("declares md and sm as the values of size", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["md", "sm"]);
  });

  it("sets the title one size smaller than the code at md", () => {
    expect(recipe.variants?.["size"]?.["md"]).toMatchObject({
      code: { textStyle: "code.md" },
      title: { textStyle: "label.sm" },
    });
  });

  it("colours a token kind from the matching colour in the code family", () => {
    expect(recipe.base?.["code"]).toMatchObject({
      "& [data-token=keyword]": { color: "code.keyword" },
      "& [data-token=string]": { color: "code.string" },
      "& [data-token=tag]": { color: "code.tag" },
    });
  });

  it("maps a token kind with no colour of its own onto a coarser one", () => {
    expect(recipe.base?.["code"]).toMatchObject({
      "& [data-token=literal]": { color: "code.number" },
      "& [data-token=meta]": { color: "code.comment" },
      "& [data-token=property]": { color: "code.attr" },
      "& [data-token=selector]": { color: "code.type" },
    });
  });

  it("sets whiteSpace to pre on the code slot", () => {
    expect(recipe.base?.["code"]).toMatchObject({ whiteSpace: "pre" });
  });

  it("sets fontFamily to mono on the code slot", () => {
    expect(recipe.base?.["code"]).toMatchObject({ fontFamily: "mono" });
  });

  it("sizes the code slot to its longest line and at least the content width", () => {
    expect(recipe.base?.["code"]).toMatchObject({
      inlineSize: "max-content",
      minInlineSize: "full",
    });
  });

  it("sets overflowX to auto on the content slot", () => {
    expect(recipe.base?.["content"]).toMatchObject({ overflowX: "auto" });
  });

  it("draws the focus ring on the root while the content slot is focused", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      "&:has(.code-block__content:focus-visible)": {
        outlineColor: "colorPalette.focusRing",
        outlineOffset: "ring",
        outlineStyle: "solid",
        outlineWidth: "ring",
      },
    });
  });

  it("removes the outline of the focused content slot", () => {
    expect(recipe.base?.["content"]).toMatchObject({ _focusVisible: { outlineStyle: "none" } });
  });

  it("matches CodeBlock and its dotted parts with its jsx pattern", () => {
    expect(recipe.jsx).toStrictEqual([/^CodeBlock(\.\w+)?$/u]);
  });
});
