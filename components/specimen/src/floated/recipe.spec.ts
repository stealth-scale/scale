import { describe, expect, it } from "vitest";

import { axesOf, recipeViolations } from "@stealthscale/testing-theme";

import { recipe, ROOM } from "#floated/recipe.ts";

describe("recipe", () => {
  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Floated"] })).toStrictEqual([]);
  });

  it("sets className to floated", () => {
    expect(recipe.className).toBe("floated");
  });

  it("declares no variant axis", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("contains the layout of its descendants", () => {
    expect(recipe.base).toMatchObject({ contain: "layout", display: "block" });
  });

  it("pads each side from its custom property", () => {
    expect(recipe.base).toMatchObject({
      paddingBlockEnd: `var(${ROOM.blockEnd}, 0px)`,
      paddingBlockStart: `var(${ROOM.blockStart}, 0px)`,
      paddingInlineEnd: `var(${ROOM.inlineEnd}, 0px)`,
      paddingInlineStart: `var(${ROOM.inlineStart}, 0px)`,
    });
  });

  it("matches the Floated JSX tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Floated$/u]);
  });
});
