import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#dialog/dialog.specimen.tsx";
import { recipe } from "#dialog/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Dialog"] })).toStrictEqual([]);
  });

  it("sets className to dialog", () => {
    expect(recipe.className).toBe("dialog");
  });

  it("declares thirteen slots", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "actionTrigger",
      "backdrop",
      "body",
      "closeTrigger",
      "content",
      "description",
      "footer",
      "header",
      "positioner",
      "root",
      "scroller",
      "title",
      "trigger",
    ]);
  });

  it("sets display contents on the root", () => {
    expect(recipe.base?.["root"]).toStrictEqual({ display: "contents" });
  });

  it("declares the placement scrollBehavior size and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["placement", "scrollBehavior", "size", "variant"]);
  });

  it("defaults to an elevated md panel at the top that scrolls with the window", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      placement: "top",
      scrollBehavior: "outside",
      size: "md",
      variant: "elevated",
    });
  });

  it("declares five widths with cover and full", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["cover", "full", "lg", "md", "sm", "xl", "xs"]);
  });

  it("orders the placements top center bottom", () => {
    expect(Object.keys(recipe.variants?.["placement"] ?? {})).toStrictEqual([
      "top",
      "center",
      "bottom",
    ]);
  });

  it.each([
    { size: "xs", width: "{sizes.sm}" },
    { size: "sm", width: "{sizes.md}" },
    { size: "md", width: "{sizes.lg}" },
    { size: "lg", width: "{sizes.2xl}" },
    { size: "xl", width: "{sizes.4xl}" },
  ] as const)("caps the panel at $width at size $size", ({ size, width }) => {
    expect(recipe.variants?.["size"]?.[size]).toStrictEqual({
      content: { maxInlineSize: width },
    });
  });

  it("stacks the positioner on the modal level plus the layer index", () => {
    expect(recipe.base?.["positioner"]).toMatchObject({
      zIndex: "calc({zIndex.modal} + var(--layer-index, 0))",
    });
  });

  it("stacks the backdrop one level under its positioner", () => {
    expect(recipe.base?.["backdrop"]).toMatchObject({
      zIndex: "calc(calc({zIndex.modal} + var(--layer-index, 0)) - 1)",
    });
  });

  it("gives the backdrop pointer events", () => {
    expect(recipe.base?.["backdrop"]).toMatchObject({ pointerEvents: "auto" });
  });

  it("centres the close trigger on the first line of the title", () => {
    expect(recipe.base?.["closeTrigger"]).toMatchObject({
      insetBlockStart: "calc(var(--dialog-inset) + (1lh - var(--dialog-close)) / 2)",
      textStyle: "heading.md",
    });
    expect(recipe.base?.["title"]).toMatchObject({ textStyle: "heading.md" });
  });

  it("puts the glyph of the close trigger on the padding edge", () => {
    expect(recipe.base?.["closeTrigger"]).toMatchObject({
      insetInlineEnd: "calc(var(--dialog-inset) - (var(--dialog-close) - var(--dialog-mark)) / 2)",
    });
  });

  it("pads the header past a close trigger in the panel", () => {
    expect(recipe.base?.["header"]).toMatchObject({
      ".dialog__content:has(> .dialog__closeTrigger) > &": {
        paddingInlineEnd: "calc(var(--dialog-inset) + var(--dialog-close))",
      },
    });
  });

  it("drops the bottom padding of a header another band follows", () => {
    expect(recipe.base?.["header"]).toMatchObject({
      "&:has(~ .dialog__footer)": { paddingBlockEnd: "0" },
      "&:has(~ .dialog__scroller)": { paddingBlockEnd: "0" },
    });
  });

  it("drops the bottom padding of a body the footer follows", () => {
    expect(recipe.base?.["body"]).toMatchObject({
      ".dialog__scroller:has(~ .dialog__footer) &": { paddingBlockEnd: "0" },
    });
  });

  it("grows the body's scroll area to fill the panel", () => {
    expect(recipe.base?.["scroller"]).toMatchObject({ flex: "1" });
  });

  it("moves the scroll area's focus ring inside its edge", () => {
    expect(recipe.base?.["scroller"]).toMatchObject({
      "--scroll-area-ring-offset": "calc({borderWidths.ring} * -1)",
    });
  });

  it("limits the panel to the window's height when the body scrolls inside", () => {
    expect(recipe.variants?.["scrollBehavior"]?.["inside"]).toStrictEqual({
      content: { maxBlockSize: "full" },
      positioner: { overflowY: "hidden" },
    });
  });

  it("scrolls the positioner outside the panel", () => {
    expect(recipe.variants?.["scrollBehavior"]?.["outside"]).toStrictEqual({
      positioner: { overflowY: "auto", pointerEvents: "auto" },
    });
  });

  it("removes the surface of the plain panel", () => {
    expect(recipe.variants?.["variant"]?.["plain"]).toStrictEqual({
      content: { background: "transparent" },
    });
  });

  it("matches every Dialog tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Dialog(\.\w+)?$/u]);
  });
});
