import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe, SCROLLER, VIEWPORT, WINDOW_HEIGHT } from "#screen/recipe.ts";

describe("recipe", () => {
  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Screen"] })).toStrictEqual([]);
  });

  it("sets className to screen", () => {
    expect(recipe.className).toBe("screen");
  });

  it("declares a scrolls axis and a size axis", () => {
    expect(axesOf(recipe)).toStrictEqual(["scrolls", "size"]);
  });

  it("sets no default height", () => {
    expect(defaultsOf(recipe)).toStrictEqual({});
  });

  it("offers the named sizes from xs to xl", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm", "xl", "xs"]);
  });

  it("contains the layout of its descendants", () => {
    expect(recipe.base).toMatchObject({ contain: "layout", overflow: "clip" });
  });

  it("fills the box with the panel surface", () => {
    expect(recipe.base).toMatchObject({ background: "bg.panel", color: "fg" });
  });

  it("edges the box with a hairline at the l2 radius", () => {
    expect(recipe.base).toMatchObject({
      borderColor: "border",
      borderRadius: "l2",
      borderWidth: "hairline",
    });
  });

  it("sets a named height with the window height inside the edges", () => {
    expect(recipe.variants?.["size"]?.["lg"]).toStrictEqual({
      blockSize: "lg",
      [WINDOW_HEIGHT]: "calc({sizes.lg} - {borderWidths.hairline} * 2)",
    });
  });

  it("fills the box with its scroll area when scrolls is true", () => {
    expect(recipe.variants?.["scrolls"]?.["true"]?.[SCROLLER]).toStrictEqual({ blockSize: "full" });
  });

  it("stops a scroll of the viewport at its ends when scrolls is true", () => {
    expect(recipe.variants?.["scrolls"]?.["true"]?.[VIEWPORT]).toStrictEqual({
      overscrollBehavior: "contain",
    });
  });

  it("leaves the scrolling to the scroll area", () => {
    expect(recipe.variants?.["scrolls"]?.["true"]).not.toHaveProperty("overflowY");
  });

  it("names the property a shell reads as its window's height", () => {
    expect(WINDOW_HEIGHT).toBe("--app-shell-window-height");
  });

  it("matches the Screen JSX tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Screen$/u]);
  });
});
