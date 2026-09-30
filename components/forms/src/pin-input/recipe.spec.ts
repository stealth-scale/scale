import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#pin-input/pin-input.specimen.tsx";
import { recipe } from "#pin-input/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["PinInput"] })).toStrictEqual([]);
  });

  it("uses the class name pin-input", () => {
    expect(recipe.className).toBe("pin-input");
  });

  it("declares the four slots", () => {
    expect(recipe.slots).toStrictEqual(["root", "label", "control", "input"]);
  });

  it("declares the attached size status and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["attached", "size", "status", "variant"]);
  });

  it("defaults to outline boxes at size md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "outline" });
  });

  it("offers the control sizes from xs to xl", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm", "xl", "xs"]);
  });

  it("offers the three field looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["flushed", "outline", "subtle"]);
  });

  it("squares the md box on the control scale", () => {
    expect(recipe.variants?.["size"]?.["md"]).toMatchObject({
      input: { boxSize: "calc({sizes.control.md} * var(--density, 1))" },
    });
  });

  it("clears the fieldset's edge margin and padding", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      borderStyle: "none",
      margin: "0",
      minInlineSize: "0",
      padding: "0",
    });
  });

  it("widens a box to a medium control square under a coarse pointer", () => {
    expect(recipe.base?.["input"]).toMatchObject({
      _touch: { minBlockSize: "control.md", minInlineSize: "control.md" },
    });
  });

  it("overlaps attached boxes by one edge width", () => {
    expect(recipe.variants?.["attached"]?.["true"]).toMatchObject({
      input: { "&:not(:first-child)": { marginInlineStart: "calc({borderWidths.control} * -1)" } },
    });
  });

  it("closes the gap between attached boxes in a compound", () => {
    expect(recipe.compoundVariants?.find((compound) => compound.attached === true)).toMatchObject({
      css: { control: { gap: "0" } },
    });
  });

  it("raises a focused attached box above a hovered one", () => {
    expect(recipe.variants?.["attached"]?.["true"]).toMatchObject({
      input: { _focusVisible: { zIndex: "2" }, _hover: { zIndex: "1" } },
    });
  });

  it("tracks JSX named PinInput and its parts", () => {
    expect(recipe.jsx).toStrictEqual([/^PinInput(\.\w+)?$/u]);
  });
});
