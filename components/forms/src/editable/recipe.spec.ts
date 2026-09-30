import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#editable/editable.specimen.tsx";
import { recipe } from "#editable/recipe.ts";
import { trigger } from "#input-group/trigger.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Editable"] })).toStrictEqual([]);
  });

  it("uses the class name editable", () => {
    expect(recipe.className).toBe("editable");
  });

  it("declares the seven slots", () => {
    expect(recipe.slots).toStrictEqual([
      "root",
      "label",
      "area",
      "preview",
      "input",
      "control",
      "trigger",
    ]);
  });

  it("declares the size axis only", () => {
    expect(axesOf(recipe)).toStrictEqual(["size"]);
  });

  it("defaults to size md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("offers sm md and lg", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("gives the preview and the input one height padding and text at md", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["preview"]).toStrictEqual(
      recipe.variants?.["size"]?.["md"]?.["input"],
    );
  });

  it("fills the pressable preview with bg.muted on hover", () => {
    expect(recipe.base?.["preview"]).toMatchObject({
      "&[role=button]": { _hover: { background: "bg.muted" } },
    });
  });

  it("styles the triggers as the input group's square button", () => {
    expect(recipe.base?.["trigger"]).toStrictEqual(trigger());
  });

  it("tracks JSX named Editable and its parts", () => {
    expect(recipe.jsx).toStrictEqual([/^Editable(\.\w+)?$/u]);
  });
});
