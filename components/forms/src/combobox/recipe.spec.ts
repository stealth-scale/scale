import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#combobox/combobox.specimen.tsx";
import { CLEARED, cleared, indicated, triggerEnd } from "#combobox/metrics.ts";
import { recipe } from "#combobox/recipe.ts";
import { glyph } from "#dropdown.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, { names: ["Combobox.Root"], parts: [...recipe.slots] }),
    ).toStrictEqual([]);
  });

  it("sets className to combobox", () => {
    expect(recipe.className).toBe("combobox");
  });

  it("declares highlight size status and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["highlight", "size", "status", "variant"]);
  });

  it("defaults to an outline combobox at the middle size with the tint highlight", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ highlight: "tint", size: "md", variant: "outline" });
  });

  it("declares the sizes a field passes down", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("leaves room at the input's end for the trigger", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["input"]).toMatchObject({
      paddingInlineEnd: indicated("md"),
    });
  });

  it("widens the input's end room while the clear trigger shows", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["input"]).toMatchObject({
      [CLEARED]: { paddingInlineEnd: cleared("md") },
    });
  });

  it("sizes the trigger's glyph to the indicator's glyph at its place", () => {
    expect(recipe.variants?.["size"]?.["lg"]?.["trigger"]).toMatchObject({
      "& svg": { boxSize: glyph("lg") },
      insetInlineEnd: triggerEnd("lg"),
    });
  });

  it("keeps the smallest inset on the flushed look for the input and the panel", () => {
    expect(recipe.variants?.["variant"]?.["flushed"]).toStrictEqual({
      content: { "--dropdown-inset": "calc({spacing.inset.xs} * var(--density, 1))" },
      input: { layerStyle: "field.flushed" },
      root: { "--dropdown-inset": "calc({spacing.inset.xs} * var(--density, 1))" },
    });
  });

  it("hides an open panel with no rows and no empty message", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      "&[data-empty]:not(:has(.combobox__empty))": { visibility: "hidden" },
    });
  });

  it("inks the trigger of an invalid combobox in the error color", () => {
    expect(recipe.base?.["trigger"]).toMatchObject({ _invalid: { color: "fg.error" } });
  });

  it("hides the hidden select visually", () => {
    expect(recipe.base?.["hiddenSelect"]).toStrictEqual({ srOnly: true });
  });
});
