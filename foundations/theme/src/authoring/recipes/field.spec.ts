import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import {
  field,
  FIELD_EDGE,
  WITHIN_DISABLED,
  WITHIN_FOCUS,
  WITHIN_INVALID,
  WITHIN_READ_ONLY,
  wrappedField,
} from "#authoring/recipes/field.ts";

describe("field", () => {
  it("sets the panel surface and an edge at the control stroke width", () => {
    expect(field()).toMatchObject({
      background: "bg.panel",
      borderColor: `var(${FIELD_EDGE})`,
      borderWidth: "control",
      color: "fg",
      [FIELD_EDGE]: "{colors.border.emphasized}",
    });
  });

  it("writes the tertiary ink to the edge under hover", () => {
    expect(field()).toMatchObject({ _hover: { [FIELD_EDGE]: "{colors.fg.subtle}" } });
  });

  it("sets the placeholder in the muted ink", () => {
    expect(field()).toMatchObject({ _placeholder: { color: "fg.muted" } });
  });

  it("writes the error edge and ring color under the invalid state", () => {
    expect(field()).toMatchObject({
      _invalid: { [FIELD_EDGE]: "{colors.border.error}", focusRingColor: "error.focusRing" },
    });
  });

  it("insets the focus ring by the ring width", () => {
    expect(field()).toMatchObject({
      _focusVisible: { outlineOffset: "calc({borderWidths.ring} * -1)" },
      focusRingColor: "colorPalette.focusRing",
      focusVisibleRing: "inside",
    });
  });

  it("applies the disabled layer style under the disabled state", () => {
    expect(field()).toMatchObject({ _disabled: { layerStyle: "disabled" } });
  });

  it("sets the subtle surface under the read-only state", () => {
    expect(field()).toMatchObject({ _readOnly: { background: "bg.subtle" } });
  });

  it("sets the md control height as the least height under a coarse pointer", () => {
    expect(field()).toMatchObject({ _touch: { minBlockSize: "control.md" } });
  });

  it("transitions at the press duration and easing", () => {
    expect(field()).toMatchObject({
      transitionDuration: "press",
      transitionProperty: "common",
      transitionTimingFunction: "press",
    });
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(defineRecipe({ base: field(), className: "x" }))).toStrictEqual([]);
  });
});

describe("wrappedField", () => {
  it("sets the same surface and edge as a field", () => {
    expect(wrappedField()).toMatchObject({
      background: "bg.panel",
      borderColor: `var(${FIELD_EDGE})`,
      borderWidth: "control",
      color: "fg",
      [FIELD_EDGE]: "{colors.border.emphasized}",
    });
  });

  it.each([WITHIN_DISABLED, WITHIN_FOCUS, WITHIN_INVALID, WITHIN_READ_ONLY])(
    "writes the box state %s",
    (selector) => {
      expect(wrappedField()).toHaveProperty([selector]);
    },
  );

  it("reads no state from the box element itself", () => {
    const wrapped = wrappedField();

    expect(wrapped).not.toHaveProperty("_readOnly");
    expect(wrapped).not.toHaveProperty("_invalid");
  });

  it("matches keyboard focus on form controls only", () => {
    expect(WITHIN_FOCUS).toBe(
      "&:has(:is(input, select, textarea):is(:focus-visible, [data-focus-visible]))",
    );
  });

  it("matches a box that contains no enabled control", () => {
    expect(WITHIN_DISABLED).toBe("&:not(:has(:is(input, select, textarea):enabled))");
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(defineRecipe({ base: wrappedField(), className: "x" }))).toStrictEqual(
      [],
    );
  });
});
