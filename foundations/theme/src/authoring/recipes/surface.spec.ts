import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import { divider, liftVariants, surface } from "#authoring/recipes/surface.ts";

describe("surface", () => {
  it("draws a panel with a hairline edge lifted a little when nothing is stated", () => {
    expect(surface()).toStrictEqual({
      background: "bg.panel",
      borderColor: "border",
      borderRadius: "l2",
      borderWidth: "hairline",
      boxShadow: "sm",
      color: "fg",
    });
  });

  it("lifts the panel to the level it was given", () => {
    expect(surface("xl")).toMatchObject({ boxShadow: "xl" });
  });

  it("offers both lifts when a recipe names none", () => {
    expect(Object.keys(liftVariants())).toStrictEqual(["raised", "floating"]);
  });

  it("lifts a control under a pointer and drops it under a press", () => {
    expect(liftVariants(["raised"])).toStrictEqual({
      raised: {
        _active: { boxShadow: "none" },
        _hover: { boxShadow: "md" },
        boxShadow: "sm",
      },
    });
  });

  it("draws a hairline across the page when nothing is stated", () => {
    expect(divider()).toStrictEqual({
      borderBlockEndWidth: "hairline",
      borderColor: "border",
      inlineSize: "100%",
    });
  });

  it("draws a hairline down the page when asked", () => {
    expect(divider("vertical")).toStrictEqual({
      alignSelf: "stretch",
      borderColor: "border",
      borderInlineEndWidth: "hairline",
    });
  });

  it("passes the recipe checks for a panel and for a hairline", () => {
    expect(recipeViolations(defineRecipe({ base: surface("2xl"), className: "x" }))).toStrictEqual(
      [],
    );
    expect(
      recipeViolations(defineRecipe({ base: divider("vertical"), className: "x" })),
    ).toStrictEqual([]);
  });
});
