import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, recipeViolations, slotsOf } from "@stealthscale/testing-theme";

import { recipe } from "#skip-nav/recipe.ts";
import page from "#skip-nav/skip-nav.specimen.tsx";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["SkipNav.Link", "SkipNav.Target"] })).toStrictEqual(
      [],
    );
  });

  it("sets className to skip-nav", () => {
    expect(recipe.className).toBe("skip-nav");
  });

  it("declares the link and target slots", () => {
    expect(slotsOf(recipe)).toStrictEqual(["link", "target"]);
  });

  it("declares no variant axis", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("clips the link at rest", () => {
    expect(recipe.base?.link).toMatchObject({ srOnly: true });
  });

  it("fixes the link under focus-visible", () => {
    expect(recipe.base?.link).toMatchObject({
      _focusVisible: { clip: "auto", position: "fixed", zIndex: "skipNav" },
    });
  });

  it("sets no srOnly on the link under focus-visible", () => {
    expect(recipe.base?.link?.["_focusVisible"]).not.toHaveProperty("srOnly");
  });

  it("sets a density-scaled scroll margin on the target", () => {
    expect(recipe.base?.target).toStrictEqual({
      scrollMarginBlockStart: "calc({spacing.inset.lg} * var(--density, 1))",
    });
  });

  it("matches the SkipNav JSX tags", () => {
    expect(recipe.jsx).toStrictEqual([/^SkipNav(\.\w+)?$/u]);
  });
});
