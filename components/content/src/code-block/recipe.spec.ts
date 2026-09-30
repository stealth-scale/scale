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

  it("declares seventeen slots", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "change",
      "code",
      "content",
      "control",
      "diff",
      "empty",
      "filler",
      "fold",
      "header",
      "line",
      "mark",
      "number",
      "root",
      "stat",
      "text",
      "title",
      "viewport",
    ]);
  });

  it("sets the diff in the code text style at md", () => {
    expect(recipe.variants?.["size"]?.["md"]).toMatchObject({ diff: { textStyle: "code.md" } });
  });

  it.each(["empty", "fold", "stat"] as const)(
    "sets the %s slot one size smaller than the code at md",
    (slot) => {
      expect(recipe.variants?.["size"]?.["md"]?.[slot]).toMatchObject({ textStyle: "label.sm" });
    },
  );

  it("colours a token kind on the diff slot from the code family", () => {
    expect(recipe.base?.["diff"]).toMatchObject({
      "& [data-token=keyword]": { color: "code.keyword" },
      "& [data-token=string]": { color: "code.string" },
    });
  });

  it("merges the styles of every diff slot into its base", () => {
    expect(recipe.base?.["line"]).toMatchObject({ display: "flex", whiteSpace: "pre" });
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

  it("leaves the scrolling to the scroll area around the content slot", () => {
    expect(recipe.base?.["content"]).toStrictEqual({ margin: "0" });
  });

  it("renders the focus ring on the root while the viewport is focused", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      "&:has(.code-block__viewport:focus-visible)": {
        outlineColor: "colorPalette.focusRing",
        outlineOffset: "ring",
        outlineStyle: "solid",
        outlineWidth: "ring",
      },
    });
  });

  it("hides the scroll area's own focus ring", () => {
    expect(recipe.base?.["root"]).toMatchObject({ "--scroll-area-ring-style": "none" });
  });

  it("matches CodeBlock and its dotted parts with its jsx pattern", () => {
    expect(recipe.jsx).toStrictEqual([/^CodeBlock(\.\w+)?$/u]);
  });
});
