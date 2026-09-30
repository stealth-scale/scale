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

const CONTROLLING =
  "& > :not(.field__label, .field__counter, .field__helperText, .field__errorText)";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Field.Root", "Field.Label", "Field.Control"],
        parts: PARTS,
      }),
    ).toStrictEqual([]);
  });

  it("uses the class name field", () => {
    expect(recipe.className).toBe("field");
  });

  it("declares the seven slots", () => {
    expect(recipe.slots).toStrictEqual(PARTS);
  });

  it("declares three axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["orientation", "size", "status"]);
  });

  it("defaults to a vertical field at size md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ orientation: "vertical", size: "md" });
  });

  it("offers three orientations", () => {
    expect(valuesOf(recipe, "orientation")).toStrictEqual(["floating", "horizontal", "vertical"]);
  });

  it("translates a floating label over the control and keeps its row", () => {
    const floating = recipe.variants?.["orientation"]?.["floating"];

    expect(floating?.["label"]).toMatchObject({
      gridColumn: "1 / 2",
      pointerEvents: "none",
      translate: "0 calc(50% + var(--field-drop))",
    });
    expect(floating?.["label"]).not.toHaveProperty("position");
  });

  it("raises a floating label while the control has focus or a value", () => {
    expect(recipe.variants?.["orientation"]?.["floating"]?.["root"]).toMatchObject({
      [`&:has(.field__control:focus) .field__label,
            &:has(.field__control:not(:placeholder-shown)) .field__label`]: {
        color: "fg",
        paddingInline: "0",
        translate: "0 0",
      },
    });
  });

  it("places every part but the label in the second column of a horizontal field", () => {
    const horizontal = recipe.variants?.["orientation"]?.["horizontal"];

    expect(horizontal?.["root"]).toMatchObject({
      [CONTROLLING]: { gridColumn: "2 / 3" },
      gridTemplateColumns: "auto minmax(0, 1fr) auto",
    });
    expect(horizontal?.["helperText"]).toStrictEqual({ gridColumn: "2 / 3" });
    expect(horizontal?.["errorText"]).toStrictEqual({ gridColumn: "2 / 3" });
    expect(horizontal?.["counter"]).toMatchObject({ gridColumn: "3 / 4" });
  });

  it("centres a horizontal label and counter against the control", () => {
    expect(recipe.variants?.["orientation"]?.["horizontal"]?.["label"]).toStrictEqual({
      alignSelf: "center",
      gridColumn: "1 / 2",
    });
    expect(recipe.variants?.["orientation"]?.["horizontal"]?.["counter"]).toStrictEqual({
      alignSelf: "center",
      gridColumn: "3 / 4",
    });
  });

  it("places the counter at the end of the label's row", () => {
    const vertical = recipe.variants?.["orientation"]?.["vertical"];

    expect(recipe.base?.["counter"]).toMatchObject({ justifySelf: "end" });
    expect(vertical?.["label"]).toStrictEqual({ gridColumn: "1 / 2" });
    expect(vertical?.["counter"]).toStrictEqual({ gridColumn: "2 / 3" });
  });

  it.each(["floating", "vertical"] as const)(
    "places a select or a group inside a %s field across the full width",
    (orientation) => {
      expect(recipe.variants?.["orientation"]?.[orientation]?.["root"]).toMatchObject({
        [CONTROLLING]: { gridColumn: "1 / -1" },
      });
    },
  );

  it("gives the helper and error texts the full width under the control", () => {
    const orientation = recipe.variants?.["orientation"];

    expect(orientation?.["floating"]?.["errorText"]).toStrictEqual({ gridColumn: "1 / -1" });
    expect(orientation?.["floating"]?.["helperText"]).toStrictEqual({ gridColumn: "1 / -1" });
    expect(orientation?.["vertical"]?.["errorText"]).toStrictEqual({ gridColumn: "1 / -1" });
    expect(orientation?.["vertical"]?.["helperText"]).toStrictEqual({ gridColumn: "1 / -1" });
  });

  it("sets the texts under an md control in the sm body role", () => {
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

  it("sets the md error text at the snug line height with the md gap", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["errorText"]).toStrictEqual({
      gap: "calc({spacing.gap.md} * var(--density, 1))",
      lineHeight: "snug",
      textStyle: "body.sm",
    });
  });

  it("inks the error text and the required indicator from the palette", () => {
    expect(recipe.base?.["errorText"]).toMatchObject({ color: "colorPalette.fg" });
    expect(recipe.base?.["requiredIndicator"]).toMatchObject({ color: "colorPalette.fg" });
  });

  it("defaults the error text and the required indicator to the error palette", () => {
    expect(recipe.base?.["errorText"]).toMatchObject({ colorPalette: "error" });
    expect(recipe.base?.["requiredIndicator"]).toMatchObject({ colorPalette: "error" });
    expect(recipe.base?.["root"]).not.toHaveProperty("colorPalette");
  });

  it("sets the control's edge from the warning status", () => {
    expect(recipe.variants?.["status"]?.["warning"]?.["control"]).toStrictEqual({
      _invalid: { "--field-edge": "{colors.border.warning}" },
      "--field-edge": "{colors.border.warning}",
      colorPalette: "warning",
    });
  });

  it("lets the control shrink below its content width", () => {
    expect(recipe.base?.["control"]).toMatchObject({ minInlineSize: "0" });
  });

  it("tracks JSX named Field and its parts", () => {
    expect(recipe.jsx).toStrictEqual([/^Field(\.\w+)?$/u]);
  });
});
