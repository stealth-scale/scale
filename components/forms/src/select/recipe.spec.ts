import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { CLEARED, cleared, indicated, PLACEHOLDER } from "#select/metrics.ts";
import { recipe } from "#select/recipe.ts";
import page from "#select/select.specimen.tsx";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, { names: ["Select.Root"], parts: [...recipe.slots] }),
    ).toStrictEqual([]);
  });

  it("sets className to select", () => {
    expect(recipe.className).toBe("select");
  });

  it("declares highlight size status and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["highlight", "size", "status", "variant"]);
  });

  it("defaults to an outline select at the middle size with the tint highlight", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ highlight: "tint", size: "md", variant: "outline" });
  });

  it("declares the sizes a field passes down", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("orders the highlights from the quietest", () => {
    expect(Object.keys(recipe.variants?.["highlight"] ?? {})).toStrictEqual([
      "tint",
      "fill",
      "bar",
    ]);
  });

  it("leaves room at the trigger's end for the indicator", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["trigger"]).toMatchObject({
      paddingInlineEnd: indicated("md"),
    });
  });

  it("widens the trigger's end room while the clear trigger shows", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["trigger"]).toMatchObject({
      [CLEARED]: { paddingInlineEnd: cleared("md") },
    });
  });

  it("keeps the smallest inset on the flushed look", () => {
    expect(recipe.variants?.["variant"]?.["flushed"]).toStrictEqual({
      content: { "--dropdown-inset": "calc({spacing.inset.xs} * var(--density, 1))" },
      root: { "--dropdown-inset": "calc({spacing.inset.xs} * var(--density, 1))" },
      trigger: { layerStyle: "field.flushed" },
    });
  });

  it("lets a press on the indicator reach the trigger", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({ pointerEvents: "none" });
  });

  it("dims the indicator of a disabled select", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({ _disabled: { opacity: "disabled" } });
  });

  it("inks the indicator of an invalid select in the error color", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({ _invalid: { color: "fg.error" } });
  });

  it("inks the placeholder in the muted color", () => {
    expect(recipe.base?.["valueText"]).toMatchObject({ [PLACEHOLDER]: { color: "fg.muted" } });
  });

  it("caps the panel at 24rem and the room the window leaves", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      maxBlockSize: "min({sizes.sm}, var(--available-height, {sizes.sm}))",
    });
  });

  it("pads the rows inside the panel's scroll area", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["rows"]).toStrictEqual({
      padding: "calc({spacing.gap.sm} * var(--density, 1))",
    });
  });

  it("keeps the check's column on an unselected row", () => {
    expect(recipe.base?.["itemIndicator"]).toMatchObject({
      "&[data-state=checked]": { visibility: "visible" },
      boxSizing: "content-box",
      visibility: "hidden",
    });
  });
});
