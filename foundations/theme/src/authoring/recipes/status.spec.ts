import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import { field, FIELD_EDGE } from "#authoring/recipes/field.ts";
import { fieldStatusVariants, statusEmitted, statusVariants } from "#authoring/recipes/status.ts";

describe("statusVariants", () => {
  it("points the palette at the semantic palette of each status", () => {
    expect(statusVariants()).toStrictEqual({
      error: { colorPalette: "error" },
      info: { colorPalette: "info" },
      success: { colorPalette: "success" },
      warning: { colorPalette: "warning" },
    });
  });

  it("names an intent the recipe checks accept for every status", () => {
    const recipe = defineRecipe({
      className: "x",
      staticCss: [statusEmitted()],
      variants: { status: statusVariants() },
    });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });
});

describe("fieldStatusVariants", () => {
  it("writes the edge property with the line family's member of each status", () => {
    expect(fieldStatusVariants()).toStrictEqual({
      error: {
        _invalid: { [FIELD_EDGE]: "{colors.border.error}" },
        colorPalette: "error",
        [FIELD_EDGE]: "{colors.border.error}",
      },
      info: {
        _invalid: { [FIELD_EDGE]: "{colors.border.info}" },
        colorPalette: "info",
        [FIELD_EDGE]: "{colors.border.info}",
      },
      success: {
        _invalid: { [FIELD_EDGE]: "{colors.border.success}" },
        colorPalette: "success",
        [FIELD_EDGE]: "{colors.border.success}",
      },
      warning: {
        _invalid: { [FIELD_EDGE]: "{colors.border.warning}" },
        colorPalette: "warning",
        [FIELD_EDGE]: "{colors.border.warning}",
      },
    });
  });

  it("draws the error edge in the same token the invalid state draws", () => {
    expect(field()).toMatchObject({
      _invalid: { [FIELD_EDGE]: fieldStatusVariants().error[FIELD_EDGE] },
    });
  });

  it("keeps a field marked wrong in the status it reports rather than in the error edge", () => {
    expect(fieldStatusVariants().warning["_invalid"]).toStrictEqual({
      [FIELD_EDGE]: "{colors.border.warning}",
    });
  });

  it("names a token the recipe checks accept for every status", () => {
    const recipe = defineRecipe({
      className: "x",
      staticCss: [statusEmitted()],
      variants: { status: fieldStatusVariants() },
    });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });
});
