import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#field/field.specimen.tsx";
import { recipe } from "#field/recipe.ts";

const PARTS = [
  "root",
  "label",
  "requiredIndicator",
  "control",
  "helperText",
  "counter",
  "errorText",
];

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("writes no value a theme cannot move", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Field.Root", "Field.Label", "Field.Control"],
        parts: PARTS,
      }),
    ).toStrictEqual([]);
  });

  it("names its class field", () => {
    expect(recipe.className).toBe("field");
  });

  it("styles the seven parts a field draws", () => {
    expect(recipe.slots).toStrictEqual(PARTS);
  });

  it("offers an orientation axis and a size axis and a status axis", () => {
    expect(axesOf(recipe)).toStrictEqual(["orientation", "size", "status"]);
  });

  it("stacks the label above the control at the middle size when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ orientation: "vertical", size: "md" });
  });

  it("offers the three places a label sits", () => {
    expect(valuesOf(recipe, "orientation")).toStrictEqual(["floating", "horizontal", "vertical"]);
  });

  it("drops a floating label over the control and keeps the row it came from", () => {
    const floating = recipe.variants?.["orientation"]?.["floating"];

    expect(floating?.["label"]).toMatchObject({
      gridColumn: "1 / 2",
      pointerEvents: "none",
      translate: "0 calc(50% + var(--field-drop))",
    });
    expect(floating?.["label"]).not.toHaveProperty("position");
  });

  it("raises a floating label off the control that holds focus or holds something", () => {
    expect(recipe.variants?.["orientation"]?.["floating"]?.["root"]).toMatchObject({
      [`&:has(.field__control:focus) .field__label,
            &:has(.field__control:not(:placeholder-shown)) .field__label`]: {
        color: "fg",
        paddingInline: "0",
        translate: "0 0",
      },
    });
  });

  it("stacks every part but the label under the control when the label sits beside it", () => {
    const horizontal = recipe.variants?.["orientation"]?.["horizontal"];

    expect(horizontal?.["root"]).toMatchObject({
      gridTemplateColumns: "auto minmax(0, 1fr) auto",
    });

    expect(horizontal?.["control"]).toStrictEqual({ gridColumn: "2 / 3" });
    expect(horizontal?.["helperText"]).toStrictEqual({ gridColumn: "2 / 3" });
    expect(horizontal?.["errorText"]).toStrictEqual({ gridColumn: "2 / 3" });
    expect(horizontal?.["counter"]).toStrictEqual({ gridColumn: "3 / 4" });
  });

  it("centres the label against the control it names rather than topping the field with it", () => {
    expect(recipe.variants?.["orientation"]?.["horizontal"]?.["label"]).toStrictEqual({
      alignSelf: "center",
      gridColumn: "1 / 2",
    });
  });

  it("stands the count at the end of the label's row rather than the message's", () => {
    const vertical = recipe.variants?.["orientation"]?.["vertical"];

    expect(recipe.base?.["counter"]).toMatchObject({ justifySelf: "end" });
    expect(vertical?.["label"]).toStrictEqual({ gridColumn: "1 / 2" });
    expect(vertical?.["counter"]).toStrictEqual({ gridColumn: "2 / 3" });
  });

  it("leaves the message the whole width under the control wherever the label sits", () => {
    const orientation = recipe.variants?.["orientation"];

    expect(orientation?.["floating"]?.["errorText"]).toStrictEqual({ gridColumn: "1 / -1" });
    expect(orientation?.["floating"]?.["helperText"]).toStrictEqual({ gridColumn: "1 / -1" });
    expect(orientation?.["vertical"]?.["errorText"]).toStrictEqual({ gridColumn: "1 / -1" });
    expect(orientation?.["vertical"]?.["helperText"]).toStrictEqual({ gridColumn: "1 / -1" });
  });

  it("reads the text under a control a step below the control's own words", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["counter"]).toStrictEqual({
      lineHeight: "snug",
      textStyle: "body.sm",
    });
    expect(recipe.variants?.["size"]?.["md"]?.["helperText"]).toStrictEqual({
      lineHeight: "snug",
      textStyle: "body.sm",
    });
    expect(recipe.variants?.["size"]?.["md"]?.["label"]).toStrictEqual({ textStyle: "label.md" });
  });

  it("sets the text under a control tighter than a passage and looser than the label", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["errorText"]).toStrictEqual({
      gap: "calc({spacing.gap.md} * var(--density, 1))",
      lineHeight: "snug",
      textStyle: "body.sm",
    });
  });

  it("draws the message and the required mark in the palette the status sets", () => {
    expect(recipe.base?.["errorText"]).toMatchObject({ color: "colorPalette.fg" });
    expect(recipe.base?.["requiredIndicator"]).toMatchObject({ color: "colorPalette.fg" });
  });

  it("points the parts reporting a fault at the error palette and leaves the root without one", () => {
    expect(recipe.base?.["errorText"]).toMatchObject({ colorPalette: "error" });
    expect(recipe.base?.["requiredIndicator"]).toMatchObject({ colorPalette: "error" });
    expect(recipe.base?.["root"]).not.toHaveProperty("colorPalette");
  });

  it("draws the control's edge in the status the field reports", () => {
    expect(recipe.variants?.["status"]?.["warning"]?.["control"]).toStrictEqual({
      _invalid: { "--field-edge": "{colors.border.warning}" },
      "--field-edge": "{colors.border.warning}",
      colorPalette: "warning",
    });
  });

  it("wraps a long word rather than pushing the control out of the field", () => {
    expect(recipe.base?.["control"]).toMatchObject({ minInlineSize: "0" });
  });

  it("tracks the field and every part under its namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^Field(\.\w+)?$/u]);
  });
});
