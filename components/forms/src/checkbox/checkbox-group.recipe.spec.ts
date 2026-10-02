import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations } from "@stealthscale/testing-theme";
import { dense } from "@stealthscale/theme/authoring";

import { AFTER_PARENT, recipe } from "#checkbox/checkbox-group.recipe.ts";
import page from "#checkbox/checkbox.specimen.tsx";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Checkbox.Group"] })).toStrictEqual([]);
  });

  it("sets className to checkbox-group", () => {
    expect(recipe.className).toBe("checkbox-group");
  });

  it("declares the size axis", () => {
    expect(axesOf(recipe)).toStrictEqual(["size"]);
  });

  it("defaults to md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("resets the default styles of a fieldset element", () => {
    expect(recipe.base).toMatchObject({
      borderStyle: "none",
      margin: "0",
      minInlineSize: "0",
      padding: "0",
    });
  });

  it("indents the rows after a parent box by the box and the gap", () => {
    expect(recipe.variants?.["size"]?.["md"]?.[AFTER_PARENT]).toStrictEqual({
      marginInlineStart: dense("calc({sizes.icon.md} + {spacing.gap.md})"),
    });
  });
});
