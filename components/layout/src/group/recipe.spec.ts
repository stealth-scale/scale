import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#group/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Group"] })).toStrictEqual([]);
  });

  it("names its class group", () => {
    expect(recipe.className).toBe("group");
  });

  it("offers the six axes a group takes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "align",
      "attached",
      "gap",
      "grow",
      "justify",
      "orientation",
    ]);
  });

  it("draws a row at the small gap when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ gap: "sm", orientation: "horizontal" });
  });

  it("offers the five gaps a row of controls reads", () => {
    expect(valuesOf(recipe, "gap")).toStrictEqual(["lg", "md", "sm", "xl", "xs"]);
  });

  it("offers the two directions children run in", () => {
    expect(valuesOf(recipe, "orientation")).toStrictEqual(["horizontal", "vertical"]);
  });

  it("lifts a focused child above its neighbours so its ring is not clipped", () => {
    expect(recipe.base?.["& > *"]).toStrictEqual({ _focusVisible: { zIndex: "1" } });
  });

  it("stops an attached group wrapping onto a second line", () => {
    expect(recipe.variants?.["attached"]).toStrictEqual({
      true: { flexWrap: "nowrap", gap: "0" },
    });
  });

  it("closes the gap from the compound rather than from the attached value", () => {
    expect.hasAssertions();

    for (const compound of recipe.compoundVariants ?? []) {
      expect(compound.css).toMatchObject({ gap: "0" });
    }
  });

  it("squares one pair of corners per direction", () => {
    expect(recipe.compoundVariants?.map((compound) => compound.orientation)).toStrictEqual([
      "horizontal",
      "vertical",
    ]);
  });

  it("pulls a neighbour back by the control's stroke rather than by a length of its own", () => {
    expect(recipe.compoundVariants?.[0]?.css?.["& > *:not(:last-child)"]?.["marginInlineEnd"]).toBe(
      "calc({borderWidths.control} * -1)",
    );
  });

  it("tracks the tag a consumer writes it under", () => {
    expect(recipe.jsx).toStrictEqual([/^Group$/u]);
  });
});
