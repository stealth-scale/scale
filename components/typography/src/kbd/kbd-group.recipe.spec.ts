import { describe, expect, it } from "vitest";

import { axesOf, recipeViolations } from "@stealthscale/testing-theme";

import { recipe } from "#kbd/kbd-group.recipe.ts";

describe("recipe", () => {
  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Kbd.Group"] })).toStrictEqual([]);
  });

  it("sets className to kbd-group", () => {
    expect(recipe.className).toBe("kbd-group");
  });

  it("declares no variant axis", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("lays the keycaps in a row the xs gap apart", () => {
    expect(recipe.base).toMatchObject({
      display: "inline-flex",
      gap: "calc({spacing.gap.xs} * var(--density, 1))",
    });
  });

  it("keeps a combination on one line", () => {
    expect(recipe.base).toMatchObject({ whiteSpace: "nowrap" });
  });

  it("matches the Kbd.Group JSX tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Kbd\.Group$/u]);
  });
});
