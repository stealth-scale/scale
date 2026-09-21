import { describe, expect, it } from "vitest";

import { axesOf, recipeViolations, slotsOf } from "@stealthscale/testing-theme";

import { recipe } from "#skip-nav/recipe.ts";

describe("recipe", () => {
  it("reports no violation across the shared recipe checks", () => {
    expect(recipeViolations(recipe, { names: ["SkipNav.Link", "SkipNav.Target"] })).toStrictEqual(
      [],
    );
  });

  it("sets className to skip-nav", () => {
    expect(recipe.className).toBe("skip-nav");
  });

  it("declares link and target as its only slots", () => {
    expect(slotsOf(recipe)).toStrictEqual(["link", "target"]);
  });

  it("declares no variants", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("clips the link and cancels the clipping under focus-visible", () => {
    expect(recipe.base?.link).toMatchObject({
      _focusVisible: { position: "fixed", srOnly: false, zIndex: "skipNav" },
      srOnly: true,
    });
  });

  it("sets a density-scaled scroll margin as the target's only declaration", () => {
    expect(recipe.base?.target).toStrictEqual({
      scrollMarginBlockStart: "calc({spacing.inset.lg} * var(--density, 1))",
    });
  });

  it("matches SkipNav and its dotted parts with its jsx pattern", () => {
    expect(recipe.jsx).toStrictEqual([/^SkipNav(\.\w+)?$/u]);
  });
});
