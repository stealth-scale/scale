import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations } from "@stealthscale/testing-theme";

import { triggerSide } from "#input-group/trigger.ts";
import page from "#phone-input/phone-input.specimen.tsx";
import { recipe } from "#phone-input/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["PhoneInput"] })).toStrictEqual([]);
  });

  it("sets className to phone-input", () => {
    expect(recipe.className).toBe("phone-input");
  });

  it("declares seven slots", () => {
    expect(recipe.slots).toStrictEqual([
      "picker",
      "label",
      "trigger",
      "flag",
      "name",
      "dial",
      "indicator",
    ]);
  });

  it("declares a size axis at md by default", () => {
    expect([axesOf(recipe), defaultsOf(recipe)]).toStrictEqual([["size"], { size: "md" }]);
  });

  it("hides the picker's label visually", () => {
    expect(recipe.base?.["label"]).toStrictEqual({ srOnly: true });
  });

  it("hides the country's name visually", () => {
    expect(recipe.base?.["name"]).toStrictEqual({ srOnly: true });
  });

  it("sizes the button to the input group's square trigger", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["trigger"]).toStrictEqual({
      blockSize: triggerSide("md"),
      minInlineSize: triggerSide("md"),
    });
  });

  it("sets the button in the group's text", () => {
    expect(recipe.base?.["trigger"]).toMatchObject({ font: "inherit" });
  });
});
