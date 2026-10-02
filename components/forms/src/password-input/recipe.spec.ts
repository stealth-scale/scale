import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { trigger } from "#input-group/trigger.ts";
import page from "#password-input/password-input.specimen.tsx";
import { recipe } from "#password-input/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["PasswordInput"] })).toStrictEqual([]);
  });

  it("uses the class name password-input", () => {
    expect(recipe.className).toBe("password-input");
  });

  it("styles the toggle as the input group's square button", () => {
    expect(recipe.base).toStrictEqual(trigger());
  });

  it("declares the size axis only", () => {
    expect(axesOf(recipe)).toStrictEqual(["size"]);
  });

  it("defaults to size md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("offers the eight control sizes", () => {
    expect(valuesOf(recipe, "size")).toHaveLength(8);
  });

  it("tracks JSX named PasswordInput and its parts", () => {
    expect(recipe.jsx).toStrictEqual([/^PasswordInput(\.\w+)?$/u]);
  });
});
