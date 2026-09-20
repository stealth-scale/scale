import { describe, expect, it } from "vitest";

import { axesOf, recipeViolations, slotsOf } from "@stealthscale/testing-theme";

import { recipe } from "#skip-nav/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["SkipNav.Link", "SkipNav.Target"] })).toStrictEqual(
      [],
    );
  });

  it("names its class skip-nav", () => {
    expect(recipe.className).toBe("skip-nav");
  });

  it("styles the link and the target it jumps to", () => {
    expect(slotsOf(recipe)).toStrictEqual(["link", "target"]);
  });

  it("offers no axis because a way past the navigation reads one way", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("hides the link until focus reaches it", () => {
    expect(recipe.base?.link).toMatchObject({
      _focusVisible: { position: "fixed", srOnly: false, zIndex: "skipNav" },
      srOnly: true,
    });
  });

  it("leaves room above the target so the content is not under a sticky band", () => {
    expect(recipe.base?.target).toStrictEqual({
      scrollMarginBlockStart: "calc({spacing.inset.lg} * var(--density, 1))",
    });
  });

  it("tracks the namespace and every tag whose name opens with SkipNav", () => {
    expect(recipe.jsx).toStrictEqual([/^SkipNav(\.\w+)?$/u]);
  });
});
