import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import { field, FIELD_EDGE } from "#authoring/recipes/field.ts";
import {
  fieldStatusVariants,
  paletteVariants,
  statusEmitted,
  statusVariants,
} from "#authoring/recipes/status.ts";

describe("statusVariants", () => {
  it("sets colorPalette to the palette of each status", () => {
    expect(statusVariants()).toStrictEqual({
      error: { colorPalette: "error" },
      info: { colorPalette: "info" },
      success: { colorPalette: "success" },
      warning: { colorPalette: "warning" },
    });
  });

  it("returns no recipe violation for any status", () => {
    const recipe = defineRecipe({
      className: "x",
      staticCss: [statusEmitted()],
      variants: { status: statusVariants() },
    });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });
});

describe("paletteVariants", () => {
  it("sets colorPalette to the palette of each value", () => {
    expect(paletteVariants(["primary", "error"])).toStrictEqual({
      error: { colorPalette: "error" },
      primary: { colorPalette: "primary" },
    });
  });

  it("offers every semantic palette when called with no argument", () => {
    expect(Object.keys(paletteVariants()).toSorted()).toStrictEqual([
      "accent",
      "error",
      "info",
      "neutral",
      "primary",
      "secondary",
      "success",
      "warning",
    ]);
  });

  it("returns no recipe violation for any palette", () => {
    const recipe = defineRecipe({ className: "x", variants: { palette: paletteVariants() } });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });
});

describe("fieldStatusVariants", () => {
  it("writes the edge property from the border family member of each status", () => {
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

  it("writes the error edge with the token the invalid state of field uses", () => {
    expect(field()).toMatchObject({
      _invalid: { [FIELD_EDGE]: fieldStatusVariants().error[FIELD_EDGE] },
    });
  });

  it("writes the status edge under _invalid for a status other than error", () => {
    expect(fieldStatusVariants().warning["_invalid"]).toStrictEqual({
      [FIELD_EDGE]: "{colors.border.warning}",
    });
  });

  it("returns no recipe violation for any status", () => {
    const recipe = defineRecipe({
      className: "x",
      staticCss: [statusEmitted()],
      variants: { status: fieldStatusVariants() },
    });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });
});
