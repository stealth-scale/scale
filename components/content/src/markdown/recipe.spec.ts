import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations } from "@stealthscale/testing-theme";

import page from "#markdown/markdown.specimen.tsx";
import { recipe } from "#markdown/recipe.ts";

/**
 * Returns the base styles of a slot.
 */
function base(slot: string): unknown {
  return (recipe.base as Readonly<Record<string, unknown>> | undefined)?.[slot];
}

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Markdown"] })).toStrictEqual([]);
  });

  it("sets className to markdown", () => {
    expect(recipe.className).toBe("markdown");
  });

  it("declares seven slots", () => {
    expect(recipe.slots).toStrictEqual([
      "root",
      "flow",
      "image",
      "deleted",
      "reference",
      "footnotes",
      "taskMark",
    ]);
  });

  it("declares a size axis at md by default", () => {
    expect([axesOf(recipe), defaultsOf(recipe)]).toStrictEqual([["size"], { size: "md" }]);
  });

  it("caps the root at the theme's prose measure", () => {
    expect(base("root")).toMatchObject({ maxInlineSize: "prose" });
  });

  it("renders every link of the document inline", () => {
    expect(base("root")).toMatchObject({ "& .link": { display: "inline" } });
  });

  it("draws an empty pulsing caret after the last block while the document is busy", () => {
    expect(base("root")).toMatchObject({
      "&[aria-busy=true] > :last-child::after": {
        animationStyle: "pulse",
        backgroundColor: "currentcolor",
        content: '""',
      },
    });
  });

  it("paints the caret in CanvasText under forced colors", () => {
    expect(base("root")).toMatchObject({
      "&[aria-busy=true] > :last-child::after": {
        _highContrast: { background: "CanvasText", forcedColorAdjust: "none" },
      },
    });
  });

  it("sets the line height of a footnote reference to 0", () => {
    expect(base("reference")).toStrictEqual({ lineHeight: "0" });
  });

  it("fills a done task's box with CanvasText under forced colors", () => {
    expect(base("taskMark")).toMatchObject({
      _highContrast: { "&[data-checked]": { background: "CanvasText" } },
    });
  });
});
