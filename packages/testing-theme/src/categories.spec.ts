import { describe, expect, it } from "vitest";

import { categoryOf, conditionNames, semanticColorPaths, tokenPaths } from "#categories.ts";

describe("categories", () => {
  it("reads the category a utility names outright", () => {
    expect(categoryOf("gap")).toBe("spacing");
    expect(categoryOf("color")).toBe("colors");
    expect(categoryOf("boxShadow")).toBe("shadows");
  });

  it("reads the category a utility asks the theme for", () => {
    expect(categoryOf("height")).toBe("sizes");
    expect(categoryOf("boxSize")).toBe("sizes");
  });

  it("reads the category of a shorthand", () => {
    expect(categoryOf("bg")).toBe("colors");
  });

  it("reads the category of the three compositions the compiler resolves itself", () => {
    expect(categoryOf("textStyle")).toBe("textStyles");
    expect(categoryOf("layerStyle")).toBe("layerStyles");
    expect(categoryOf("animationStyle")).toBe("animationStyles");
  });

  it("returns undefined for a property that reads no token", () => {
    expect(categoryOf("display")).toBeUndefined();
  });

  it("lists the base preset's conditions and the foundation's", () => {
    expect(conditionNames().has("hover")).toBe(true);
    expect(conditionNames().has("narrow")).toBe(true);
    expect(conditionNames().has("hovr")).toBe(false);
  });

  it("lists the reference and the semantic tokens of a category", () => {
    expect(tokenPaths("spacing").has("4")).toBe(true);
    expect(tokenPaths("spacing").has("gap.sm")).toBe(true);
    expect(tokenPaths("sizes").has("control.md")).toBe(true);
  });

  it("lists a group's value with and without its DEFAULT suffix", () => {
    expect(tokenPaths("colors").has("bg")).toBe(true);
    expect(tokenPaths("colors").has("bg.DEFAULT")).toBe(true);
    expect(tokenPaths("colors").has("primary.solid.hover")).toBe(true);
  });

  it("lists the compositions by name", () => {
    expect(tokenPaths("textStyles").has("label.md")).toBe(true);
    expect(tokenPaths("layerStyles").has("fill.solid")).toBe(true);
    expect(tokenPaths("animationStyles").has("scale-fade.in")).toBe(true);
  });

  it("caches the paths of a category per preset", () => {
    expect(tokenPaths("radii")).toBe(tokenPaths("radii"));
    expect(tokenPaths("nope").size).toBe(0);
    expect(tokenPaths("radii", { name: "bare" })).not.toBe(tokenPaths("radii"));
  });

  it("returns no token path for a preset that declares no theme", () => {
    const bare = { name: "bare" };

    expect(tokenPaths("spacing", bare).size).toBe(0);
    expect(tokenPaths("spacing", bare)).toBe(tokenPaths("spacing", bare));
    expect(semanticColorPaths(bare).size).toBe(0);
    expect(semanticColorPaths(bare)).toBe(semanticColorPaths(bare));
    expect(conditionNames(bare).has("hover")).toBe(true);
    expect(conditionNames(bare).has("narrow")).toBe(false);
  });

  it("lists the semantic colors and no step of a ramp", () => {
    expect(semanticColorPaths().has("fg.muted")).toBe(true);
    expect(semanticColorPaths().has("blue.500")).toBe(false);
    expect(semanticColorPaths()).toBe(semanticColorPaths());
  });
});
