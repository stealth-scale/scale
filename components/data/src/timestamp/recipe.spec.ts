import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, recipeViolations } from "@stealthscale/testing-theme";

import { CLASS, recipe } from "#timestamp/recipe.ts";
import page from "#timestamp/timestamp.specimen.tsx";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Timestamp"] })).toStrictEqual([]);
  });

  it("sets className to timestamp", () => {
    expect(recipe.className).toBe(CLASS);
  });

  it("declares no variant axis", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("writes tabular numerals on one line on the root", () => {
    expect(recipe.base?.["root"]).toStrictEqual({
      fontVariantNumeric: "tabular-nums",
      whiteSpace: "nowrap",
    });
  });

  it("writes the exact form in the muted ink", () => {
    expect(recipe.base?.["exact"]).toStrictEqual({ color: "fg.muted" });
  });
});
