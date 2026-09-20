import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import { field } from "#authoring/recipes/field.ts";

describe("field", () => {
  it("draws the panel surface with the control's boundary at the control's width", () => {
    expect(field()).toMatchObject({
      background: "bg.panel",
      borderColor: "border.emphasized",
      borderWidth: "control",
      color: "fg",
    });
  });

  it("darkens the edge to the tertiary ink under a pointer", () => {
    expect(field()).toMatchObject({ _hover: { borderColor: "fg.subtle" } });
  });

  it("draws the placeholder in the muted ink", () => {
    expect(field()).toMatchObject({ _placeholder: { color: "fg.muted" } });
  });

  it("draws an invalid field in the error palette", () => {
    expect(field()).toMatchObject({
      _invalid: { borderColor: "border.error", focusRingColor: "error.focusRing" },
    });
  });

  it("draws the focus ring inside the box", () => {
    expect(field()).toMatchObject({
      focusRingColor: "colorPalette.focusRing",
      focusVisibleRing: "inside",
    });
  });

  it("reads the disabled look and the subtle surface for a read-only field", () => {
    expect(field()).toMatchObject({
      _disabled: { layerStyle: "disabled" },
      _readOnly: { background: "bg.subtle" },
    });
  });

  it("raises the field to the middle control height on a coarse pointer", () => {
    expect(field()).toMatchObject({ _touch: { minBlockSize: "control.md" } });
  });

  it("settles at the pace and the curve every pressed control settles at", () => {
    expect(field()).toMatchObject({
      transitionDuration: "press",
      transitionProperty: "common",
      transitionTimingFunction: "press",
    });
  });

  it("passes the recipe checks", () => {
    expect(recipeViolations(defineRecipe({ base: field(), className: "x" }))).toStrictEqual([]);
  });
});
