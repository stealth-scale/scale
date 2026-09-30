import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#native-select/native-select.specimen.tsx";
import { recipe } from "#native-select/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, {
        names: ["NativeSelect.Root"],
        parts: ["root", "field", "indicator"],
      }),
    ).toStrictEqual([]);
  });

  it("sets className to native-select", () => {
    expect(recipe.className).toBe("native-select");
  });

  it("declares size status and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["size", "status", "variant"]);
  });

  it("defaults to an outline select at the middle size", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "outline" });
  });

  it("declares xs to xl on the size axis", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm", "xl", "xs"]);
  });

  it("leaves room at the field's end for the indicator", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["field"]).toMatchObject({
      paddingInlineEnd:
        "calc(var(--native-select-inset, calc({spacing.inset.sm} * var(--density, 1))) + calc({sizes.icon.sm} * var(--density, 1)) + calc({spacing.gap.xs} * var(--density, 1)))",
    });
  });

  it("keeps the smallest inset on the flushed look", () => {
    expect(recipe.variants?.["variant"]?.["flushed"]).toStrictEqual({
      field: { layerStyle: "field.flushed" },
      root: { "--native-select-inset": "calc({spacing.inset.xs} * var(--density, 1))" },
    });
  });

  it("lets a press on the indicator reach the select", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({ pointerEvents: "none" });
  });

  it("dims the indicator with a disabled field", () => {
    expect(recipe.base?.["field"]).toMatchObject({
      "&:disabled + .native-select__indicator": { opacity: "disabled" },
    });
  });

  it("inks the indicator with the error color beside an invalid field", () => {
    expect(recipe.base?.["field"]).toMatchObject({
      "&[aria-invalid=true] + .native-select__indicator": { color: "fg.error" },
    });
  });
});
