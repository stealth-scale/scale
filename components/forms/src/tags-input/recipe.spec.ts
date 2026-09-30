import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { trigger } from "#input-group/trigger.ts";
import { recipe } from "#tags-input/recipe.ts";
import page from "#tags-input/tags-input.specimen.tsx";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["TagsInput"] })).toStrictEqual([]);
  });

  it("uses the class name tags-input", () => {
    expect(recipe.className).toBe("tags-input");
  });

  it("declares the eight slots", () => {
    expect(recipe.slots).toStrictEqual([
      "root",
      "label",
      "control",
      "input",
      "item",
      "itemPreview",
      "itemInput",
      "clearTrigger",
    ]);
  });

  it("declares the size status and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["size", "status", "variant"]);
  });

  it("defaults to size md in the outline look", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "outline" });
  });

  it("offers sm md and lg", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("gives the input and the item input a tag's height at md", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["input"]?.["blockSize"]).toBe(
      recipe.variants?.["size"]?.["md"]?.["itemInput"]?.["blockSize"],
    );
  });

  it("rings a highlighted tag in the field's ring color", () => {
    expect(recipe.base?.["itemPreview"]).toMatchObject({
      _highlighted: { outlineColor: "var(--focus-ring-color)" },
    });
  });

  it("styles the clear trigger as the input group's square button", () => {
    expect(recipe.base?.["clearTrigger"]).toMatchObject(trigger());
  });

  it("places the clear trigger at the control's end out of the flow", () => {
    expect(recipe.base?.["clearTrigger"]).toMatchObject({
      insetInlineEnd: "var(--tags-input-end)",
      position: "absolute",
    });
  });

  it("widens the control's end padding while the clear trigger shows at md", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["control"]).toMatchObject({
      "&:has(> .tags-input__clearTrigger:not([hidden]))": {
        paddingInlineEnd:
          "calc(var(--tags-input-end) + max({sizes.6}, calc({sizes.tag.md} * var(--density, 1))) + calc({spacing.gap.xs} * var(--density, 1)))",
      },
    });
  });

  it("drops the flushed control's inline padding", () => {
    expect(recipe.variants?.["variant"]?.["flushed"]?.["control"]).toMatchObject({
      paddingInline: "0",
    });
  });

  it("tracks JSX named TagsInput and its parts", () => {
    expect(recipe.jsx).toStrictEqual([/^TagsInput(\.\w+)?$/u]);
  });
});
