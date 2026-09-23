import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#group/group.specimen.tsx";
import { recipe } from "#group/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Group"] })).toStrictEqual([]);
  });

  it("sets className to group", () => {
    expect(recipe.className).toBe("group");
  });

  it("declares seven variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "align",
      "attached",
      "dim",
      "gap",
      "grow",
      "justify",
      "orientation",
    ]);
  });

  it("applies the dim.others layer style on the dim value", () => {
    expect(recipe.variants?.["dim"]?.["true"]).toStrictEqual({ layerStyle: "dim.others" });
  });

  it("defaults to a horizontal group at the sm gap", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ gap: "sm", orientation: "horizontal" });
  });

  it("declares five gaps on the gap axis", () => {
    expect(valuesOf(recipe, "gap")).toStrictEqual(["lg", "md", "sm", "xl", "xs"]);
  });

  it("declares two orientations on the orientation axis", () => {
    expect(valuesOf(recipe, "orientation")).toStrictEqual(["horizontal", "vertical"]);
  });

  it("raises a focused child above its neighbours in the base", () => {
    expect(recipe.base?.["& > *"]).toStrictEqual({ _focusVisible: { zIndex: "1" } });
  });

  it("disables wrapping on the attached value", () => {
    expect(recipe.variants?.["attached"]).toStrictEqual({
      true: { flexWrap: "nowrap", gap: "0" },
    });
  });

  it("sets a zero gap in every compound", () => {
    expect.hasAssertions();

    for (const compound of recipe.compoundVariants ?? []) {
      expect(compound.css).toMatchObject({ gap: "0" });
    }
  });

  it("declares one attached compound per orientation", () => {
    expect(recipe.compoundVariants?.map((compound) => compound.orientation)).toStrictEqual([
      "horizontal",
      "vertical",
    ]);
  });

  it("overlaps horizontal neighbours by the control border width", () => {
    expect(recipe.compoundVariants?.[0]?.css?.["& > *:not(:last-child)"]?.["marginInlineEnd"]).toBe(
      "calc({borderWidths.control} * -1)",
    );
  });

  it("matches the Group JSX tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Group$/u]);
  });
});
